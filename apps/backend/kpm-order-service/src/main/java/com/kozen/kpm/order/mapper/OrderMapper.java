package com.kozen.kpm.order.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Order data access mapper backed by MyBatis. */
@Mapper
public interface OrderMapper {
    @Select("select id, account, email, name from kpm_users where account=#{value} or email=#{value} or name=#{value}")
    List<Map<String, Object>> usersByAccountOrName(@Param("value") Object value);

    @Select("""
            select semantic from kpm_enum_items
            where enum_type='order_type' and value=#{orderType} and active=true
            limit 1
            """)
    String customerProjectStatusByOrderType(@Param("orderType") String orderType);

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and active=true
            order by case when semantic='DEFAULT' then 0 else 1 end, sort_order, id
            limit 1
            """)
    String defaultEnumValue(@Param("enumType") String enumType);

    @Select("""
            select semantic from kpm_enum_items
            where enum_type=#{enumType} and value=#{value} and active=true
            limit 1
            """)
    String enumSemantic(@Param("enumType") String enumType, @Param("value") String value);

    @Select("""
            select id, project_id, whole_machine_part_number, configuration_name, memory_type, active
            from kpm_project_skus
            where id=#{skuId} and project_id=#{projectId} and del_flag=0 and active=true
            """)
    Map<String, Object> activeProjectSku(@Param("projectId") String projectId, @Param("skuId") String skuId);

    @Select("select distinct owner_user_id from kpm_customer_owners where customer_id=#{customerId} and owner_user_id is not null")
    List<String> customerOwnerUserIds(@Param("customerId") String customerId);

    @Select("""
            select o.*, c.name as customer_name, c.region, p.external_name as project_name,
                   ps.whole_machine_part_number, ps.configuration_name, ps.memory_type
            from kpm_orders o join kpm_customers c on c.id=o.customer_id join kpm_projects p on p.id=o.project_id
            left join kpm_project_skus ps on ps.id=o.sku_id
            where (#{year} = '' or extract(year from o.order_date)::text = #{year})
              and (#{customerId} = '' or o.customer_id = #{customerId})
              and (#{projectId} = '' or o.project_id = #{projectId})
              and o.del_flag=0
            order by o.order_date desc, o.id desc
            """)
    List<Map<String, Object>> list(@Param("year") String year, @Param("customerId") String customerId, @Param("projectId") String projectId);

    @Select("""
            select o.*, c.name as customer_name, c.region, p.external_name as project_name,
                   ps.whole_machine_part_number, ps.configuration_name, ps.memory_type
            from kpm_orders o join kpm_customers c on c.id=o.customer_id join kpm_projects p on p.id=o.project_id
            left join kpm_project_skus ps on ps.id=o.sku_id
            where o.id=#{id}
              and o.del_flag=0
            """)
    Map<String, Object> load(@Param("id") String id);

    @Select("select * from kpm_order_histories where order_id=#{orderId} and del_flag=0 order by modified_at desc")
    List<Map<String, Object>> histories(@Param("orderId") String orderId);

    @Insert("""
            insert into kpm_orders
            (id, order_date, customer_id, project_id, sku_id, sku_snapshot, order_type, status, quantity, specification, expected_ship_date, planned_ship_date, actual_ship_date, software_version, currency, unit_price, amount, creator_user_id, creator)
            values
            (#{id}, cast(#{body.orderDate} as date), #{body.customerId}, #{body.projectId}, #{body.skuId}, cast(#{skuSnapshotJson} as jsonb), #{body.orderType}, #{status}, #{quantity}, #{body.specification}, cast(#{body.expectedShipDate} as date), cast(#{body.plannedShipDate} as date), cast(#{actualShipDate} as date), #{body.softwareVersion}, #{body.currency}, #{unitPrice}, #{amount}, #{creatorUserId}, #{creatorName})
            """)
    void insert(@Param("body") Map<String, Object> body, @Param("id") String id, @Param("quantity") int quantity, @Param("unitPrice") BigDecimal unitPrice, @Param("amount") BigDecimal amount, @Param("creatorUserId") String creatorUserId, @Param("creatorName") String creatorName, @Param("status") String status, @Param("actualShipDate") String actualShipDate, @Param("skuSnapshotJson") String skuSnapshotJson);

    @Update("""
            update kpm_orders set order_date=cast(#{body.orderDate} as date), customer_id=#{body.customerId}, project_id=#{body.projectId}, sku_id=#{body.skuId}, sku_snapshot=cast(#{skuSnapshotJson} as jsonb), order_type=#{body.orderType}, status=#{status}, quantity=#{quantity}, specification=#{body.specification}, expected_ship_date=cast(#{body.expectedShipDate} as date), planned_ship_date=cast(#{body.plannedShipDate} as date), actual_ship_date=cast(#{actualShipDate} as date), software_version=#{body.softwareVersion}, currency=#{body.currency}, unit_price=#{unitPrice}, amount=#{amount}, updated_at=current_timestamp, update_time=current_timestamp
            where id=#{id}
            """)
    void updateOrder(@Param("id") String id, @Param("body") Map<String, Object> body, @Param("quantity") int quantity, @Param("unitPrice") BigDecimal unitPrice, @Param("amount") BigDecimal amount, @Param("status") String status, @Param("actualShipDate") String actualShipDate, @Param("skuSnapshotJson") String skuSnapshotJson);

    @Update("update kpm_orders set del_flag=1, updated_at=current_timestamp, update_time=current_timestamp where id=#{id}")
    void deleteById(@Param("id") String id);

    @Insert("insert into kpm_order_histories (id, order_id, modifier, changes, reason) values (#{id}, #{orderId}, #{modifier}, #{changes}, #{reason})")
    void insertHistory(@Param("id") String id, @Param("orderId") String orderId, @Param("modifier") Object modifier, @Param("changes") String changes, @Param("reason") String reason);

    @Insert("""
            insert into kpm_notification_events (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, status)
            values (#{id}, #{eventType}, 'order', #{aggregateId}, #{title}, #{content}, cast(#{recipientUserIdsJson} as jsonb), 'PENDING')
            """)
    void insertNotificationEvent(@Param("id") String id, @Param("eventType") String eventType, @Param("aggregateId") String aggregateId, @Param("title") String title, @Param("content") String content, @Param("recipientUserIdsJson") String recipientUserIdsJson);

    @Select("select id from kpm_project_customers where project_id=#{projectId} and customer_id=#{customerId}")
    List<String> projectCustomerIds(@Param("projectId") String projectId, @Param("customerId") String customerId);

    @Insert("insert into kpm_project_customers (id, project_id, customer_id, project_status) values (#{id}, #{projectId}, #{customerId}, #{status})")
    void insertProjectCustomer(@Param("id") String id, @Param("projectId") String projectId, @Param("customerId") String customerId, @Param("status") String status);

    @Update("update kpm_project_customers set project_status=#{status} where project_id=#{projectId} and customer_id=#{customerId}")
    void updateProjectCustomerStatus(@Param("projectId") String projectId, @Param("customerId") String customerId, @Param("status") String status);

    @Select("select count(*) + 1 from kpm_orders where id like #{prefixLike}")
    Integer nextMonthlyOrderSequenceRow(@Param("prefixLike") String prefixLike);

    default int nextMonthlyOrderSequence(String prefix) {
        Integer count = nextMonthlyOrderSequenceRow(prefix + "%");
        return count == null ? 1 : count;
    }
}
