package com.kozen.kpm.customer.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kozen.kpm.common.mapper.JdbcMapMapper;
import com.kozen.kpm.customer.entity.CustomerContactEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Customer data access mapper. SQL for customer, owner, contact, material,
 * follow-up and customer-project relation queries must stay in this layer.
 */
@Repository
public class CustomerMapper extends JdbcMapMapper {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CustomerMapper(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public List<Map<String, Object>> usersByAccountOrName(Object value) {
        return rows("select id, account, email, name from kpm_users where account=? or email=? or name=?", value, value, value);
    }

    public List<Map<String, Object>> list(String keywordLike) {
        return rows("""
                select * from kpm_customers
                where (? = '' or name ilike ? or short_name ilike ? or region ilike ? or address ilike ?)
                order by name
                """, keywordLike, keywordLike, keywordLike, keywordLike, keywordLike);
    }

    public Map<String, Object> load(String id) {
        return row("select * from kpm_customers where id=?", id);
    }

    public List<String> idsById(String id) {
        return column("select id from kpm_customers where id=?", String.class, id);
    }

    public void insert(String id, Map<String, Object> body) {
        update("""
                insert into kpm_customers (id, name, short_name, region, address, level, status)
                values (?, ?, ?, ?, ?, ?, ?)
                """, id, body.get("name"), body.get("shortName"), body.getOrDefault("region", "未填写"), body.get("address"),
                body.getOrDefault("level", "C / 普通客户"), body.getOrDefault("status", "潜在客户"));
    }

    public void updateCustomer(String id, Map<String, Object> body) {
        update("""
                update kpm_customers
                set name=?, short_name=?, region=?, address=?, level=?, status=?, updated_at=current_timestamp
                where id=?
                """, body.get("name"), body.get("shortName"), body.get("region"), body.get("address"), body.get("level"), body.get("status"),
                id);
    }

    public void deleteById(String id) {
        update("delete from kpm_customers where id=?", id);
    }

    public void deleteOwners(String customerId) {
        update("delete from kpm_customer_owners where customer_id=?", customerId);
    }

    public void insertOwner(String id, String customerId, String ownerType, String ownerUserId, Object ownerName) {
        update("insert into kpm_customer_owners (id, customer_id, owner_type, owner_user_id, owner_name) values (?, ?, ?, ?, ?)", id, customerId, ownerType, ownerUserId, ownerName);
    }

    public List<String> ownerNames(String customerId, String ownerType) {
        return column("""
                select coalesce(u.name, co.owner_name)
                from kpm_customer_owners co
                left join kpm_users u on u.id = co.owner_user_id or (co.owner_user_id is null and u.name = co.owner_name)
                where co.customer_id=? and co.owner_type=?
                order by coalesce(u.name, co.owner_name)
                """, String.class, customerId, ownerType);
    }

    public List<CustomerContactEntity> contacts(String customerId) {
        return jdbc.query("""
                select id, customer_id, name, title, phone, email, remark
                from kpm_customer_contacts
                where customer_id=?
                order by name
                """, (rs, rowNum) -> new CustomerContactEntity(
                rs.getString("id"),
                rs.getString("customer_id"),
                rs.getString("name"),
                rs.getString("title"),
                rs.getString("phone"),
                rs.getString("email"),
                rs.getString("remark")
        ), customerId);
    }

    public void insertContact(String id, String customerId, Map<String, Object> body) {
        update("insert into kpm_customer_contacts (id, customer_id, name, title, phone, email, remark) values (?, ?, ?, ?, ?, ?, ?)",
                id, customerId, body.get("name"), body.get("title"), body.get("phone"), body.get("email"), body.get("remark"));
    }

    public void deleteContact(String customerId, String contactId) {
        update("delete from kpm_customer_contacts where customer_id=? and id=?", customerId, contactId);
    }

    public List<Map<String, Object>> materials(String customerId) {
        return rows("select * from kpm_customer_materials where customer_id=? order by uploaded_at desc", customerId);
    }

    public void insertMaterial(String id, String customerId, Map<String, Object> body) {
        update("""
                insert into kpm_customer_materials
                (id, customer_id, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                id, customerId, body.get("fileName"), body.getOrDefault("fileType", "文件"),
                body.getOrDefault("fileSize", "-"), body.getOrDefault("uploader", "张敏"),
                body.get("bucket"), body.get("objectKey"), body.get("storageUrl"), body.get("category"));
    }

    public List<Map<String, Object>> followups(String customerId) {
        return rows("select * from kpm_customer_followups where customer_id=? order by created_at desc", customerId);
    }

    public void insertFollowup(String id, String customerId, Object author, Object content, Object attachments) {
        update("insert into kpm_customer_followups (id, customer_id, author, content, attachments) values (?, ?, ?, ?, cast(? as jsonb))",
                id, customerId, author, content, json(attachments));
    }

    public List<Map<String, Object>> projects(String customerId) {
        return rows("""
                select pc.id, pc.project_status, p.id as project_id, p.external_name, p.internal_name, p.model_name, p.salesability
                from kpm_project_customers pc join kpm_projects p on p.id = pc.project_id
                where pc.customer_id=? order by p.external_name
                """, customerId);
    }

    private String json(Object value) {
        Object safeValue = value == null ? List.of() : value;
        try {
            return objectMapper.writeValueAsString(safeValue);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid JSON payload", e);
        }
    }
}
