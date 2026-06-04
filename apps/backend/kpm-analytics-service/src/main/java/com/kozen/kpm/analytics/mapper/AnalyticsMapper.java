package com.kozen.kpm.analytics.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.kozen.kpm.analytics.entity.CustomerActivityRow;
import com.kozen.kpm.analytics.entity.GeocodeCacheEntity;
import com.kozen.kpm.analytics.entity.OrderStatsRow;
import com.kozen.kpm.analytics.entity.ResourceMapRow;
import com.kozen.kpm.analytics.entity.SupportStatsRow;

import java.util.List;

/** Analytics query mapper backed by MyBatis. */
@Mapper
public interface AnalyticsMapper {
    @Select("select count(*) from kpm_projects where del_flag=0")
    Integer projectCount();

    @Select("""
            select count(distinct p.id)
            from kpm_projects p
            join kpm_project_stages s on s.project_id=p.id and s.del_flag=0
            left join kpm_enum_items e on e.enum_type='stage_status' and e.value=s.status and e.del_flag=0
            where p.del_flag=0 and (coalesce(e.semantic, '') = 'ACTIVE' or s.status = '进行中')
            """)
    Integer activeProjectCount();

    @Select("select count(*) from kpm_customers where del_flag=0")
    Integer customerCount();

    @Select("""
            select count(*)
            from kpm_tasks t
            left join kpm_enum_items e on e.enum_type='task_status' and e.value=t.status
            where t.del_flag=0 and coalesce(e.semantic, '普通') not in ('完成','拒绝')
            """)
    Integer openTaskCount();

    @Select("""
            select to_char(o.order_date, 'YYYY-MM') as period,
                   p.external_name as project_name,
                   c.name as customer_name,
                   c.region,
                   o.currency,
                   sum(o.amount) as amount,
                   count(*) as order_count,
                   sum(o.quantity) as product_quantity
            from kpm_orders o join kpm_projects p on p.id=o.project_id and p.del_flag=0 join kpm_customers c on c.id=o.customer_id and c.del_flag=0
            where o.del_flag=0
            group by period, p.external_name, c.name, c.region, o.currency
            order by period, p.external_name
            """)
    List<OrderStatsRow> orderStats();

    @Select("""
            with sales_owner as (
                select co.customer_id,
                       string_agg(distinct coalesce(u.name, co.owner_name), ', ') as sales_owners
                from kpm_customer_owners co
                left join kpm_users u on u.del_flag=0 and u.id = co.owner_user_id
                where co.owner_type='sales' and co.del_flag=0
                group by co.customer_id
            ),
            support_owner as (
                select co.customer_id,
                       string_agg(distinct coalesce(u.name, co.owner_name), ', ') as support_owners
                from kpm_customer_owners co
                left join kpm_users u on u.del_flag=0 and u.id = co.owner_user_id
                where co.owner_type='support' and co.del_flag=0
                group by co.customer_id
            ),
            project_agg as (
                select pc.customer_id,
                       string_agg(distinct p.external_name, ', ') as projects
                from kpm_project_customers pc
                join kpm_projects p on p.id=pc.project_id and p.del_flag=0
                where pc.del_flag=0
                group by pc.customer_id
            ),
            order_agg as (
                select o.customer_id,
                       coalesce(sum(o.quantity), 0) as ordered_quantity
                from kpm_orders o
                where o.del_flag=0
                group by o.customer_id
            )
            select c.id as customer_id,
                   c.name as customer_name,
                   c.region,
                   c.address,
                   c.level,
                   c.status,
                   so.sales_owners,
                   spo.support_owners,
                   pa.projects,
                   coalesce(oa.ordered_quantity, 0) as ordered_quantity
            from kpm_customers c
            left join sales_owner so on so.customer_id=c.id
            left join support_owner spo on spo.customer_id=c.id
            left join project_agg pa on pa.customer_id=c.id
            left join order_agg oa on oa.customer_id=c.id
            where c.del_flag=0
            order by c.region, c.name
            """)
    List<ResourceMapRow> resourceMap();

    @Select("select * from kpm_geocode_cache where query=#{query}")
    List<GeocodeCacheEntity> geocodeCache(@Param("query") String query);

    @Insert("""
            insert into kpm_geocode_cache (query, latitude, longitude, display_name, provider, precision, updated_at)
            values (#{query}, #{latitude}, #{longitude}, #{displayName}, #{provider}, #{precision}, current_timestamp)
            on conflict (query) do update set
              latitude=excluded.latitude,
              longitude=excluded.longitude,
              display_name=excluded.display_name,
              provider=excluded.provider,
              precision=excluded.precision,
              updated_at=current_timestamp
            """)
    void upsertGeocodeCache(@Param("query") String query, @Param("latitude") double latitude, @Param("longitude") double longitude, @Param("displayName") String displayName, @Param("provider") String provider, @Param("precision") String precision);

    @Select("""
            select c.id as customer_id, c.name as customer_name, coalesce(u.name, co.owner_name) as support_owner,
                   count(t.id) filter (where coalesce(ts.semantic, '普通') not in ('完成','拒绝') and t.category='需求') as open_requirement_count,
                   count(t.id) filter (where coalesce(ts.semantic, '普通') not in ('完成','拒绝') and lower(coalesce(t.category, ''))='bug') as open_bug_count,
                   count(t.id) filter (where coalesce(ts.semantic, '普通') not in ('完成','拒绝') and t.category <> '需求' and lower(coalesce(t.category, '')) <> 'bug') as open_other_count,
                   count(t.id) filter (where coalesce(ts.semantic, '普通') not in ('完成','拒绝') and t.blocked = true) as blocked_count
            from kpm_customers c
            join kpm_customer_owners co on co.customer_id=c.id and co.owner_type='support' and co.del_flag=0
            left join kpm_users u on u.del_flag=0 and (u.id = co.owner_user_id or (co.owner_user_id is null and u.name = co.owner_name))
            left join kpm_tasks t on t.customer_id=c.id and t.del_flag=0 and exists (
                select 1 from kpm_task_assignees ta
                where ta.task_id=t.id and ta.del_flag=0 and (ta.user_id = co.owner_user_id or (ta.user_id is null and ta.assignee_name = coalesce(u.name, co.owner_name)))
            )
            left join kpm_enum_items ts on ts.enum_type='task_status' and ts.value=t.status and ts.del_flag=0
            where c.del_flag=0 and (#{customerId} = '' or c.id::text = #{customerId})
            group by c.id, c.name, coalesce(u.name, co.owner_name)
            order by c.name, coalesce(u.name, co.owner_name)
            """)
    List<SupportStatsRow> support(@Param("customerId") String customerId);

    @Select("""
            with followup_agg as (
                select customer_id, max(created_at) as last_followup_at
                from kpm_customer_followups
                where del_flag=0
                group by customer_id
            ),
            order_agg as (
                select customer_id, max(order_date) as last_order_date
                from kpm_orders
                where del_flag=0
                group by customer_id
            ),
            open_task_agg as (
                select t.customer_id,
                       count(*) as open_task_count
                from kpm_tasks t
                left join kpm_enum_items ts on ts.enum_type='task_status' and ts.value=t.status and ts.del_flag=0
                where t.del_flag=0
                  and t.customer_id is not null
                  and coalesce(ts.semantic, '普通') not in ('完成','拒绝')
                group by t.customer_id
            ),
            project_agg as (
                select customer_id, count(distinct project_id) as project_count
                from kpm_project_customers
                where del_flag=0
                group by customer_id
            )
            select c.id,
                   c.name,
                   c.region,
                   c.level,
                   c.status,
                   fa.last_followup_at,
                   oa.last_order_date,
                   coalesce(ota.open_task_count, 0) as open_task_count,
                   coalesce(pa.project_count, 0) as project_count
            from kpm_customers c
            left join followup_agg fa on fa.customer_id=c.id
            left join order_agg oa on oa.customer_id=c.id
            left join open_task_agg ota on ota.customer_id=c.id
            left join project_agg pa on pa.customer_id=c.id
            where c.del_flag=0
            order by c.name
            """)
    List<CustomerActivityRow> activity();
}
