package com.kozen.kpm.customer.service.impl;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.customer.converter.CustomerConverter;
import com.kozen.kpm.customer.dto.CustomerContactRequest;
import com.kozen.kpm.customer.dto.CustomerDto;
import com.kozen.kpm.customer.dto.CustomerFollowupRequest;
import com.kozen.kpm.customer.dto.CustomerNotificationRequest;
import com.kozen.kpm.customer.dto.CustomerNotificationResultDto;
import com.kozen.kpm.customer.dto.CustomerRequest;
import com.kozen.kpm.customer.dto.CustomerWriteCommand;
import com.kozen.kpm.customer.entity.CustomerContactEntity;
import com.kozen.kpm.customer.entity.CustomerEntity;
import com.kozen.kpm.customer.entity.UserLookupEntity;
import com.kozen.kpm.customer.mapper.CustomerMapper;
import com.kozen.kpm.customer.portal.config.CustomerPortalProperties;
import com.kozen.kpm.customer.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Default customer service implementation with typed DTO/entity boundaries. */
@Service
public class CustomerServiceImpl implements CustomerService {
    private static final Logger log = LoggerFactory.getLogger(CustomerServiceImpl.class);

    private final CustomerMapper customerMapper;
    private final CustomerConverter customerConverter;
    private final CustomerPortalProperties customerPortalProperties;
    private final JavaMailSender mailSender;

    public CustomerServiceImpl(
            CustomerMapper customerMapper,
            CustomerConverter customerConverter,
            CustomerPortalProperties customerPortalProperties,
            ObjectProvider<JavaMailSender> mailSenderProvider
    ) {
        this.customerMapper = customerMapper;
        this.customerConverter = customerConverter;
        this.customerPortalProperties = customerPortalProperties;
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    @Override
    public List<CustomerDto> list(String keyword) {
        return customerMapper.list(SqlParamUtil.likeOrBlank(keyword)).stream().map(this::enrichCustomer).toList();
    }

    @Override
    public CustomerDto detail(String id) {
        return enrichCustomer(requireCustomer(id));
    }

    @Override
    @Transactional
    public CustomerDto create(CustomerRequest request) {
        String id = uniqueCustomerId(request.name());
        String level = resolveDefault(request.level(), "customer_level", "客户等级");
        String status = resolveDefault(request.status(), "customer_master_status", "客户状态");
        ensureUniqueShortName(request.shortName(), null);
        customerMapper.insert(CustomerWriteCommand.from(id, request, level, status));
        replaceOwners(id, request);
        return detail(id);
    }

    @Override
    @Transactional
    public CustomerDto update(String id, CustomerRequest request) {
        requireCustomer(id);
        String level = resolveDefault(request.level(), "customer_level", "客户等级");
        String status = resolveDefault(request.status(), "customer_master_status", "客户状态");
        ensureUniqueShortName(request.shortName(), id);
        customerMapper.updateCustomer(CustomerWriteCommand.from(id, request, level, status));
        replaceOwners(id, request);
        return detail(id);
    }

    @Override
    public boolean delete(String id) {
        customerMapper.deleteById(id);
        return true;
    }

    @Override
    @Transactional
    public CustomerDto addContact(String id, CustomerContactRequest request) {
        requireCustomer(id);
        customerMapper.insertContact(IdUtil.nanoId("cc"), id, request);
        return detail(id);
    }

    @Override
    @Transactional
    public CustomerDto deleteContact(String id, String contactId) {
        requireCustomer(id);
        customerMapper.deleteContact(id, contactId);
        return detail(id);
    }

    @Override
    @Transactional
    public CustomerDto addFollowup(String id, CustomerFollowupRequest request) {
        requireCustomer(id);
        boolean hasText = request.content() != null && !request.content().isBlank();
        boolean hasFiles = request.attachments() != null && !request.attachments().isEmpty();
        if (!hasText && !hasFiles) {
            throw new IllegalArgumentException("跟进记录内容或附件不能为空");
        }
        String author = ValidationUtil.requireText(request.author(), "跟进记录作者", 64);
        customerMapper.insertFollowup(IdUtil.nanoId("cf"), id, author, request.content(), request.safeAttachments());
        return detail(id);
    }

    @Override
    @Transactional
    public CustomerDto addMaterial(String id, FileMetadataRequest request) {
        requireCustomer(id);
        customerMapper.insertMaterial(IdUtil.nanoId("cm"), id, request);
        return detail(id);
    }


    @Override
    @Transactional
    public CustomerNotificationResultDto sendNotification(String id, CustomerNotificationRequest request, String publisher) {
        CustomerEntity customer = requireCustomer(id);
        String title = ValidationUtil.requireText(request.title(), "通知标题", 120);
        String content = ValidationUtil.requireText(request.content(), "通知内容", 3000);
        String publisherName = ValidationUtil.optionalText(publisher, "发布人", 80);
        if (publisherName == null || publisherName.isBlank()) {
            publisherName = "KPM";
        }
        List<CustomerContactEntity> contacts = customerMapper.contacts(id).stream()
                .filter(contact -> contact.email() != null && !contact.email().isBlank())
                .toList();
        if (contacts.isEmpty()) {
            throw new IllegalArgumentException("该客户没有配置可通知的联系人邮箱");
        }
        String messageTitle = "客户通知：" + title;
        int portalMessageCount = 0;
        int emailAttemptCount = 0;
        for (CustomerContactEntity contact : contacts) {
            customerMapper.insertCustomerPortalNotification(id, contact.id(), contact.email(), messageTitle, content, publisherName);
            portalMessageCount += 1;
            if (sendCustomerNotificationMail(customer, contact, title, content, publisherName)) {
                emailAttemptCount += 1;
            }
        }
        return new CustomerNotificationResultDto(id, contacts.size(), portalMessageCount, emailAttemptCount);
    }

    private String resolveDefault(Object value, String enumType, String label) {
        if (value != null && !String.valueOf(value).isBlank()) {
            return String.valueOf(value);
        }
        String defaultValue = customerMapper.defaultEnumValue(enumType);
        if (defaultValue == null || defaultValue.isBlank()) {
            throw new IllegalArgumentException(label + "未配置默认枚举值，请先在资源管理中配置");
        }
        return defaultValue;
    }

    private CustomerDto enrichCustomer(CustomerEntity customer) {
        if (customer == null) {
            throw new IllegalArgumentException("客户不存在");
        }
        String id = customer.getId();
        return customerConverter.toDto(
                customer,
                customerMapper.ownerNames(id, "sales"),
                customerMapper.ownerNames(id, "support"),
                customerMapper.contacts(id),
                customerMapper.materials(id),
                customerMapper.followups(id),
                customerMapper.projects(id)
        );
    }

    private void replaceOwners(String customerId, CustomerRequest request) {
        customerMapper.deleteOwners(customerId);
        for (String owner : request.safeSalesOwners()) {
            UserLookupEntity user = requireUser(owner, "负责销售");
            customerMapper.insertOwner(IdUtil.nanoId("co"), customerId, "sales", user.getId(), user.getName());
        }
        for (String owner : request.safeSupportOwners()) {
            UserLookupEntity user = requireUser(owner, "负责技术支持");
            customerMapper.insertOwner(IdUtil.nanoId("co"), customerId, "support", user.getId(), user.getName());
        }
    }


    private boolean sendCustomerNotificationMail(CustomerEntity customer, CustomerContactEntity contact, String title, String content, String publisher) {
        if (!customerPortalProperties.isMailEnabled() || mailSender == null) {
            return false;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(customerPortalProperties.getMailFrom());
            message.setTo(contact.email());
            message.setSubject("KPM 客户通知：" + title);
            message.setText("您好 " + contact.name() + "，\n\n"
                    + "Kozen 向 " + customer.getName() + " 发布了一条通知：\n\n"
                    + content + "\n\n"
                    + "发布人：" + publisher + "\n"
                    + "Kozen Project Management");
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            log.warn("Failed to send customer notification mail to {}: {}", contact.email(), e.getMessage());
            return false;
        }
    }

    private UserLookupEntity requireUser(String accountOrName, String label) {
        if (accountOrName == null || accountOrName.isBlank()) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<UserLookupEntity> users = customerMapper.usersByAccountOrName(accountOrName);
        if (users.isEmpty()) {
            throw new IllegalArgumentException(label + "不存在，请从已有用户中选择");
        }
        return users.getFirst();
    }

    private CustomerEntity requireCustomer(String id) {
        CustomerEntity customer = customerMapper.load(id);
        if (customer == null) {
            throw new IllegalArgumentException("客户不存在");
        }
        return customer;
    }

    private void ensureUniqueShortName(String shortName, String excludeId) {
        if (customerMapper.countByShortName(shortName.trim(), excludeId == null ? "" : excludeId) > 0) {
            throw new IllegalArgumentException("客户简称已存在，请更换1-5位英文简称");
        }
    }

    private String uniqueCustomerId(String source) {
        return IdUtil.numericId();
    }
}
