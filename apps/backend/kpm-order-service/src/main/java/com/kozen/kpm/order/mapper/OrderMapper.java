package com.kozen.kpm.order.mapper;

import com.kozen.kpm.order.dto.OrderWriteCommand;
import com.kozen.kpm.order.entity.OrderEntity;
import com.kozen.kpm.order.entity.OrderHistoryEntity;
import com.kozen.kpm.order.entity.ProjectSkuEntity;
import com.kozen.kpm.order.entity.UserLookupEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDate;
import java.util.List;

/** Order data access mapper backed by MyBatis. */
@Mapper
public interface OrderMapper {
    String ORDER_SELECT_COLUMNS = """
            o.id,
            o.order_date as orderDate,
            o.customer_id as customerId,
            c.name as customerName,
            c.region as region,
            o.project_id as projectId,
            p.external_name as projectName,
            o.sku_id as skuId,
            o.sku_snapshot::text as skuSnapshot,
            o.order_type as orderType,
            o.status as status,
            o.quantity as quantity,
            o.specification as specification,
            o.expected_ship_date as expectedShipDate,
            o.planned_ship_date as plannedShipDate,
            o.actual_ship_date as actualShipDate,
            o.software_version as softwareVersion,
            o.currency as currency,
            o.unit_price as unitPrice,
            o.amount as amount,
            o.creator_user_id as creatorUserId,
            o.creator as creator,
            ps.whole_machine_part_number as wholeMachinePartNumber,
            ps.configuration_name as configurationName,
            ps.memory_type as memoryType,
            o.created_at as createdAt,
            o.updated_at as updatedAt
            """;

    @Select("select id, account, email, name from kpm_users where account=#{value} or email=#{value} or name=#{value}")
    List<UserLookupEntity> usersByAccountOrName(@Param("value") Object value);

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
            select id,
                   project_id as projectId,
                   whole_machine_part_number as wholeMachinePartNumber,
                   configuration_name as configurationName,
                   memory_type as memoryType,
                   active
            from kpm_project_skus
            where id=#{skuId} and project_id=#{projectId} and del_flag=0 and active=true
            """)
    ProjectSkuEntity activeProjectSku(@Param("projectId") String projectId, @Param("skuId") String skuId);

    @Select("select distinct owner_user_id from kpm_customer_owners where customer_id=#{customerId} and owner_user_id is not null")
    List<String> customerOwnerUserIds(@Param("customerId") String customerId);

    @Select("""
            <script>
            select ${columns}
            from kpm_orders o
            join kpm_customers c on c.id=o.customer_id and c.del_flag=0
            join kpm_projects p on p.id=o.project_id and p.del_flag=0
            left join kpm_project_skus ps on ps.id=o.sku_id and ps.del_flag=0
            where (#{startDate,jdbcType=DATE} is null or o.order_date &gt;= #{startDate,jdbcType=DATE})
              and (#{endDate,jdbcType=DATE} is null or o.order_date &lt; #{endDate,jdbcType=DATE})
              and (nullif(#{customerId}, '') is null or o.customer_id = nullif(#{customerId}, '')::bigint)
              and (nullif(#{projectId}, '') is null or o.project_id = nullif(#{projectId}, '')::bigint)
              and o.del_flag=0
            order by o.order_date desc, o.id desc
            </script>
            """)
    List<OrderEntity> list(
            @Param("columns") String columns,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("customerId") String customerId,
            @Param("projectId") String projectId
    );

    default List<OrderEntity> list(LocalDate startDate, LocalDate endDate, String customerId, String projectId) {
        return list(ORDER_SELECT_COLUMNS, startDate, endDate, customerId, projectId);
    }

    @Select("""
            <script>
            select ${columns}
            from kpm_orders o
            join kpm_customers c on c.id=o.customer_id and c.del_flag=0
            join kpm_projects p on p.id=o.project_id and p.del_flag=0
            left join kpm_project_skus ps on ps.id=o.sku_id and ps.del_flag=0
            where (#{startDate,jdbcType=DATE} is null or o.order_date &gt;= #{startDate,jdbcType=DATE})
              and (#{endDate,jdbcType=DATE} is null or o.order_date &lt; #{endDate,jdbcType=DATE})
              and (nullif(#{customerId}, '') is null or o.customer_id = nullif(#{customerId}, '')::bigint)
              and (nullif(#{projectId}, '') is null or o.project_id = nullif(#{projectId}, '')::bigint)
              and (#{orderType} = '' or o.order_type = #{orderType})
              and (#{status} = '' or o.status = #{status})
              and (#{keywordLike} = '' or o.id::text ilike #{keywordLike} or c.name ilike #{keywordLike} or p.external_name ilike #{keywordLike} or o.specification ilike #{keywordLike} or o.software_version ilike #{keywordLike} or ps.configuration_name ilike #{keywordLike} or ps.whole_machine_part_number ilike #{keywordLike})
              and o.del_flag=0
            order by o.order_date desc, o.id desc
            limit #{limit} offset #{offset}
            </script>
            """)
    List<OrderEntity> pageRows(
            @Param("columns") String columns,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("customerId") String customerId,
            @Param("projectId") String projectId,
            @Param("orderType") String orderType,
            @Param("status") String status,
            @Param("keywordLike") String keywordLike,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    default List<OrderEntity> pageRows(LocalDate startDate, LocalDate endDate, String customerId, String projectId, String orderType, String status, String keywordLike, int limit, int offset) {
        return pageRows(ORDER_SELECT_COLUMNS, startDate, endDate, customerId, projectId, orderType, status, keywordLike, limit, offset);
    }

    @Select("""
            select count(1)
            from kpm_orders o
            join kpm_customers c on c.id=o.customer_id and c.del_flag=0
            join kpm_projects p on p.id=o.project_id and p.del_flag=0
            left join kpm_project_skus ps on ps.id=o.sku_id and ps.del_flag=0
            where (#{startDate,jdbcType=DATE} is null or o.order_date >= #{startDate,jdbcType=DATE})
              and (#{endDate,jdbcType=DATE} is null or o.order_date < #{endDate,jdbcType=DATE})
              and (nullif(#{customerId}, '') is null or o.customer_id = nullif(#{customerId}, '')::bigint)
              and (nullif(#{projectId}, '') is null or o.project_id = nullif(#{projectId}, '')::bigint)
              and (#{orderType} = '' or o.order_type = #{orderType})
              and (#{status} = '' or o.status = #{status})
              and (#{keywordLike} = '' or o.id::text ilike #{keywordLike} or c.name ilike #{keywordLike} or p.external_name ilike #{keywordLike} or o.specification ilike #{keywordLike} or o.software_version ilike #{keywordLike} or ps.configuration_name ilike #{keywordLike} or ps.whole_machine_part_number ilike #{keywordLike})
              and o.del_flag=0
            """)
    long countRows(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("customerId") String customerId,
            @Param("projectId") String projectId,
            @Param("orderType") String orderType,
            @Param("status") String status,
            @Param("keywordLike") String keywordLike
    );

    @Select("""
            <script>
            select ${columns}
            from kpm_orders o join kpm_customers c on c.id=o.customer_id join kpm_projects p on p.id=o.project_id
            left join kpm_project_skus ps on ps.id=o.sku_id
            where o.id=#{id}
              and o.del_flag=0
            </script>
            """)
    OrderEntity load(@Param("columns") String columns, @Param("id") String id);

    default OrderEntity load(String id) {
        return load(ORDER_SELECT_COLUMNS, id);
    }

    @Select("""
            select id,
                   order_id as orderId,
                   modifier,
                   modified_at as modifiedAt,
                   changes,
                   reason
            from kpm_order_histories
            where order_id=#{orderId} and del_flag=0
            order by modified_at desc
            """)
    List<OrderHistoryEntity> histories(@Param("orderId") String orderId);

    @Select("""
            <script>
            select id,
                   order_id as orderId,
                   modifier,
                   modified_at as modifiedAt,
                   changes,
                   reason
            from kpm_order_histories
            where del_flag=0
              and order_id in
              <foreach collection="orderIds" item="orderId" open="(" separator="," close=")">
                #{orderId}
              </foreach>
            order by order_id, modified_at desc
            </script>
            """)
    List<OrderHistoryEntity> historiesForOrders(@Param("orderIds") List<String> orderIds);

    @Insert("""
            insert into kpm_orders
            (id, order_date, customer_id, project_id, sku_id, sku_snapshot, order_type, status, quantity, specification, expected_ship_date, planned_ship_date, actual_ship_date, software_version, currency, unit_price, amount, creator_user_id, creator)
            values
            (#{command.id}, cast(#{command.orderDate} as date), #{command.customerId}, #{command.projectId}, #{command.skuId}, cast(#{command.skuSnapshotJson} as jsonb), #{command.orderType}, #{command.status}, #{command.quantity}, #{command.specification}, cast(#{command.expectedShipDate} as date), cast(#{command.plannedShipDate} as date), cast(#{command.actualShipDate} as date), #{command.softwareVersion}, #{command.currency}, #{command.unitPrice}, #{command.amount}, #{command.creatorUserId}, #{command.creatorName})
            """)
    void insert(@Param("command") OrderWriteCommand command);

    @Update("""
            update kpm_orders set order_date=cast(#{command.orderDate} as date), customer_id=#{command.customerId}, project_id=#{command.projectId}, sku_id=#{command.skuId}, sku_snapshot=cast(#{command.skuSnapshotJson} as jsonb), order_type=#{command.orderType}, status=#{command.status}, quantity=#{command.quantity}, specification=#{command.specification}, expected_ship_date=cast(#{command.expectedShipDate} as date), planned_ship_date=cast(#{command.plannedShipDate} as date), actual_ship_date=cast(#{command.actualShipDate} as date), software_version=#{command.softwareVersion}, currency=#{command.currency}, unit_price=#{command.unitPrice}, amount=#{command.amount}, updated_at=current_timestamp, update_time=current_timestamp
            where id=#{command.id}
            """)
    void updateOrder(@Param("command") OrderWriteCommand command);

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

    @Select("select count(*) + 1 from kpm_orders where id::text like #{prefixLike}")
    Integer nextMonthlyOrderSequenceRow(@Param("prefixLike") String prefixLike);

    default int nextMonthlyOrderSequence(String prefix) {
        Integer count = nextMonthlyOrderSequenceRow(prefix + "%");
        return count == null ? 1 : count;
    }
}
