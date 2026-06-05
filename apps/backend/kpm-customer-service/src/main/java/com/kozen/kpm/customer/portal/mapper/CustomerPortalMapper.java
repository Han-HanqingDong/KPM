package com.kozen.kpm.customer.portal.mapper;

import com.kozen.kpm.customer.portal.entity.CustomerPortalContactEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalAnnouncementEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalMaterialEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalMessageEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalProjectEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalSupportOwnerEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalProjectTaskStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskAttachmentEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskCategoryStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskCreatorStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskStatsEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskEntity;
import com.kozen.kpm.customer.portal.entity.CustomerPortalTaskCommentEntity;
import com.kozen.kpm.common.util.JsonUtil;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/** Customer portal data access mapper backed by MyBatis typed projections. */
@Mapper
public interface CustomerPortalMapper {
    @Select("""
            select cc.id as contactId,
                   c.id as customerId,
                   c.name as customerName,
                   c.short_name as customerShortName,
                   cc.name as contactName,
                   cc.email
            from kpm_customer_contacts cc
            join kpm_customers c on c.id=cc.customer_id and c.del_flag=0
            where lower(cc.email)=lower(#{email}) and cc.del_flag=0
            order by cc.id
            limit 1
            """)
    CustomerPortalContactEntity contactByEmail(@Param("email") String email);

    @Select("""
            select cc.id as contactId,
                   c.id as customerId,
                   c.name as customerName,
                   c.short_name as customerShortName,
                   cc.name as contactName,
                   cc.email
            from kpm_customer_contacts cc
            join kpm_customers c on c.id=cc.customer_id and c.del_flag=0
            where cc.customer_id=#{customerId}
              and cc.del_flag=0
              and cc.email is not null
              and trim(cc.email) != ''
            order by cc.name, cc.email
            """)
    List<CustomerPortalContactEntity> contacts(@Param("customerId") String customerId);


    @Select("""
            select pc.project_id as projectId,
                   p.external_name as projectName,
                   p.internal_name as internalName,
                   p.model_name as modelName,
                   pc.project_status as projectStatus
            from kpm_project_customers pc
            join kpm_projects p on p.id=pc.project_id and p.del_flag=0
            where pc.customer_id=#{customerId} and pc.del_flag=0
            order by p.external_name
            """)
    List<CustomerPortalProjectEntity> projects(@Param("customerId") String customerId);

    @Select("""
            select count(1)
            from kpm_project_customers pc
            join kpm_projects p on p.id=pc.project_id and p.del_flag=0
            where pc.customer_id=#{customerId} and pc.project_id=#{projectId} and pc.del_flag=0
            """)
    int linkedProjectCount(@Param("customerId") String customerId, @Param("projectId") String projectId);

    @Select("""
            <script>
            select pm.id,
                   pm.project_id as projectId,
                   p.external_name as projectName,
                   pm.source_stage as sourceStage,
                   pm.file_name as fileName,
                   pm.file_type as fileType,
                   pm.file_size as fileSize,
                   pm.description,
                   pm.bucket,
                   pm.object_key as objectKey,
                   pm.storage_url as storageUrl,
                   pm.storage_category as storageCategory,
                   pm.public_at as publicAt
            from kpm_project_customers pc
            join kpm_projects p on p.id=pc.project_id and p.del_flag=0
            join kpm_project_materials pm on pm.project_id=p.id and pm.del_flag=0 and pm.public_visible=true
            where pc.customer_id=#{customerId}
              and pc.del_flag=0
              and (#{projectId} = '' or pm.project_id=nullif(#{projectId}, '')::bigint)
              and (#{keyword} = '' or pm.file_name ilike #{keyword})
            order by pm.public_at desc nulls last, pm.published_at desc nulls last, pm.id desc
            limit #{limit} offset #{offset}
            </script>
            """)
    List<CustomerPortalMaterialEntity> publicMaterialsPage(@Param("customerId") String customerId,
                                                           @Param("projectId") String projectId,
                                                           @Param("keyword") String keyword,
                                                           @Param("limit") int limit,
                                                           @Param("offset") int offset);

    @Select("""
            <script>
            select count(1)
            from kpm_project_customers pc
            join kpm_projects p on p.id=pc.project_id and p.del_flag=0
            join kpm_project_materials pm on pm.project_id=p.id and pm.del_flag=0 and pm.public_visible=true
            where pc.customer_id=#{customerId}
              and pc.del_flag=0
              and (#{projectId} = '' or pm.project_id=nullif(#{projectId}, '')::bigint)
              and (#{keyword} = '' or pm.file_name ilike #{keyword})
            </script>
            """)
    long publicMaterialsCount(@Param("customerId") String customerId,
                              @Param("projectId") String projectId,
                              @Param("keyword") String keyword);

    @Select("""
            select a.id,
                   a.project_id as projectId,
                   p.external_name as projectName,
                   a.announcement_type as announcementType,
                   a.title,
                   a.content,
                   a.publisher,
                   a.published_at as publishedAt
            from kpm_project_announcements a
            join kpm_project_customers pc on pc.project_id=a.project_id and pc.del_flag=0
            join kpm_projects p on p.id=a.project_id and p.del_flag=0
            where pc.customer_id=#{customerId}
              and a.del_flag=0
              and a.announcement_status='已发布'
            order by a.published_at desc
            limit 20
            """)
    List<CustomerPortalAnnouncementEntity> announcements(@Param("customerId") String customerId);

    @Select("""
            select m.id,
                   m.title,
                   m.content,
                   m.message_type as messageType,
                   m.project_id as projectId,
                   p.external_name as projectName,
                   m.task_id as taskId,
                   m.announcement_id as announcementId,
                   m.read_flag as readFlag,
                   m.created_at as createdAt,
                   m.read_at as readAt
            from kpm_customer_portal_messages m
            left join kpm_projects p on p.id=m.project_id and p.del_flag=0
            where lower(m.contact_email)=lower(#{email})
              and m.del_flag=0
              and (#{unreadOnly}=false or m.read_flag=false)
            order by m.created_at desc
            limit 50
            """)
    List<CustomerPortalMessageEntity> messages(@Param("email") String email, @Param("unreadOnly") boolean unreadOnly);

    @Select("select count(*) from kpm_customer_portal_messages where lower(contact_email)=lower(#{email}) and del_flag=0 and read_flag=false")
    int unreadCount(@Param("email") String email);

    @Update("update kpm_customer_portal_messages set read_flag=true, read_at=current_timestamp, update_time=current_timestamp where id=#{messageId} and lower(contact_email)=lower(#{email}) and del_flag=0")
    int markMessageRead(@Param("email") String email, @Param("messageId") String messageId);

    @Update("update kpm_customer_portal_messages set read_flag=true, read_at=current_timestamp, update_time=current_timestamp where lower(contact_email)=lower(#{email}) and read_flag=false and del_flag=0")
    int markAllMessagesRead(@Param("email") String email);

    @Insert("""
            insert into kpm_customer_portal_messages
            (customer_id, contact_id, contact_email, title, content, message_type, project_id, task_id)
            values (#{customerId}, #{contactId}, lower(#{contactEmail}), #{title}, #{content}, #{messageType}, #{projectId}, #{taskId})
            """)
    void insertPortalMessage(@Param("customerId") String customerId, @Param("contactId") String contactId, @Param("contactEmail") String contactEmail, @Param("title") String title, @Param("content") String content, @Param("messageType") String messageType, @Param("projectId") String projectId, @Param("taskId") String taskId);

    @Select("""
            select t.id,
                   t.task_no as taskNo,
                   t.title,
                   t.description,
                   t.project_id as projectId,
                   p.external_name as projectName,
                   t.category,
                   coalesce(ei.label_zh, ei.name, t.category) as categoryLabelZh,
                   coalesce(ei.label_en, ei.name, t.category) as categoryLabelEn,
                   coalesce(ei.short_label_zh, left(coalesce(ei.label_zh, ei.name, t.category), 1)) as categoryShortLabelZh,
                   coalesce(ei.short_label_en, upper(left(coalesce(ei.label_en, ei.value, t.category), 1))) as categoryShortLabelEn,
                   t.status,
                   t.priority,
                   t.creator,
                   t.expected_completion_at as expectedCompletionAt,
                   t.blocked,
                   t.created_at as createdAt,
                   t.updated_at as updatedAt,
                   (
                       select count(1)
                       from kpm_task_comments tc
                       where tc.task_id=t.id
                         and tc.comment_type='external'
                         and tc.del_flag=0
                   ) as commentCount
            from kpm_tasks t
            left join kpm_projects p on p.id=t.project_id and p.del_flag=0
            left join kpm_enum_items ei on ei.enum_type='task_category' and ei.value=t.category and ei.active=true and ei.del_flag=0
            where t.customer_id=#{customerId} and t.del_flag=0
            order by t.created_at desc
            """)
    List<CustomerPortalTaskEntity> tasks(@Param("customerId") String customerId);

    @Select("""
            <script>
            select t.id,
                   t.task_no as taskNo,
                   t.title,
                   t.description,
                   t.project_id as projectId,
                   p.external_name as projectName,
                   t.category,
                   coalesce(ei.label_zh, ei.name, t.category) as categoryLabelZh,
                   coalesce(ei.label_en, ei.name, t.category) as categoryLabelEn,
                   coalesce(ei.short_label_zh, left(coalesce(ei.label_zh, ei.name, t.category), 1)) as categoryShortLabelZh,
                   coalesce(ei.short_label_en, upper(left(coalesce(ei.label_en, ei.value, t.category), 1))) as categoryShortLabelEn,
                   t.status,
                   t.priority,
                   t.creator,
                   t.expected_completion_at as expectedCompletionAt,
                   t.blocked,
                   t.created_at as createdAt,
                   t.updated_at as updatedAt,
                   (
                       select count(1)
                       from kpm_task_comments tc
                       where tc.task_id=t.id
                         and tc.comment_type='external'
                         and tc.del_flag=0
                   ) as commentCount
            from kpm_tasks t
            left join kpm_projects p on p.id=t.project_id and p.del_flag=0
            left join kpm_enum_items ei on ei.enum_type='task_category' and ei.value=t.category and ei.active=true and ei.del_flag=0
            where t.customer_id=#{customerId}
              and t.del_flag=0
              and (#{projectId} = '' or t.project_id=nullif(#{projectId}, '')::bigint)
              and (#{status} = '' or t.status=#{status})
              and (#{creatorEmail} = '' or lower(t.creator) like concat('%', chr(60), lower(#{creatorEmail}), chr(62), '%'))
            order by t.created_at desc, t.id desc
            limit #{limit} offset #{offset}
            </script>
            """)
    List<CustomerPortalTaskEntity> tasksPage(@Param("customerId") String customerId,
                                             @Param("projectId") String projectId,
                                             @Param("status") String status,
                                             @Param("creatorEmail") String creatorEmail,
                                             @Param("limit") int limit,
                                             @Param("offset") int offset);

    @Select("""
            <script>
            select count(1)
            from kpm_tasks t
            where t.customer_id=#{customerId}
              and t.del_flag=0
              and (#{projectId} = '' or t.project_id=nullif(#{projectId}, '')::bigint)
              and (#{status} = '' or t.status=#{status})
              and (#{creatorEmail} = '' or lower(t.creator) like concat('%', chr(60), lower(#{creatorEmail}), chr(62), '%'))
            </script>
            """)
    long tasksPageCount(@Param("customerId") String customerId,
                        @Param("projectId") String projectId,
                        @Param("status") String status,
                        @Param("creatorEmail") String creatorEmail);

    @Select("""
            select distinct t.status
            from kpm_tasks t
            where t.customer_id=#{customerId}
              and t.del_flag=0
              and t.status is not null
              and trim(t.status) <> ''
            order by t.status
            """)
    List<String> taskStatuses(@Param("customerId") String customerId);

    @Select("""
            <script>
            with completed_statuses as (
              select value
              from kpm_enum_items
              where enum_type='task_status'
                and active=true
                and del_flag=0
                and (semantic in ('完成', 'COMPLETED') or value='已完成')
            ),
            scoped_tasks as (
              select t.*,
                     (
                       select min(tc.created_at)
                       from kpm_task_comments tc
                       where tc.task_id=t.id
                         and tc.comment_type='external'
                         and tc.del_flag=0
                         and coalesce(tc.author, '') not like '客户:%'
                     ) as first_response_at
              from kpm_tasks t
              where t.customer_id=#{customerId}
                and t.del_flag=0
                and (#{projectId} = '' or t.project_id=nullif(#{projectId}, '')::bigint)
            )
            select count(1) as totalTasks,
                   count(1) filter (where st.status in (select value from completed_statuses)) as completedTasks,
                   count(1) filter (where st.status not in (select value from completed_statuses) or st.status is null) as openTasks,
                   coalesce(avg(extract(epoch from (st.first_response_at - st.created_at)) / 3600.0) filter (where st.first_response_at is not null), 0) as avgResponseHours,
                   coalesce(avg(extract(epoch from (st.updated_at - st.created_at)) / 3600.0) filter (where st.status in (select value from completed_statuses)), 0) as avgCompletionHours
            from scoped_tasks st
            </script>
            """)
    CustomerPortalTaskStatsEntity taskStats(@Param("customerId") String customerId,
                                            @Param("projectId") String projectId);

    @Select("""
            <script>
            with completed_statuses as (
              select value
              from kpm_enum_items
              where enum_type='task_status'
                and active=true
                and del_flag=0
                and (semantic in ('完成', 'COMPLETED') or value='已完成')
            ),
            scoped_tasks as (
              select t.*,
                     p.external_name as project_name,
                     (
                       select min(tc.created_at)
                       from kpm_task_comments tc
                       where tc.task_id=t.id
                         and tc.comment_type='external'
                         and tc.del_flag=0
                         and coalesce(tc.author, '') not like '客户:%'
                     ) as first_response_at
              from kpm_tasks t
              left join kpm_projects p on p.id=t.project_id and p.del_flag=0
              where t.customer_id=#{customerId}
                and t.del_flag=0
                and (#{projectId} = '' or t.project_id=nullif(#{projectId}, '')::bigint)
            )
            select st.project_id::text as projectId,
                   coalesce(st.project_name, '未关联项目') as projectName,
                   count(1) as totalTasks,
                   count(1) filter (where st.status in (select value from completed_statuses)) as completedTasks,
                   count(1) filter (where st.status not in (select value from completed_statuses) or st.status is null) as openTasks,
                   coalesce(avg(extract(epoch from (st.first_response_at - st.created_at)) / 3600.0) filter (where st.first_response_at is not null), 0) as avgResponseHours,
                   coalesce(avg(extract(epoch from (st.updated_at - st.created_at)) / 3600.0) filter (where st.status in (select value from completed_statuses)), 0) as avgCompletionHours
            from scoped_tasks st
            group by st.project_id, st.project_name
            order by totalTasks desc, projectName
            </script>
            """)
    List<CustomerPortalProjectTaskStatsEntity> taskStatsByProject(@Param("customerId") String customerId,
                                                                  @Param("projectId") String projectId);

    @Select("""
            <script>
            select lower(cc.email) as contactEmail,
                   cc.name as contactName,
                   count(t.id) as submittedTasks
            from kpm_customer_contacts cc
            left join kpm_tasks t on t.customer_id=cc.customer_id
              and t.del_flag=0
              and lower(t.creator) like concat('%', chr(60), lower(cc.email), chr(62), '%')
              and (#{projectId} = '' or t.project_id=nullif(#{projectId}, '')::bigint)
            where cc.customer_id=#{customerId}
              and cc.del_flag=0
              and cc.email is not null
              and trim(cc.email) != ''
            group by cc.email, cc.name
            order by submittedTasks desc, cc.name
            </script>
            """)
    List<CustomerPortalTaskCreatorStatsEntity> taskCreatorStats(@Param("customerId") String customerId,
                                                                @Param("projectId") String projectId);

    @Select("""
            <script>
            select t.category,
                   coalesce(ei.label_zh, ei.name, t.category) as labelZh,
                   coalesce(ei.label_en, ei.name, t.category) as labelEn,
                   coalesce(ei.short_label_zh, left(coalesce(ei.label_zh, ei.name, t.category), 1)) as shortLabelZh,
                   coalesce(ei.short_label_en, upper(left(coalesce(ei.label_en, ei.value, t.category), 1))) as shortLabelEn,
                   count(1) as totalTasks
            from kpm_tasks t
            left join kpm_enum_items ei on ei.enum_type='task_category' and ei.value=t.category and ei.active=true and ei.del_flag=0
            where t.customer_id=#{customerId}
              and t.del_flag=0
              and (#{projectId} = '' or t.project_id=nullif(#{projectId}, '')::bigint)
            group by t.category, ei.label_zh, ei.label_en, ei.short_label_zh, ei.short_label_en, ei.name, ei.value
            order by totalTasks desc, t.category
            </script>
            """)
    List<CustomerPortalTaskCategoryStatsEntity> taskCategoryStats(@Param("customerId") String customerId,
                                                                  @Param("projectId") String projectId);


    @Select("""
            select count(1)
            from kpm_task_comments tc
            join kpm_tasks t on t.id=tc.task_id and t.del_flag=0
            where t.customer_id=#{customerId}
              and t.id=#{taskId}
              and tc.comment_type='external'
              and tc.del_flag=0
            """)
    long externalTaskCommentCount(@Param("customerId") String customerId, @Param("taskId") String taskId);

    @Select("""
            select tc.id,
                   tc.task_id as taskId,
                   tc.author,
                   tc.content,
                   tc.attachments::text as attachments,
                   tc.created_at as createdAt
            from kpm_task_comments tc
            join kpm_tasks t on t.id=tc.task_id and t.del_flag=0
            where t.customer_id=#{customerId}
              and t.id=#{taskId}
              and tc.comment_type='external'
              and tc.del_flag=0
            order by tc.created_at desc, tc.id desc
            limit #{limit} offset #{offset}
            """)
    List<CustomerPortalTaskCommentEntity> externalTaskCommentsPage(
            @Param("customerId") String customerId,
            @Param("taskId") String taskId,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Select("""
            select co.owner_user_id as userId,
                   coalesce(u.name, co.owner_name) as name,
                   u.account
            from kpm_customer_owners co
            join kpm_users u on u.id=co.owner_user_id and u.del_flag=0
            where co.customer_id=#{customerId}
              and co.owner_type='support'
              and co.del_flag=0
            order by u.name
            """)
    List<CustomerPortalSupportOwnerEntity> supportOwners(@Param("customerId") String customerId);

    @Select("select nextval('kpm_task_no_seq')")
    Long nextTaskNumber();

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and active=true and del_flag=0
            order by case when semantic=#{semantic} then 0 when semantic='DEFAULT' then 1 else 2 end, sort_order, id
            limit 1
            """)
    String enumValue(@Param("enumType") String enumType, @Param("semantic") String semantic);

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and value=#{value} and active=true and del_flag=0
            limit 1
            """)
    String enumExactValue(@Param("enumType") String enumType, @Param("value") String value);

    @Insert("""
            insert into kpm_tasks
            (id, task_no, title, description, project_id, category, status, priority, creator, source, customer_id, blocked)
            values
            (#{id}, #{taskNo}, #{title}, #{description}, #{projectId}, #{category}, #{status}, #{priority}, #{creator}, '客户门户', #{customerId}, false)
            """)
    void insertTask(
            @Param("id") String id,
            @Param("taskNo") String taskNo,
            @Param("title") String title,
            @Param("description") String description,
            @Param("projectId") String projectId,
            @Param("category") String category,
            @Param("status") String status,
            @Param("priority") String priority,
            @Param("creator") String creator,
            @Param("customerId") String customerId
    );

    @Insert("""
            insert into kpm_task_assignees (task_id, user_id, assignee_name, creator)
            values (#{taskId}, #{userId}, #{assigneeName}, 'customer-portal')
            on conflict (task_id, assignee_name) do update
            set user_id=excluded.user_id, del_flag=0, update_time=current_timestamp
            """)
    void insertAssignee(@Param("taskId") String taskId, @Param("userId") String userId, @Param("assigneeName") String assigneeName);

    @Insert("""
            insert into kpm_notification_events
            (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, payload, creator)
            values
            (#{id}, #{eventType}, 'task', cast(#{taskId} as bigint), #{title}, #{content}, cast(#{recipientUserIdsJson} as jsonb), cast(#{payloadJson} as jsonb), 'customer-portal')
            """)
    void insertNotificationEvent(
            @Param("id") String id,
            @Param("eventType") String eventType,
            @Param("taskId") String taskId,
            @Param("title") String title,
            @Param("content") String content,
            @Param("recipientUserIdsJson") String recipientUserIdsJson,
            @Param("payloadJson") String payloadJson
    );

    @Select("""
            select t.id,
                   t.task_no as taskNo,
                   t.title,
                   t.description,
                   t.project_id as projectId,
                   p.external_name as projectName,
                   t.category,
                   coalesce(ei.label_zh, ei.name, t.category) as categoryLabelZh,
                   coalesce(ei.label_en, ei.name, t.category) as categoryLabelEn,
                   coalesce(ei.short_label_zh, left(coalesce(ei.label_zh, ei.name, t.category), 1)) as categoryShortLabelZh,
                   coalesce(ei.short_label_en, upper(left(coalesce(ei.label_en, ei.value, t.category), 1))) as categoryShortLabelEn,
                   t.status,
                   t.priority,
                   t.creator,
                   t.expected_completion_at as expectedCompletionAt,
                   t.blocked,
                   t.created_at as createdAt,
                   t.updated_at as updatedAt,
                   (
                       select count(1)
                       from kpm_task_comments tc
                       where tc.task_id=t.id
                         and tc.comment_type='external'
                         and tc.del_flag=0
                   ) as commentCount
            from kpm_tasks t
            left join kpm_projects p on p.id=t.project_id and p.del_flag=0
            left join kpm_enum_items ei on ei.enum_type='task_category' and ei.value=t.category and ei.active=true and ei.del_flag=0
            where t.id=#{taskId} and t.customer_id=#{customerId} and t.del_flag=0
            """)
    CustomerPortalTaskEntity task(@Param("customerId") String customerId, @Param("taskId") String taskId);

    @Select("""
            select ta.id,
                   ta.task_id as taskId,
                   ta.file_name as fileName,
                   ta.file_type as fileType,
                   ta.file_size as fileSize,
                   ta.uploader,
                   ta.bucket,
                   ta.object_key as objectKey,
                   ta.storage_url as storageUrl,
                   ta.storage_category as storageCategory,
                   ta.uploaded_at as uploadedAt
            from kpm_task_attachments ta
            join kpm_tasks t on t.id=ta.task_id and t.del_flag=0
            where t.customer_id=#{customerId}
              and t.id=#{taskId}
              and ta.del_flag=0
            order by ta.uploaded_at desc, ta.id desc
            """)
    List<CustomerPortalTaskAttachmentEntity> taskAttachments(@Param("customerId") String customerId, @Param("taskId") String taskId);

    @Insert("""
            insert into kpm_task_attachments
            (id, task_id, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category, creator)
            values
            (#{id}, #{taskId}, #{fileName}, #{fileType}, #{fileSize}, #{uploader}, #{bucket}, #{objectKey}, #{storageUrl}, #{storageCategory}, 'customer-portal')
            """)
    void insertTaskAttachment(
            @Param("id") String id,
            @Param("taskId") String taskId,
            @Param("fileName") String fileName,
            @Param("fileType") String fileType,
            @Param("fileSize") String fileSize,
            @Param("uploader") String uploader,
            @Param("bucket") String bucket,
            @Param("objectKey") String objectKey,
            @Param("storageUrl") String storageUrl,
            @Param("storageCategory") String storageCategory
    );

    @Select("""
            select count(1)
            from kpm_tasks t
            where t.id=#{taskId} and t.customer_id=#{customerId} and t.del_flag=0
            """)
    int customerTaskCount(@Param("customerId") String customerId, @Param("taskId") String taskId);

    default void insertExternalTaskComment(String commentId, String taskId, String author, String content, List<Object> attachments) {
        insertExternalTaskCommentRow(commentId, taskId, author, content, JsonUtil.toJson(attachments == null ? List.of() : attachments));
    }

    @Insert("""
            insert into kpm_task_comments
            (id, task_id, author, comment_type, content, attachments, creator)
            values (#{commentId}, #{taskId}, #{author}, 'external', #{content}, cast(#{attachmentsJson} as jsonb), 'customer-portal')
            """)
    void insertExternalTaskCommentRow(@Param("commentId") String commentId, @Param("taskId") String taskId, @Param("author") String author, @Param("content") String content, @Param("attachmentsJson") String attachmentsJson);
}
