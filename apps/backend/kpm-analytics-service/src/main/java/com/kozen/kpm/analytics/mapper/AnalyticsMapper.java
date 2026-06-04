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
            select count(*)
            from kpm_projects p
            join kpm_enum_items e on e.enum_type='project_status' and e.value=p.status
            where p.del_flag=0 and (coalesce(e.semantic, '') = 'ACTIVE' or p.status = '进行中')
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
            select c.id as customer_id, c.name as customer_name, c.region, c.address, c.level, c.status,
                   (select string_agg(distinct coalesce(u.name, co.owner_name), ', ')
                    from kpm_customer_owners co
                    left join kpm_users u on u.del_flag=0 and (u.id = co.owner_user_id or (co.owner_user_id is null and u.name = co.owner_name))
                    where co.customer_id=c.id and co.owner_type='sales' and co.del_flag=0) as sales_owners,
                   (select string_agg(distinct coalesce(u.name, co.owner_name), ', ')
                    from kpm_customer_owners co
                    left join kpm_users u on u.del_flag=0 and (u.id = co.owner_user_id or (co.owner_user_id is null and u.name = co.owner_name))
                    where co.customer_id=c.id and co.owner_type='support' and co.del_flag=0) as support_owners,
                   (select string_agg(distinct p.external_name, ', ')
                    from kpm_project_customers pc
                    join kpm_projects p on p.id=pc.project_id and p.del_flag=0
                    where pc.customer_id=c.id and pc.del_flag=0) as projects,
                   (select coalesce(sum(o.quantity), 0)
                    from kpm_orders o
                    where o.customer_id=c.id and o.del_flag=0) as ordered_quantity
            from kpm_customers c
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
                   count(t.id) filter (where coalesce(ts.semantic, '普通') not in ('完成','拒绝') and t.category='Bug') as open_bug_count,
                   count(t.id) filter (where coalesce(ts.semantic, '普通') not in ('完成','拒绝') and t.category not in ('需求','Bug')) as open_other_count,
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
            select c.id, c.name, c.region, c.level, c.status,
                   max(cf.created_at) as last_followup_at,
                   max(o.order_date) as last_order_date,
                   count(distinct t.id) filter (where coalesce(ts.semantic, '普通') not in ('完成','拒绝')) as open_task_count,
                   count(distinct pc.project_id) as project_count
            from kpm_customers c
            left join kpm_customer_followups cf on cf.customer_id=c.id and cf.del_flag=0
            left join kpm_orders o on o.customer_id=c.id and o.del_flag=0
            left join kpm_tasks t on t.customer_id=c.id and t.del_flag=0
            left join kpm_enum_items ts on ts.enum_type='task_status' and ts.value=t.status and ts.del_flag=0
            left join kpm_project_customers pc on pc.customer_id=c.id and pc.del_flag=0
            where c.del_flag=0
            group by c.id, c.name, c.region, c.level, c.status
            order by c.name
            """)
    List<CustomerActivityRow> activity();
}
