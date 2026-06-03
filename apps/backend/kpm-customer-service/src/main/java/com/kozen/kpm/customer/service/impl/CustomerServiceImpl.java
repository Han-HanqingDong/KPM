package com.kozen.kpm.customer.service.impl;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.IdUtil;
import com.kozen.kpm.common.util.SqlParamUtil;
import com.kozen.kpm.common.util.ValidationUtil;
import com.kozen.kpm.customer.converter.CustomerContactConverter;
import com.kozen.kpm.customer.dto.CustomerContactRequest;
import com.kozen.kpm.customer.dto.CustomerFollowupRequest;
import com.kozen.kpm.customer.dto.CustomerRequest;
import com.kozen.kpm.customer.mapper.CustomerMapper;
import com.kozen.kpm.customer.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Default customer service implementation.
 */
@Service
public class CustomerServiceImpl implements CustomerService {
    private final CustomerMapper customerMapper;

    public CustomerServiceImpl(CustomerMapper customerMapper) {
        this.customerMapper = customerMapper;
    }

    @Override
    public List<Map<String, Object>> list(String keyword) {
        List<Map<String, Object>> customers = customerMapper.list(SqlParamUtil.likeOrBlank(keyword));
        customers.forEach(this::enrichCustomer);
        return customers;
    }

    @Override
    public Map<String, Object> detail(String id) {
        Map<String, Object> customer = customerMapper.load(id);
        enrichCustomer(customer);
        return customer;
    }

    @Override
    @Transactional
    public Map<String, Object> create(CustomerRequest request) {
        String id = uniqueCustomerId(request.name());
        Map<String, Object> body = request.toMap();
        body.put("level", resolveDefault(body.get("level"), "customer_level", "客户等级"));
        body.put("status", resolveDefault(body.get("status"), "customer_master_status", "客户状态"));
        customerMapper.insert(id, body);
        replaceOwners(id, request);
        return detail(id);
    }

    @Override
    @Transactional
    public Map<String, Object> update(String id, CustomerRequest request) {
        Map<String, Object> body = request.toMap();
        body.put("level", resolveDefault(body.get("level"), "customer_level", "客户等级"));
        body.put("status", resolveDefault(body.get("status"), "customer_master_status", "客户状态"));
        customerMapper.updateCustomer(id, body);
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
    public Map<String, Object> addContact(String id, CustomerContactRequest request) {
        customerMapper.insertContact(IdUtil.nanoId("cc"), id, request.toMap());
        return detail(id);
    }

    @Override
    @Transactional
    public Map<String, Object> deleteContact(String id, String contactId) {
        customerMapper.deleteContact(id, contactId);
        return detail(id);
    }

    @Override
    @Transactional
    public Map<String, Object> addFollowup(String id, CustomerFollowupRequest request) {
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
    public Map<String, Object> addMaterial(String id, FileMetadataRequest request) {
        customerMapper.insertMaterial(IdUtil.nanoId("cm"), id, request.toMap());
        return detail(id);
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

    private void enrichCustomer(Map<String, Object> customer) {
        String id = String.valueOf(customer.get("id"));
        customer.put("salesOwners", customerMapper.ownerNames(id, "sales"));
        customer.put("supportOwners", customerMapper.ownerNames(id, "support"));
        customer.put("contacts", CustomerContactConverter.toDtos(customerMapper.contacts(id)));
        customer.put("materials", customerMapper.materials(id));
        customer.put("followups", customerMapper.followups(id));
        customer.put("projects", customerMapper.projects(id));
    }

    private void replaceOwners(String customerId, CustomerRequest request) {
        customerMapper.deleteOwners(customerId);
        for (String owner : request.safeSalesOwners()) {
            Map<String, Object> user = requireUser(owner, "负责销售");
            customerMapper.insertOwner(IdUtil.nanoId("co"), customerId, "sales", String.valueOf(user.get("id")), user.get("name"));
        }
        for (String owner : request.safeSupportOwners()) {
            Map<String, Object> user = requireUser(owner, "负责技术支持");
            customerMapper.insertOwner(IdUtil.nanoId("co"), customerId, "support", String.valueOf(user.get("id")), user.get("name"));
        }
    }

    private Map<String, Object> requireUser(Object accountOrName, String label) {
        if (accountOrName == null || String.valueOf(accountOrName).isBlank()) {
            throw new IllegalArgumentException(label + "必须从已有用户中选择");
        }
        List<Map<String, Object>> users = customerMapper.usersByAccountOrName(accountOrName);
        if (users.isEmpty()) {
            throw new IllegalArgumentException(label + "不存在，请从已有用户中选择");
        }
        return users.getFirst();
    }

    private String uniqueCustomerId(String source) {
        String base = "cus-" + IdUtil.slug(source, "customer");
        String candidate = base;
        int index = 2;
        while (!customerMapper.idsById(candidate).isEmpty()) {
            candidate = base + "-" + index++;
        }
        return candidate;
    }
}
