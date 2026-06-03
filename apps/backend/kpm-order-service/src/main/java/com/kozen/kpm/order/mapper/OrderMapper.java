package com.kozen.kpm.order.mapper;

import com.kozen.kpm.common.mapper.JdbcMapMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Order data access mapper. All SQL for the order service is centralized here.
 */
@Repository
public class OrderMapper extends JdbcMapMapper {
    public OrderMapper(JdbcTemplate jdbc) {
        super(jdbc);
    }

    public List<Map<String, Object>> usersByAccountOrName(Object value) {
        return rows("select id, account, email, name from kpm_users where account=? or email=? or name=?", value, value, value);
    }

    public List<String> customerOwnerUserIds(String customerId) {
        return column("select distinct owner_user_id from kpm_customer_owners where customer_id=? and owner_user_id is not null", String.class, customerId);
    }

    public List<Map<String, Object>> list(String year, String customerId, String projectId) {
        return rows("""
                select o.*, c.name as customer_name, c.region, p.external_name as project_name
                from kpm_orders o join kpm_customers c on c.id=o.customer_id join kpm_projects p on p.id=o.project_id
                where (? = '' or extract(year from o.order_date)::text = ?)
                  and (? = '' or o.customer_id = ?)
                  and (? = '' or o.project_id = ?)
                order by o.order_date desc, o.id desc
                """, year, year, customerId, customerId, projectId, projectId);
    }

    public Map<String, Object> load(String id) {
        return row("""
                select o.*, c.name as customer_name, c.region, p.external_name as project_name
                from kpm_orders o join kpm_customers c on c.id=o.customer_id join kpm_projects p on p.id=o.project_id
                where o.id=?
                """, id);
    }

    public List<Map<String, Object>> histories(String orderId) {
        return rows("select * from kpm_order_histories where order_id=? order by modified_at desc", orderId);
    }

    public void insert(Map<String, Object> body, String id, int quantity, BigDecimal unitPrice, BigDecimal amount, String creatorUserId, String creatorName) {
        update("""
                insert into kpm_orders (id, order_date, customer_id, project_id, order_type, quantity, specification, expected_ship_date, planned_ship_date, software_version, currency, unit_price, amount, creator_user_id, creator)
                values (?, cast(? as date), ?, ?, ?, ?, ?, cast(? as date), cast(? as date), ?, ?, ?, ?, ?, ?)
                """, id, body.get("orderDate"), body.get("customerId"), body.get("projectId"), body.getOrDefault("orderType", "正式订单"), quantity,
                body.get("specification"), body.get("expectedShipDate"), body.get("plannedShipDate"), body.get("softwareVersion"),
                body.getOrDefault("currency", "USD"), unitPrice, amount, creatorUserId, creatorName);
    }

    public void updateOrder(String id, Map<String, Object> body, int quantity, BigDecimal unitPrice, BigDecimal amount) {
        update("""
                update kpm_orders set order_date=cast(? as date), customer_id=?, project_id=?, order_type=?, quantity=?, specification=?, expected_ship_date=cast(? as date), planned_ship_date=cast(? as date), software_version=?, currency=?, unit_price=?, amount=?, updated_at=current_timestamp
                where id=?
                """, body.get("orderDate"), body.get("customerId"), body.get("projectId"), body.getOrDefault("orderType", "正式订单"), quantity,
                body.get("specification"), body.get("expectedShipDate"), body.get("plannedShipDate"), body.get("softwareVersion"),
                body.getOrDefault("currency", "USD"), unitPrice, amount, id);
    }

    public void deleteById(String id) {
        update("delete from kpm_orders where id=?", id);
    }

    public void insertHistory(String id, String orderId, Object modifier, String changes, String reason) {
        update("insert into kpm_order_histories (id, order_id, modifier, changes, reason) values (?, ?, ?, ?, ?)", id, orderId, modifier, changes, reason);
    }

    public void insertNotificationEvent(String id, String eventType, String aggregateId, String title, String content, String recipientUserIdsJson) {
        update("""
                insert into kpm_notification_events (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, status)
                values (?, ?, 'order', ?, ?, ?, cast(? as jsonb), 'PENDING')
                """, id, eventType, aggregateId, title, content, recipientUserIdsJson);
    }

    public List<String> projectCustomerIds(String projectId, String customerId) {
        return column("select id from kpm_project_customers where project_id=? and customer_id=?", String.class, projectId, customerId);
    }

    public void insertProjectCustomer(String id, String projectId, String customerId, String status) {
        update("insert into kpm_project_customers (id, project_id, customer_id, project_status) values (?, ?, ?, ?)", id, projectId, customerId, status);
    }

    public void updateProjectCustomerStatus(String projectId, String customerId, String status) {
        update("update kpm_project_customers set project_status=? where project_id=? and customer_id=?", status, projectId, customerId);
    }

    public int nextMonthlyOrderSequence(String prefix) {
        Integer count = jdbc.queryForObject("select count(*) + 1 from kpm_orders where id like ?", Integer.class, prefix + "%");
        return count == null ? 1 : count;
    }
}
