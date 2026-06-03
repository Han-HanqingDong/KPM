package com.kozen.kpm.customer.mapper;

import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.customer.entity.CustomerContactEntity;
import org.apache.ibatis.annotations.Arg;
import org.apache.ibatis.annotations.ConstructorArgs;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

/** Customer data access mapper backed by MyBatis. */
@Mapper
public interface CustomerMapper {
    @Select("select id, account, email, name from kpm_users where account=#{value} or email=#{value} or name=#{value}")
    List<Map<String, Object>> usersByAccountOrName(@Param("value") Object value);

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and active=true
            order by case when semantic='DEFAULT' then 0 else 1 end, sort_order, id
            limit 1
            """)
    String defaultEnumValue(@Param("enumType") String enumType);

    @Select("""
            select * from kpm_customers
            where del_flag=0
              and (#{keywordLike} = '' or name ilike #{keywordLike} or short_name ilike #{keywordLike} or region ilike #{keywordLike} or address ilike #{keywordLike})
            order by name
            """)
    List<Map<String, Object>> list(@Param("keywordLike") String keywordLike);

    @Select("select * from kpm_customers where id=#{id} and del_flag=0")
    Map<String, Object> load(@Param("id") String id);

    @Select("select id from kpm_customers where id=#{id} and del_flag=0")
    List<String> idsById(@Param("id") String id);

    @Insert("""
            insert into kpm_customers (id, name, short_name, region, address, level, status)
            values (#{id}, #{body.name}, #{body.shortName}, #{body.region}, #{body.address}, #{body.level}, #{body.status})
            """)
    void insert(@Param("id") String id, @Param("body") Map<String, Object> body);

    @Update("""
            update kpm_customers
            set name=#{body.name}, short_name=#{body.shortName}, region=#{body.region}, address=#{body.address}, level=#{body.level}, status=#{body.status}, updated_at=current_timestamp
            where id=#{id} and del_flag=0
            """)
    void updateCustomer(@Param("id") String id, @Param("body") Map<String, Object> body);

    @Update("update kpm_customers set del_flag=1, update_time=current_timestamp where id=#{id}")
    void deleteById(@Param("id") String id);

    @Delete("delete from kpm_customer_owners where customer_id=#{customerId}")
    void deleteOwners(@Param("customerId") String customerId);

    @Insert("insert into kpm_customer_owners (id, customer_id, owner_type, owner_user_id, owner_name) values (#{id}, #{customerId}, #{ownerType}, #{ownerUserId}, #{ownerName})")
    void insertOwner(@Param("id") String id, @Param("customerId") String customerId, @Param("ownerType") String ownerType, @Param("ownerUserId") String ownerUserId, @Param("ownerName") Object ownerName);

    @Select("""
            select coalesce(u.name, co.owner_name)
            from kpm_customer_owners co
            left join kpm_users u on u.id = co.owner_user_id or (co.owner_user_id is null and u.name = co.owner_name)
            where co.customer_id=#{customerId} and co.owner_type=#{ownerType} and co.del_flag=0
            order by coalesce(u.name, co.owner_name)
            """)
    List<String> ownerNames(@Param("customerId") String customerId, @Param("ownerType") String ownerType);

    @ConstructorArgs({
            @Arg(column = "id", javaType = String.class),
            @Arg(column = "customer_id", javaType = String.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "phone", javaType = String.class),
            @Arg(column = "email", javaType = String.class),
            @Arg(column = "remark", javaType = String.class)
    })
    @Select("""
            select id, customer_id, name, title, phone, email, remark
            from kpm_customer_contacts
            where customer_id=#{customerId} and del_flag=0
            order by name
            """)
    List<CustomerContactEntity> contacts(@Param("customerId") String customerId);

    @Insert("insert into kpm_customer_contacts (id, customer_id, name, title, phone, email, remark) values (#{id}, #{customerId}, #{body.name}, #{body.title}, #{body.phone}, #{body.email}, #{body.remark})")
    void insertContact(@Param("id") String id, @Param("customerId") String customerId, @Param("body") Map<String, Object> body);

    @Update("update kpm_customer_contacts set del_flag=1, update_time=current_timestamp where customer_id=#{customerId} and id=#{contactId}")
    void deleteContact(@Param("customerId") String customerId, @Param("contactId") String contactId);

    @Select("select * from kpm_customer_materials where customer_id=#{customerId} and del_flag=0 order by uploaded_at desc")
    List<Map<String, Object>> materials(@Param("customerId") String customerId);

    @Insert("""
            insert into kpm_customer_materials
            (id, customer_id, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category)
            values (#{id}, #{customerId}, #{body.fileName}, #{body.fileType}, #{body.fileSize}, #{body.uploader}, #{body.bucket}, #{body.objectKey}, #{body.storageUrl}, #{body.category})
            """)
    void insertMaterial(@Param("id") String id, @Param("customerId") String customerId, @Param("body") Map<String, Object> body);

    @Select("select * from kpm_customer_followups where customer_id=#{customerId} and del_flag=0 order by created_at desc")
    List<Map<String, Object>> followups(@Param("customerId") String customerId);

    default void insertFollowup(String id, String customerId, Object author, Object content, Object attachments) {
        insertFollowupRow(id, customerId, author, content, JsonUtil.toJson(attachments == null ? List.of() : attachments));
    }

    @Insert("insert into kpm_customer_followups (id, customer_id, author, content, attachments) values (#{id}, #{customerId}, #{author}, #{content}, cast(#{attachmentsJson} as jsonb))")
    void insertFollowupRow(@Param("id") String id, @Param("customerId") String customerId, @Param("author") Object author, @Param("content") Object content, @Param("attachmentsJson") String attachmentsJson);

    @Select("""
            select pc.id, pc.project_status, p.id as project_id, p.external_name, p.internal_name, p.model_name, p.salesability
            from kpm_project_customers pc join kpm_projects p on p.id = pc.project_id
            where pc.customer_id=#{customerId} and pc.del_flag=0 and p.del_flag=0 order by p.external_name
            """)
    List<Map<String, Object>> projects(@Param("customerId") String customerId);
}
