package com.kozen.kpm.project.mapper;

import com.kozen.kpm.common.dto.FileMetadataRequest;
import com.kozen.kpm.common.util.JsonUtil;
import com.kozen.kpm.project.dto.ProcessTemplateWriteCommand;
import com.kozen.kpm.project.dto.ProjectSkuWriteCommand;
import com.kozen.kpm.project.dto.ProjectWriteCommand;
import com.kozen.kpm.project.dto.RequirementTaskWriteCommand;
import com.kozen.kpm.project.dto.RequirementWriteCommand;
import com.kozen.kpm.project.entity.ProcessTemplateEntity;
import com.kozen.kpm.project.entity.ProjectCustomerEntity;
import com.kozen.kpm.project.entity.ProjectEntity;
import com.kozen.kpm.project.entity.ProjectFileEntity;
import com.kozen.kpm.project.entity.ProjectMemberEntity;
import com.kozen.kpm.project.entity.ProjectSkuEntity;
import com.kozen.kpm.project.entity.ProjectStageEntity;
import com.kozen.kpm.project.entity.RequirementEntity;
import com.kozen.kpm.project.entity.RequirementOverviewEntity;
import com.kozen.kpm.project.entity.StageAssigneeEntity;
import com.kozen.kpm.project.entity.StageRecordEntity;
import com.kozen.kpm.project.entity.UserLookupEntity;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/** Project data access mapper backed by MyBatis typed projections. */
@Mapper
public interface ProjectMapper {
    @Select("""
            select id,
                   external_name as externalName,
                   internal_name as internalName,
                   model_name as modelName,
                   manager_user_id as managerUserId,
                   manager_account as managerAccount,
                   archived,
                   description,
                   created_at as createdAt,
                   updated_at as updatedAt
            from kpm_projects
            where (cast(#{keyword} as text) is null or #{keyword} = '' or external_name ilike #{keywordLike} or internal_name ilike #{keywordLike} or model_name ilike #{keywordLike})
              and (cast(#{archived,jdbcType=BOOLEAN} as boolean) is null or archived = #{archived,jdbcType=BOOLEAN})
              and del_flag=0
            order by created_at desc, external_name
            """)
    List<ProjectEntity> list(@Param("keyword") String keyword, @Param("keywordLike") String keywordLike, @Param("archived") Boolean archived);

    default List<ProjectEntity> list(String keyword, Boolean archived) {
        String trimmed = keyword == null ? null : keyword.trim();
        String like = trimmed == null || trimmed.isBlank() ? "" : "%" + trimmed + "%";
        return list(trimmed, like, archived);
    }

    @Select("""
            select id,
                   external_name as externalName,
                   internal_name as internalName,
                   model_name as modelName,
                   manager_user_id as managerUserId,
                   manager_account as managerAccount,
                   archived,
                   description,
                   created_at as createdAt,
                   updated_at as updatedAt
            from kpm_projects where id=#{id} and del_flag=0
            """)
    ProjectEntity load(@Param("id") String id);

    @Select("select id from kpm_projects where id=#{id} and del_flag=0")
    List<String> projectIds(@Param("id") String id);

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and active=true
            order by case when semantic='DEFAULT' then 0 else 1 end, sort_order, id
            limit 1
            """)
    String defaultEnumValue(@Param("enumType") String enumType);

    @Select("""
            select value from kpm_enum_items
            where enum_type=#{enumType} and semantic=#{semantic} and active=true
            order by sort_order, id
            limit 1
            """)
    String enumValueBySemantic(@Param("enumType") String enumType, @Param("semantic") String semantic);

    @Select("""
            select semantic from kpm_enum_items
            where enum_type=#{enumType} and value=#{value} and active=true
            limit 1
            """)
    String enumSemantic(@Param("enumType") String enumType, @Param("value") String value);

    @Insert("""
            insert into kpm_projects (id, external_name, internal_name, model_name, manager_user_id, manager_account, archived, description)
            values (#{command.id}, #{command.externalName}, #{command.internalName}, #{command.modelName}, #{command.managerUserId}, #{command.managerAccount}, false, #{command.description})
            """)
    void insertProject(@Param("command") ProjectWriteCommand command);

    @Update("""
            update kpm_projects
            set external_name=#{command.externalName},
                internal_name=#{command.internalName},
                model_name=#{command.modelName},
                manager_user_id=#{command.managerUserId},
                manager_account=#{command.managerAccount},
                description=#{command.description},
                updated_at=current_timestamp,
                update_time=current_timestamp
            where id=#{command.id} and del_flag=0
            """)
    void updateProject(@Param("command") ProjectWriteCommand command);

    @Update("update kpm_projects set del_flag=1, updated_at=current_timestamp, update_time=current_timestamp where id=#{id}")
    void deleteProject(@Param("id") String id);

    @Select("select name from kpm_users where (account=#{account} or id=#{account}) and del_flag=0 limit 1")
    String managerName(@Param("account") String account);

    @Select("select id, account, email, name from kpm_users where (account=#{value} or email=#{value} or name=#{value}) and del_flag=0")
    List<UserLookupEntity> usersByAccountOrName(@Param("value") String value);

    @Select("select id, account, email, name from kpm_users where id=#{id} and del_flag=0")
    UserLookupEntity userById(@Param("id") String id);

    @Select("""
            select pm.id,
                   pm.user_id as userId,
                   coalesce(u.account, pm.user_account) as userAccount,
                   coalesce(u.name, pm.user_account) as userName,
                   pm.role_name as roleName
            from kpm_project_members pm left join kpm_users u on u.id = pm.user_id or (pm.user_id is null and u.account = pm.user_account)
            where pm.project_id = #{projectId} and pm.del_flag=0 order by pm.role_name, coalesce(u.name, pm.user_account)
            """)
    List<ProjectMemberEntity> members(@Param("projectId") String projectId);

    @Update("update kpm_project_members set del_flag=1, update_time=current_timestamp where project_id=#{projectId}")
    void deleteMembers(@Param("projectId") String projectId);

    @Insert("insert into kpm_project_members (id, project_id, user_id, user_account, role_name) values (#{id}, #{projectId}, #{userId}, #{account}, #{role})")
    void insertMember(@Param("id") String id, @Param("projectId") String projectId, @Param("userId") String userId, @Param("account") String account, @Param("role") String role);

    @Select("""
            select id,
                   project_id as projectId,
                   whole_machine_part_number as wholeMachinePartNumber,
                   configuration_name as configurationName,
                   memory_type as memoryType,
                   active,
                   created_at as createdAt,
                   updated_at as updatedAt
            from kpm_project_skus
            where project_id=#{projectId} and del_flag=0
            order by active desc, updated_at desc, configuration_name
            """)
    List<ProjectSkuEntity> skus(@Param("projectId") String projectId);

    @Select("""
            select id,
                   project_id as projectId,
                   whole_machine_part_number as wholeMachinePartNumber,
                   configuration_name as configurationName,
                   memory_type as memoryType,
                   active,
                   created_at as createdAt,
                   updated_at as updatedAt
            from kpm_project_skus
            where id=#{skuId} and project_id=#{projectId} and del_flag=0
            """)
    ProjectSkuEntity sku(@Param("projectId") String projectId, @Param("skuId") String skuId);

    @Insert("""
            insert into kpm_project_skus
            (id, project_id, whole_machine_part_number, configuration_name, memory_type, active, creator, updator)
            values (#{command.id}, #{command.projectId}, #{command.wholeMachinePartNumber}, #{command.configurationName}, #{command.memoryType}, #{command.active}, #{command.operator}, #{command.operator})
            """)
    void insertSku(@Param("command") ProjectSkuWriteCommand command);

    @Update("""
            update kpm_project_skus
            set whole_machine_part_number=#{command.wholeMachinePartNumber},
                configuration_name=#{command.configurationName},
                memory_type=#{command.memoryType},
                active=#{command.active},
                updator=#{command.operator},
                updated_at=current_timestamp,
                update_time=current_timestamp
            where id=#{command.id} and project_id=#{command.projectId} and del_flag=0
            """)
    int updateSku(@Param("command") ProjectSkuWriteCommand command);

    @Update("""
            update kpm_project_skus
            set del_flag=1, active=false, updator=#{operator}, updated_at=current_timestamp, update_time=current_timestamp
            where id=#{skuId} and project_id=#{projectId} and del_flag=0
            """)
    int deleteSku(@Param("projectId") String projectId, @Param("skuId") String skuId, @Param("operator") String operator);

    @Select("""
            select id, project_id as projectId, stage_name as stageName, stage_order as stageOrder, status
            from kpm_project_stages where project_id=#{projectId} and del_flag=0 order by stage_order
            """)
    List<ProjectStageEntity> stages(@Param("projectId") String projectId);

    @Select("""
            select id, project_id as projectId, stage_name as stageName, stage_order as stageOrder, status
            from kpm_project_stages where id=#{stageId} and del_flag=0
            """)
    ProjectStageEntity stage(@Param("stageId") String stageId);

    @Select("select id from kpm_project_stages where project_id=#{projectId} and stage_name=#{stageName} and del_flag=0")
    List<String> stageIdsByName(@Param("projectId") String projectId, @Param("stageName") String stageName);

    @Select("select stage_name from kpm_template_stages where template_id=#{templateId} and del_flag=0 order by sort_order")
    List<String> templateStageNames(@Param("templateId") String templateId);

    @Insert("insert into kpm_project_stages (id, project_id, stage_name, stage_order, status) values (#{id}, #{projectId}, #{stageName}, #{order}, #{status})")
    void insertStage(@Param("id") String id, @Param("projectId") String projectId, @Param("stageName") String stageName, @Param("order") int order, @Param("status") String status);

    @Update("update kpm_project_stages set status=#{status}, update_time=current_timestamp where id=#{stageId} and del_flag=0")
    void updateStageStatus(@Param("stageId") String stageId, @Param("status") String status);

    @Update("update kpm_projects set archived=#{archived}, updated_at=current_timestamp, update_time=current_timestamp where id=#{projectId} and del_flag=0")
    void archiveProject(@Param("projectId") String projectId, @Param("archived") Boolean archived);

    @Select("""
            select sa.assignee_type as assigneeType,
                   case when sa.assignee_type='user' then coalesce(u.name, sa.assignee_name) else sa.assignee_name end as assigneeName,
                   case when sa.assignee_type='user' then coalesce(u.account, sa.account) else sa.account end as account,
                   sa.user_id as userId
            from kpm_stage_assignees sa
            left join kpm_users u on u.del_flag=0 and (u.id = sa.user_id or (sa.user_id is null and u.account = sa.account))
            where sa.stage_id=#{stageId} and sa.del_flag=0 order by sa.id
            """)
    List<StageAssigneeEntity> stageAssignees(@Param("stageId") String stageId);

    @Update("update kpm_stage_assignees set del_flag=1, update_time=current_timestamp where stage_id=#{stageId} and del_flag=0")
    void deleteStageAssignees(@Param("stageId") String stageId);

    @Insert("insert into kpm_stage_assignees (id, stage_id, assignee_type, assignee_name, account, user_id) values (#{id}, #{stageId}, #{type}, #{name}, #{account}, #{userId})")
    void insertStageAssignee(@Param("id") String id, @Param("stageId") String stageId, @Param("type") String type, @Param("name") String name, @Param("account") String account, @Param("userId") String userId);

    @Select("""
            select id,
                   stage_id as stageId,
                   file_name as fileName,
                   file_type as fileType,
                   file_size as fileSize,
                   description,
                   uploader,
                   bucket,
                   object_key as objectKey,
                   storage_url as storageUrl,
                   storage_category as storageCategory,
                   published_to_project as publishedToProject,
                   uploaded_at as uploadedAt
            from kpm_stage_materials where stage_id=#{stageId} and del_flag=0 order by uploaded_at desc
            """)
    List<ProjectFileEntity> stageMaterials(@Param("stageId") String stageId);

    @Insert("""
            insert into kpm_stage_materials
            (id, stage_id, file_name, file_type, file_size, description, uploader, bucket, object_key, storage_url, storage_category, published_to_project)
            values (#{id}, #{stageId}, #{request.fileName}, #{request.fileType}, #{request.fileSize}, #{request.description}, #{request.uploader}, #{request.bucket}, #{request.objectKey}, #{request.storageUrl}, coalesce(#{request.storageCategory}, #{request.category}), false)
            """)
    void insertStageMaterial(@Param("id") String id, @Param("stageId") String stageId, @Param("request") FileMetadataRequest request);

    @Select("""
            select id, stage_id as stageId, author, content, cast(attachments as text) as attachments, created_at as createdAt
            from kpm_stage_records where stage_id=#{stageId} and del_flag=0 order by created_at desc
            """)
    List<StageRecordEntity> stageRecords(@Param("stageId") String stageId);

    default void insertStageRecord(String id, String stageId, String author, String content, List<Object> attachments) {
        insertStageRecordRow(id, stageId, author, content, JsonUtil.toJson(attachments == null ? List.of() : attachments));
    }

    @Insert("insert into kpm_stage_records (id, stage_id, author, content, attachments) values (#{id}, #{stageId}, #{author}, #{content}, cast(#{attachmentsJson} as jsonb))")
    void insertStageRecordRow(@Param("id") String id, @Param("stageId") String stageId, @Param("author") String author, @Param("content") String content, @Param("attachmentsJson") String attachmentsJson);

    @Select("""
            select sm.id,
                   sm.stage_id as stageId,
                   ps.project_id as projectId,
                   ps.stage_name as stageName,
                   sm.file_name as fileName,
                   sm.file_type as fileType,
                   sm.file_size as fileSize,
                   sm.description,
                   sm.uploader,
                   sm.bucket,
                   sm.object_key as objectKey,
                   sm.storage_url as storageUrl,
                   sm.storage_category as storageCategory,
                   sm.published_to_project as publishedToProject,
                   sm.uploaded_at as uploadedAt
            from kpm_stage_materials sm join kpm_project_stages ps on ps.id = sm.stage_id
            where sm.id=#{materialId} and sm.del_flag=0 and ps.del_flag=0
            """)
    ProjectFileEntity stageMaterialForPublish(@Param("materialId") String materialId);

    @Update("update kpm_stage_materials set published_to_project=true, update_time=current_timestamp where id=#{materialId} and del_flag=0")
    void markStageMaterialPublished(@Param("materialId") String materialId);

    @Insert("""
            insert into kpm_project_materials
            (id, project_id, source_stage, file_name, file_type, file_size, description, uploader, bucket, object_key, storage_url, storage_category, share_target, public_visible)
            values (#{id}, #{material.projectId}, #{material.stageName}, #{material.fileName}, #{material.fileType}, #{material.fileSize}, #{material.description}, #{material.uploader}, #{material.bucket}, #{material.objectKey}, #{material.storageUrl}, #{material.storageCategory}, '项目资料区', false)
            """)
    void insertProjectMaterial(@Param("id") String id, @Param("material") ProjectFileEntity material);

    @Insert("""
            insert into kpm_project_materials
            (id, project_id, source_stage, file_name, file_type, file_size, description, uploader, bucket, object_key, storage_url, storage_category, share_target, public_visible)
            values (#{id}, #{projectId}, '直接上传', #{request.fileName}, #{request.fileType}, #{request.fileSize}, #{request.description}, #{request.uploader}, #{request.bucket}, #{request.objectKey}, #{request.storageUrl}, coalesce(#{request.storageCategory}, #{request.category}), '项目资料区', false)
            """)
    void insertProjectMaterialFromRequest(@Param("id") String id, @Param("projectId") String projectId, @Param("request") FileMetadataRequest request);

    @Update("""
            update kpm_project_materials
            set public_visible=true, public_at=current_timestamp, updator=#{operator}, update_time=current_timestamp
            where id=#{materialId} and project_id=#{projectId} and del_flag=0
            """)
    int markProjectMaterialPublic(@Param("projectId") String projectId, @Param("materialId") String materialId, @Param("operator") String operator);

    @Select("""
            select id,
                   project_id as projectId,
                   source_stage as sourceStage,
                   file_name as fileName,
                   file_type as fileType,
                   file_size as fileSize,
                   description,
                   uploader,
                   bucket,
                   object_key as objectKey,
                   storage_url as storageUrl,
                   storage_category as storageCategory,
                   share_target as shareTarget,
                   public_visible as publicVisible,
                   published_at as publishedAt,
                   public_at as publicAt
            from kpm_project_materials where project_id=#{projectId} and del_flag=0 order by published_at desc
            """)
    List<ProjectFileEntity> projectMaterials(@Param("projectId") String projectId);

    @Select("""
            select pc.id,
                   pc.project_status as projectStatus,
                   c.id as customerId,
                   c.name as customerName,
                   c.region,
                   c.level,
                   c.status as customerStatus
            from kpm_project_customers pc join kpm_customers c on c.id = pc.customer_id
            where pc.project_id = #{projectId} and pc.del_flag=0 and c.del_flag=0 order by c.name
            """)
    List<ProjectCustomerEntity> projectCustomers(@Param("projectId") String projectId);

    @Select("select id from kpm_project_customers where project_id=#{projectId} and customer_id=#{customerId} and del_flag=0")
    List<String> projectCustomerIds(@Param("projectId") String projectId, @Param("customerId") String customerId);

    @Insert("insert into kpm_project_customers (id, project_id, customer_id, project_status) values (#{id}, #{projectId}, #{customerId}, #{projectStatus})")
    void insertProjectCustomer(@Param("id") String id, @Param("projectId") String projectId, @Param("customerId") String customerId, @Param("projectStatus") String projectStatus);

    @Update("update kpm_project_customers set project_status=#{projectStatus}, update_time=current_timestamp where project_id=#{projectId} and customer_id=#{customerId} and del_flag=0")
    void updateProjectCustomerStatus(@Param("projectId") String projectId, @Param("customerId") String customerId, @Param("projectStatus") String projectStatus);

    @Select("""
            select r.id,
                   r.project_id as projectId,
                   r.customer_id as customerId,
                   c.name as customerName,
                   r.title,
                   r.user_story as userStory,
                   r.business_value as businessValue,
                   r.acceptance,
                   r.priority,
                   r.status,
                   r.proposer,
                   r.creator,
                   r.created_date as createdDate,
                   r.task_id as taskId
            from kpm_requirements r left join kpm_customers c on c.id = r.customer_id
            where r.project_id=#{projectId} and r.customer_id=#{customerId} and r.del_flag=0 order by r.created_date desc
            """)
    List<RequirementEntity> requirements(@Param("projectId") String projectId, @Param("customerId") String customerId);

    @Select("""
            select r.title,
                   cast(count(*) as int) as customerCount,
                   string_agg(c.name, ', ' order by c.name) as customers,
                   max(r.priority) as priority,
                   string_agg(distinct r.status, ', ') as statuses
            from kpm_requirements r join kpm_customers c on c.id = r.customer_id
            where r.project_id = #{projectId} and r.del_flag=0 and c.del_flag=0 group by r.title order by customerCount desc, r.title
            """)
    List<RequirementOverviewEntity> requirementOverview(@Param("projectId") String projectId);

    @Insert("""
            insert into kpm_requirements (id, project_id, customer_id, title, user_story, business_value, acceptance, priority, status, proposer, creator, created_date, task_id)
            values (#{command.id}, #{command.projectId}, #{command.customerId}, #{command.title}, #{command.userStory}, #{command.businessValue}, #{command.acceptance}, #{command.priority}, #{command.status}, #{command.proposer}, #{command.creator}, current_date, #{command.taskId})
            """)
    void insertRequirement(@Param("command") RequirementWriteCommand command);

    @Select("""
            select r.id,
                   r.project_id as projectId,
                   r.customer_id as customerId,
                   c.name as customerName,
                   r.title,
                   r.user_story as userStory,
                   r.business_value as businessValue,
                   r.acceptance,
                   r.priority,
                   r.status,
                   r.proposer,
                   r.creator,
                   r.created_date as createdDate,
                   r.task_id as taskId
            from kpm_requirements r left join kpm_customers c on c.id = r.customer_id
            where r.id=#{id} and r.del_flag=0
            """)
    RequirementEntity requirement(@Param("id") String id);

    @Update("update kpm_requirements set status=#{status}, update_time=current_timestamp where id=#{id} and del_flag=0")
    void voidRequirement(@Param("id") String id, @Param("status") String status);

    @Update("update kpm_requirements set del_flag=1, update_time=current_timestamp where id=#{id}")
    void deleteRequirement(@Param("id") String id);

    @Select("select coalesce(max(cast(regexp_replace(id::text, '[^0-9]', '', 'g') as int)), 0) from kpm_requirements where id::text like 'REQ-%' and del_flag=0")
    Integer maxRequirementNumber();

    @Insert("""
            insert into kpm_tasks (id, task_no, title, description, project_id, category, status, priority, creator_user_id, creator, expected_completion_at, due_date, source, customer_id)
            values (#{command.taskId}, #{command.taskNo}, #{command.title}, #{command.description}, #{command.projectId}, #{command.category}, #{command.status}, #{command.priority}, #{command.creatorUserId}, #{command.creatorName}, cast(#{command.expectedCompletionAt} as date), cast(#{command.expectedCompletionAt} as date), #{command.source}, #{command.customerId})
            """)
    void insertRequirementTask(@Param("command") RequirementTaskWriteCommand command);

    @Insert("insert into kpm_task_assignees (task_id, user_id, assignee_name) values (#{taskId}, #{userId}, #{assigneeName})")
    void insertRequirementTaskAssignee(@Param("taskId") String taskId, @Param("userId") String userId, @Param("assigneeName") String assigneeName);

    @Insert("""
            insert into kpm_project_announcements
            (id, project_id, title, content, announcement_type, publisher)
            values (#{id}, #{projectId}, #{title}, #{content}, #{announcementType}, #{publisher})
            """)
    void insertProjectAnnouncement(
            @Param("id") String id,
            @Param("projectId") String projectId,
            @Param("title") String title,
            @Param("content") String content,
            @Param("announcementType") String announcementType,
            @Param("publisher") String publisher
    );

    @Insert("""
            insert into kpm_customer_portal_messages
            (customer_id, contact_id, contact_email, title, content, message_type, project_id, announcement_id)
            select c.id,
                   cc.id,
                   lower(cc.email),
                   #{title},
                   #{content},
                   'announcement',
                   #{projectId},
                   #{announcementId}
            from kpm_project_customers pc
            join kpm_customers c on c.id=pc.customer_id and c.del_flag=0
            join kpm_customer_contacts cc on cc.customer_id=c.id and cc.del_flag=0 and cc.email is not null and cc.email <> ''
            where pc.project_id=#{projectId} and pc.del_flag=0
            """)
    void insertCustomerPortalMessagesForAnnouncement(@Param("projectId") String projectId, @Param("announcementId") String announcementId, @Param("title") String title, @Param("content") String content);

    @Select("select nextval('kpm_task_no_seq')")
    Long nextTaskNumber();

    @Select("select short_name from kpm_customers where id=#{customerId} and del_flag=0")
    String customerShortName(@Param("customerId") String customerId);

    @Insert("""
            insert into kpm_notification_events (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, status)
            values (#{id}, #{eventType}, 'project', #{aggregateId}, #{title}, #{content}, cast(#{recipientUserIdsJson} as jsonb), 'PENDING')
            """)
    void insertNotificationEvent(@Param("id") String id, @Param("eventType") String eventType, @Param("aggregateId") String aggregateId, @Param("title") String title, @Param("content") String content, @Param("recipientUserIdsJson") String recipientUserIdsJson);

    @Select("select id, name, scope, status, updated_at as updatedAt from kpm_process_templates where del_flag=0 order by updated_at desc, name")
    List<ProcessTemplateEntity> templates();

    @Select("select id, name, scope, status, updated_at as updatedAt from kpm_process_templates where id=#{id} and del_flag=0")
    ProcessTemplateEntity template(@Param("id") String id);

    @Select("select id from kpm_process_templates where id=#{id} and del_flag=0")
    List<String> templateIds(@Param("id") String id);

    @Insert("insert into kpm_process_templates (id, name, scope, status, updated_at) values (#{command.id}, #{command.name}, #{command.scope}, #{command.status}, current_date)")
    void insertTemplate(@Param("command") ProcessTemplateWriteCommand command);

    @Update("update kpm_process_templates set name=#{command.name}, scope=#{command.scope}, status=#{command.status}, updated_at=current_date, update_time=current_timestamp where id=#{command.id} and del_flag=0")
    void updateTemplate(@Param("command") ProcessTemplateWriteCommand command);

    @Update("update kpm_process_templates set del_flag=1, status='停用', update_time=current_timestamp where id=#{id}")
    void deleteTemplate(@Param("id") String id);

    @Update("update kpm_template_stages set del_flag=1, update_time=current_timestamp where template_id=#{templateId}")
    void deleteTemplateStages(@Param("templateId") String templateId);

    @Insert("insert into kpm_template_stages (id, template_id, stage_name, sort_order) values (#{id}, #{templateId}, #{stageName}, #{sortOrder})")
    void insertTemplateStage(@Param("id") String id, @Param("templateId") String templateId, @Param("stageName") String stageName, @Param("sortOrder") int sortOrder);
}
