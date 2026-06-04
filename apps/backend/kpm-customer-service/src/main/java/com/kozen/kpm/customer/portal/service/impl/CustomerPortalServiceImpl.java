package com.kozen.kpm.customer.portal.service.impl;

import com.kozen.kpm.common.auth.AuthTokenUtil;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.customer.portal.config.CustomerPortalProperties;
import com.kozen.kpm.customer.portal.converter.CustomerPortalConverter;
import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalCodeResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalDataDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalLoginResponse;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMeDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalMessageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentPageDto;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskCommentRequest;
import com.kozen.kpm.customer.portal.dto.CustomerPortalTaskRequest;
import com.kozen.kpm.customer.portal.entity.CustomerPortalContactEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalSupportOwnerEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskCommentEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskEntity;
import com.kozen.kpm.customer.portal.mapper.CustomerPortalMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.concurrent.TimeUnit;
import java.util.List;
import java.util.Map;

@Service
public class CustomerPortalServiceImpl implements com.kozen.kpm.customer.portal.service.CustomerPortalService {
    private static final Logger log = LoggerFactory.getLogger(CustomerPortalServiceImpl.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final String OTP_KEY_PREFIX = "kpm:customer-portal:otp:";

    private final CustomerPortalMapper mapper;
    private final CustomerPortalConverter converter;
    private final CustomerPortalProperties properties;
    private final StringRedisTemplate redisTemplate;
    private final JavaMailSender mailSender;
    private final String tokenSecret;

    public CustomerPortalServiceImpl(
            CustomerPortalMapper mapper,
            CustomerPortalConverter converter,
            CustomerPortalProperties properties,
            StringRedisTemplate redisTemplate,
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${kpm.auth.token-secret:" + AuthTokenUtil.DEFAULT_SECRET + "}") String tokenSecret
    ) {
        this.mapper = mapper;
        this.converter = converter;
        this.properties = properties;
        this.redisTemplate = redisTemplate;
        this.mailSender = mailSenderProvider.getIfAvailable();
        this.tokenSecret = tokenSecret;
    }

    @Override
    @Transactional
    public CustomerPortalCodeResponse requestCode(CustomerPortalCodeRequest request, String requestIp) {
        String email = normalizeEmail(request.email());
        CustomerPortalContactEntity contact = requireContact(email);
        String code = generateCode();
        long ttlSeconds = Math.max(60, properties.getCodeTtlSeconds());
        redisTemplate.opsForValue().set(otpKey(email), hash(email, code), ttlSeconds, TimeUnit.SECONDS);
        sendCodeMail(contact, code);
        if (properties.isOtpDebugEnabled()) {
            log.info("Customer portal OTP generated for {}: {}", email, code);
        }
        return new CustomerPortalCodeResponse(
                true,
                Math.max(60, properties.getCodeTtlSeconds()),
                "验证码已发送到联系人邮箱",
                properties.isOtpDebugEnabled() ? code : null
        );
    }

    @Override
    @Transactional
    public CustomerPortalLoginResponse login(CustomerPortalLoginRequest request) {
        String email = normalizeEmail(request.email());
        CustomerPortalContactEntity contact = requireContact(email);
        String key = otpKey(email);
        String expectedHash = redisTemplate.opsForValue().get(key);
        if (expectedHash == null || expectedHash.isBlank()) {
            throw new IllegalArgumentException("验证码不存在或已过期，请重新获取");
        }
        if (!hash(email, request.code()).equals(expectedHash)) {
            throw new IllegalArgumentException("验证码不正确");
        }
        redisTemplate.delete(key);
        String token = AuthTokenUtil.issue(email, contact.getContactName(), properties.getTokenTtlSeconds(), tokenSecret);
        return new CustomerPortalLoginResponse(token, "Bearer", properties.getTokenTtlSeconds(), converter.toMeDto(contact));
    }

    @Override
    public String refreshToken(String authorizationHeader) {
        CustomerPortalContactEntity contact = currentContact(authorizationHeader);
        return AuthTokenUtil.issue(contact.getEmail(), contact.getContactName(), properties.getTokenTtlSeconds(), tokenSecret);
    }

    @Override
    public CustomerPortalMeDto me(String authorizationHeader) {
        return converter.toMeDto(currentContact(authorizationHeader));
    }

    @Override
    public CustomerPortalDataDto data(String authorizationHeader) {
        CustomerPortalContactEntity contact = currentContact(authorizationHeader);
        String customerId = contact.getCustomerId();
        return new CustomerPortalDataDto(
                converter.toMeDto(contact),
                mapper.projects(customerId).stream().map(converter::toProjectDto).toList(),
                mapper.publicMaterials(customerId).stream().map(converter::toMaterialDto).toList(),
                mapper.tasks(customerId).stream().map(converter::toTaskDto).toList(),
                mapper.announcements(customerId).stream().map(converter::toAnnouncementDto).toList(),
                mapper.messages(contact.getEmail(), false).stream().map(converter::toMessageDto).toList(),
                mapper.unreadCount(contact.getEmail())
        );
    }

    @Override
    @Transactional
    public CustomerPortalTaskDto createTask(String authorizationHeader, CustomerPortalTaskRequest request) {
        CustomerPortalContactEntity contact = currentContact(authorizationHeader);
        if (mapper.linkedProjectCount(contact.getCustomerId(), request.projectId()) == 0) {
            throw new IllegalArgumentException("该项目未与当前客户关联，不能创建任务");
        }
        List<CustomerPortalSupportOwnerEntity> supportOwners = mapper.supportOwners(contact.getCustomerId());
        if (supportOwners.isEmpty()) {
            throw new IllegalArgumentException("当前客户未配置技术支持负责人，无法自动分配任务");
        }
        String id = IdUtil.nanoId("task");
        String taskNo = contact.getCustomerShortName().trim().toUpperCase() + mapper.nextTaskNumber();
        String category = firstNonBlank(mapper.enumExactValue("task_category", "技术支持"), mapper.enumValue("task_category", "DEFAULT"), "技术支持");
        String status = firstNonBlank(mapper.enumValue("task_status", "DEFAULT"), "待处理");
        String priority = firstNonBlank(request.priority(), mapper.enumValue("task_priority", "DEFAULT"), "中");
        String creator = "客户:" + contact.getContactName() + "<" + contact.getEmail() + ">";
        mapper.insertTask(id, taskNo, request.title().trim(), request.description().trim(), request.projectId(), category, status, priority, creator, contact.getCustomerId());
        for (CustomerPortalSupportOwnerEntity owner : supportOwners) {
            mapper.insertAssignee(id, owner.getUserId(), owner.getName());
        }
        publishNotification(id, taskNo, request.title(), contact, supportOwners);
        mapper.insertPortalMessage(
                contact.getCustomerId(),
                contact.getContactId(),
                contact.getEmail(),
                "任务已提交：" + taskNo,
                "你提交的任务“" + request.title().trim() + "”已进入 KPM，并分配给 Kozen 技术支持负责人。",
                "task",
                request.projectId(),
                id
        );
        return converter.toTaskDto(mapper.task(contact.getCustomerId(), id));
    }


    @Override
    public CustomerPortalTaskCommentPageDto taskComments(String authorizationHeader, String taskId, int page, int pageSize) {
        CustomerPortalContactEntity contact = currentContact(authorizationHeader);
        if (mapper.customerTaskCount(contact.getCustomerId(), taskId) == 0) {
            throw new IllegalArgumentException("该任务不属于当前客户，不能查看留言");
        }
        int safePage = Math.max(1, page);
        int safePageSize = Math.min(50, Math.max(1, pageSize));
        int offset = (safePage - 1) * safePageSize;
        long total = mapper.externalTaskCommentCount(contact.getCustomerId(), taskId);
        List<CustomerPortalTaskCommentEntity> records = mapper.externalTaskCommentsPage(contact.getCustomerId(), taskId, safePageSize, offset);
        return new CustomerPortalTaskCommentPageDto(
                records.stream().map(converter::toTaskCommentDto).toList(),
                safePage,
                safePageSize,
                total,
                offset + records.size() < total
        );
    }

    @Override
    @Transactional
    public CustomerPortalTaskDto addTaskComment(String authorizationHeader, String taskId, CustomerPortalTaskCommentRequest request) {
        CustomerPortalContactEntity contact = currentContact(authorizationHeader);
        if (mapper.customerTaskCount(contact.getCustomerId(), taskId) == 0) {
            throw new IllegalArgumentException("该任务不属于当前客户，不能留言");
        }
        boolean hasText = request.content() != null && !request.content().isBlank();
        boolean hasFiles = request.attachments() != null && !request.attachments().isEmpty();
        if (!hasText && !hasFiles) {
            throw new IllegalArgumentException("留言内容或附件不能为空");
        }
        String author = "客户:" + contact.getContactName() + "<" + contact.getEmail() + ">";
        mapper.insertExternalTaskComment(IdUtil.nanoId("tc"), taskId, author, request.content(), request.safeAttachments());
        CustomerPortalTaskEntity task = mapper.task(contact.getCustomerId(), taskId);
        publishCustomerCommentNotification(taskId, task == null ? taskId : firstNonBlank(task.getTaskNo(), task.getTitle(), taskId), request.content(), contact);
        return converter.toTaskDto(mapper.task(contact.getCustomerId(), taskId));
    }

    @Override
    public List<CustomerPortalMessageDto> messages(String authorizationHeader, boolean unreadOnly) {
        CustomerPortalContactEntity contact = currentContact(authorizationHeader);
        return mapper.messages(contact.getEmail(), unreadOnly).stream().map(converter::toMessageDto).toList();
    }

    @Override
    public int unreadCount(String authorizationHeader) {
        return mapper.unreadCount(currentContact(authorizationHeader).getEmail());
    }

    @Override
    @Transactional
    public boolean markMessageRead(String authorizationHeader, String messageId) {
        return mapper.markMessageRead(currentContact(authorizationHeader).getEmail(), messageId) > 0;
    }

    @Override
    @Transactional
    public int markAllMessagesRead(String authorizationHeader) {
        return mapper.markAllMessagesRead(currentContact(authorizationHeader).getEmail());
    }

    private CustomerPortalContactEntity currentContact(String authorizationHeader) {
        String token = bearerToken(authorizationHeader);
        Map<String, Object> claims = AuthTokenUtil.verify(token, tokenSecret);
        return requireContact(String.valueOf(claims.get("account")));
    }

    private String bearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("缺少客户门户登录凭证");
        }
        return authorizationHeader.substring("Bearer ".length()).trim();
    }

    private CustomerPortalContactEntity requireContact(String email) {
        CustomerPortalContactEntity contact = mapper.contactByEmail(normalizeEmail(email));
        if (contact == null) {
            throw new IllegalArgumentException("该邮箱不是有效的客户联系人，请联系 Kozen 项目团队维护客户联系人信息");
        }
        return contact;
    }

    private void sendCodeMail(CustomerPortalContactEntity contact, String code) {
        if (!properties.isMailEnabled() || mailSender == null) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(properties.getMailFrom());
            message.setTo(contact.getEmail());
            message.setSubject("KPM 客户门户登录验证码");
            message.setText("您好 " + contact.getContactName() + "，\n\n您的 KPM 客户门户登录验证码是：" + code + "。验证码有效期 " + properties.getCodeTtlSeconds() / 60 + " 分钟。\n\n如非本人操作，请忽略本邮件。\nKozen Project Management");
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send customer portal OTP mail to {}: {}", contact.getEmail(), e.getMessage());
        }
    }

    private void publishNotification(String taskId, String taskNo, String title, CustomerPortalContactEntity contact, List<CustomerPortalSupportOwnerEntity> supportOwners) {
        List<String> recipients = supportOwners.stream().map(CustomerPortalSupportOwnerEntity::getUserId).distinct().toList();
        mapper.insertNotificationEvent(
                IdUtil.nanoId("evt"),
                "CUSTOMER_TASK_CREATED",
                taskId,
                "客户创建了新任务",
                "客户 " + contact.getCustomerName() + " 的联系人 " + contact.getContactName() + " 创建了任务 " + taskNo + "：" + title,
                JsonUtil.toJson(recipients),
                JsonUtil.toJson(Map.of("customerId", contact.getCustomerId(), "contactEmail", contact.getEmail(), "taskNo", taskNo))
        );
    }

    private void publishCustomerCommentNotification(String taskId, String taskLabel, String content, CustomerPortalContactEntity contact) {
        List<CustomerPortalSupportOwnerEntity> supportOwners = mapper.supportOwners(contact.getCustomerId());
        List<String> recipients = supportOwners.stream().map(CustomerPortalSupportOwnerEntity::getUserId).distinct().toList();
        if (recipients.isEmpty()) return;
        mapper.insertNotificationEvent(
                IdUtil.nanoId("evt"),
                "CUSTOMER_TASK_COMMENT_CREATED",
                taskId,
                "客户新增了任务留言",
                "客户 " + contact.getCustomerName() + " 的联系人 " + contact.getContactName() + " 在任务 " + taskLabel + " 中新增外部留言：" + firstNonBlank(content, "请查看附件或任务详情。"),
                JsonUtil.toJson(recipients),
                JsonUtil.toJson(Map.of("customerId", contact.getCustomerId(), "contactEmail", contact.getEmail(), "taskId", taskId))
        );
    }

    private String generateCode() {
        StringBuilder code = new StringBuilder(6);
        for (int i = 0; i < 6; i += 1) {
            code.append(CODE_ALPHABET.charAt(RANDOM.nextInt(CODE_ALPHABET.length())));
        }
        return code.toString();
    }

    private String otpKey(String email) {
        return OTP_KEY_PREFIX + normalizeEmail(email);
    }

    private String normalizeEmail(String email) {
        return String.valueOf(email == null ? "" : email).trim().toLowerCase();
    }

    private String hash(String email, String code) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest((normalizeEmail(email) + "|" + code + "|" + tokenSecret).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (Exception e) {
            throw new IllegalStateException("验证码签名失败", e);
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value.trim();
        }
        return "";
    }
}
