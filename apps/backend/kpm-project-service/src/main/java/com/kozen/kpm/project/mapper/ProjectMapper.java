package com.kozen.kpm.project.mapper;

import com.kozen.kpm.common.util.JsonUtil;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

/** Project data access mapper backed by MyBatis. */
@Mapper
public interface ProjectMapper {
    @Select("""
            select * from kpm_projects
            where (cast(#{keyword} as text) is null or #{keyword} = '' or external_name ilike #{keywordLike} or internal_name ilike #{keywordLike} or model_name ilike #{keywordLike})
              and (cast(#{salesability} as text) is null or #{salesability} = '' or #{salesability} like '全部%' or salesability = #{salesability})
              and (cast(#{archived,jdbcType=BOOLEAN} as boolean) is null or archived = #{archived,jdbcType=BOOLEAN})
              and del_flag=0
            order by created_at desc, external_name
            """)
    List<Map<String, Object>> list(@Param("keyword") String keyword, @Param("keywordLike") String keywordLike, @Param("salesability") String salesability, @Param("archived") Boolean archived);

    default List<Map<String, Object>> list(String keyword, String salesability, Boolean archived) {
        String trimmed = keyword == null ? null : keyword.trim();
        String like = trimmed == null || trimmed.isBlank() ? "" : "%" + trimmed + "%";
        return list(trimmed, like, salesability, archived);
    }

    @Select("select * from kpm_projects where id=#{id} and del_flag=0")
    Map<String, Object> load(@Param("id") String id);

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
            insert into kpm_projects (id, external_name, internal_name, model_name, manager_user_id, manager_account, status, archived, salesability, unsellable_reason, description)
            values (#{id}, #{body.externalName}, #{body.internalName}, #{body.modelName}, #{managerUserId}, #{managerAccount}, #{status}, false, #{salesability}, #{unsellableReason}, #{body.description})
            """)
    void insertProject(@Param("id") String id, @Param("body") Map<String, Object> body, @Param("status") String status, @Param("salesability") String salesability, @Param("unsellableReason") Object unsellableReason, @Param("managerUserId") String managerUserId, @Param("managerAccount") String managerAccount);

    @Update("""
            update kpm_projects
            set external_name=#{body.externalName}, internal_name=#{body.internalName}, model_name=#{body.modelName}, manager_user_id=#{managerUserId}, manager_account=#{managerAccount}, salesability=#{salesability}, unsellable_reason=#{unsellableReason}, description=#{body.description}, updated_at=current_timestamp
            where id=#{id} and del_flag=0
            """)
    void updateProject(@Param("id") String id, @Param("body") Map<String, Object> body, @Param("salesability") String salesability, @Param("unsellableReason") Object unsellableReason, @Param("managerUserId") String managerUserId, @Param("managerAccount") String managerAccount);

    @Update("update kpm_projects set del_flag=1, updated_at=current_timestamp, update_time=current_timestamp where id=#{id}")
    void deleteProject(@Param("id") String id);

    @Select("select name from kpm_users where (account=#{account} or id=#{account}) and del_flag=0 limit 1")
    Object managerName(@Param("account") Object account);

    @Select("select id, account, email, name from kpm_users where (account=#{value} or email=#{value} or name=#{value}) and del_flag=0")
    List<Map<String, Object>> usersByAccountOrName(@Param("value") Object value);

    @Select("select id, account, name from kpm_users where id=#{id} and del_flag=0")
    Map<String, Object> userById(@Param("id") Object id);

    @Select("""
            select pm.id, pm.user_id, coalesce(u.account, pm.user_account) as user_account, coalesce(u.name, pm.user_account) as user_name, pm.role_name
            from kpm_project_members pm left join kpm_users u on u.id = pm.user_id or (pm.user_id is null and u.account = pm.user_account)
            where pm.project_id = #{projectId} and pm.del_flag=0 order by pm.role_name, coalesce(u.name, pm.user_account)
            """)
    List<Map<String, Object>> members(@Param("projectId") String projectId);

    @Delete("delete from kpm_project_members where project_id=#{projectId}")
    void deleteMembers(@Param("projectId") String projectId);

    @Insert("insert into kpm_project_members (id, project_id, user_id, user_account, role_name) values (#{id}, #{projectId}, #{userId}, #{account}, #{role})")
    void insertMember(@Param("id") String id, @Param("projectId") String projectId, @Param("userId") String userId, @Param("account") String account, @Param("role") String role);

    @Select("""
            select id, project_id, whole_machine_part_number, configuration_name, memory_type, active, created_at, updated_at
            from kpm_project_skus
            where project_id=#{projectId} and del_flag=0
            order by active desc, updated_at desc, configuration_name
            """)
    List<Map<String, Object>> skus(@Param("projectId") String projectId);

    @Select("""
            select id, project_id, whole_machine_part_number, configuration_name, memory_type, active, created_at, updated_at
            from kpm_project_skus
            where id=#{skuId} and project_id=#{projectId} and del_flag=0
            """)
    Map<String, Object> sku(@Param("projectId") String projectId, @Param("skuId") String skuId);

    @Insert("""
            insert into kpm_project_skus
            (id, project_id, whole_machine_part_number, configuration_name, memory_type, active, creator, updator)
            values (#{id}, #{projectId}, #{body.wholeMachinePartNumber}, #{body.configurationName}, #{body.memoryType}, #{body.active}, #{operator}, #{operator})
            """)
    void insertSku(@Param("id") String id, @Param("projectId") String projectId, @Param("body") Map<String, Object> body, @Param("operator") String operator);

    @Update("""
            update kpm_project_skus
            set whole_machine_part_number=#{body.wholeMachinePartNumber},
                configuration_name=#{body.configurationName},
                memory_type=#{body.memoryType},
                active=#{body.active},
                updator=#{operator},
                updated_at=current_timestamp,
                update_time=current_timestamp
            where id=#{skuId} and project_id=#{projectId} and del_flag=0
            """)
    int updateSku(@Param("projectId") String projectId, @Param("skuId") String skuId, @Param("body") Map<String, Object> body, @Param("operator") String operator);

    @Update("""
            update kpm_project_skus
            set del_flag=1, active=false, updator=#{operator}, updated_at=current_timestamp, update_time=current_timestamp
            where id=#{skuId} and project_id=#{projectId} and del_flag=0
            """)
    int deleteSku(@Param("projectId") String projectId, @Param("skuId") String skuId, @Param("operator") String operator);

    @Select("select * from kpm_project_stages where project_id=#{projectId} and del_flag=0 order by stage_order")
    List<Map<String, Object>> stages(@Param("projectId") String projectId);

    @Select("select * from kpm_project_stages where id=#{stageId} and del_flag=0")
    Map<String, Object> stage(@Param("stageId") String stageId);

    @Select("select id from kpm_project_stages where project_id=#{projectId} and stage_name=#{stageName} and del_flag=0")
    List<String> stageIdsByName(@Param("projectId") String projectId, @Param("stageName") String stageName);

    @Select("select stage_name from kpm_template_stages where template_id=#{templateId} and del_flag=0 order by sort_order")
    List<String> templateStageNames(@Param("templateId") String templateId);

    @Insert("insert into kpm_project_stages (id, project_id, stage_name, stage_order, status) values (#{id}, #{projectId}, #{stageName}, #{order}, #{status})")
    void insertStage(@Param("id") String id, @Param("projectId") String projectId, @Param("stageName") String stageName, @Param("order") int order, @Param("status") Object status);

    @Update("update kpm_project_stages set status=#{status}, update_time=current_timestamp where id=#{stageId} and del_flag=0")
    void updateStageStatus(@Param("stageId") String stageId, @Param("status") Object status);

    @Select("select status from kpm_project_stages where project_id=#{projectId} and del_flag=0")
    List<String> stageStatuses(@Param("projectId") String projectId);

    @Update("update kpm_projects set status=#{status}, updated_at=current_timestamp, update_time=current_timestamp where id=#{projectId} and del_flag=0")
    void updateProjectStatus(@Param("projectId") String projectId, @Param("status") String status);

    @Update("update kpm_projects set archived=#{archived}, updated_at=current_timestamp, update_time=current_timestamp where id=#{projectId} and del_flag=0")
    void archiveProject(@Param("projectId") String projectId, @Param("archived") Object archived);

    @Select("""
            select sa.assignee_type,
                   case when sa.assignee_type='user' then coalesce(u.name, sa.assignee_name) else sa.assignee_name end as assignee_name,
                   case when sa.assignee_type='user' then coalesce(u.account, sa.account) else sa.account end as account,
                   sa.user_id
            from kpm_stage_assignees sa
            left join kpm_users u on u.id = sa.user_id or (sa.user_id is null and u.account = sa.account)
            where sa.stage_id=#{stageId} and sa.del_flag=0 order by sa.id
            """)
    List<Map<String, Object>> stageAssignees(@Param("stageId") Object stageId);

    @Delete("delete from kpm_stage_assignees where stage_id=#{stageId}")
    void deleteStageAssignees(@Param("stageId") String stageId);

    @Insert("insert into kpm_stage_assignees (id, stage_id, assignee_type, assignee_name, account, user_id) values (#{id}, #{stageId}, #{type}, #{name}, #{account}, #{userId})")
    void insertStageAssignee(@Param("id") String id, @Param("stageId") String stageId, @Param("type") String type, @Param("name") String name, @Param("account") String account, @Param("userId") String userId);

    @Select("select * from kpm_stage_materials where stage_id=#{stageId} and del_flag=0 order by uploaded_at desc")
    List<Map<String, Object>> stageMaterials(@Param("stageId") Object stageId);

    @Insert("""
            insert into kpm_stage_materials
            (id, stage_id, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category, published_to_project)
            values (#{id}, #{stageId}, #{body.fileName}, #{body.fileType}, #{body.fileSize}, #{body.uploader}, #{body.bucket}, #{body.objectKey}, #{body.storageUrl}, #{body.category}, false)
            """)
    void insertStageMaterial(@Param("id") String id, @Param("stageId") String stageId, @Param("body") Map<String, Object> body);

    @Select("select * from kpm_stage_records where stage_id=#{stageId} and del_flag=0 order by created_at desc")
    List<Map<String, Object>> stageRecords(@Param("stageId") Object stageId);

    default void insertStageRecord(String id, String stageId, Object author, Object content, Object attachments) {
        insertStageRecordRow(id, stageId, author, content, JsonUtil.toJson(attachments == null ? List.of() : attachments));
    }

    @Insert("insert into kpm_stage_records (id, stage_id, author, content, attachments) values (#{id}, #{stageId}, #{author}, #{content}, cast(#{attachmentsJson} as jsonb))")
    void insertStageRecordRow(@Param("id") String id, @Param("stageId") String stageId, @Param("author") Object author, @Param("content") Object content, @Param("attachmentsJson") String attachmentsJson);

    @Select("""
            select sm.*, ps.project_id, ps.stage_name
            from kpm_stage_materials sm join kpm_project_stages ps on ps.id = sm.stage_id
            where sm.id=#{materialId} and sm.del_flag=0 and ps.del_flag=0
            """)
    Map<String, Object> stageMaterialForPublish(@Param("materialId") String materialId);

    @Update("update kpm_stage_materials set published_to_project=true, update_time=current_timestamp where id=#{materialId} and del_flag=0")
    void markStageMaterialPublished(@Param("materialId") String materialId);

    @Insert("""
            insert into kpm_project_materials
            (id, project_id, source_stage, file_name, file_type, file_size, uploader, bucket, object_key, storage_url, storage_category, share_target)
            values (#{id}, #{material.projectId}, #{material.stageName}, #{material.fileName}, #{material.fileType}, #{material.fileSize}, #{material.uploader}, #{material.bucket}, #{material.objectKey}, #{material.storageUrl}, #{material.storageCategory}, '项目资料区')
            """)
    void insertProjectMaterial(@Param("id") String id, @Param("material") Map<String, Object> material);

    @Select("select * from kpm_project_materials where project_id=#{projectId} and del_flag=0 order by published_at desc")
    List<Map<String, Object>> projectMaterials(@Param("projectId") String projectId);

    @Select("""
            select pc.id, pc.project_status, c.id as customer_id, c.name as customer_name, c.region, c.level, c.status as customer_status
            from kpm_project_customers pc join kpm_customers c on c.id = pc.customer_id
            where pc.project_id = #{projectId} and pc.del_flag=0 and c.del_flag=0 order by c.name
            """)
    List<Map<String, Object>> projectCustomers(@Param("projectId") String projectId);

    @Select("select id from kpm_project_customers where project_id=#{projectId} and customer_id=#{customerId} and del_flag=0")
    List<String> projectCustomerIds(@Param("projectId") String projectId, @Param("customerId") String customerId);

    @Insert("insert into kpm_project_customers (id, project_id, customer_id, project_status) values (#{id}, #{projectId}, #{customerId}, #{projectStatus})")
    void insertProjectCustomer(@Param("id") String id, @Param("projectId") String projectId, @Param("customerId") String customerId, @Param("projectStatus") String projectStatus);

    @Update("update kpm_project_customers set project_status=#{projectStatus}, update_time=current_timestamp where project_id=#{projectId} and customer_id=#{customerId} and del_flag=0")
    void updateProjectCustomerStatus(@Param("projectId") String projectId, @Param("customerId") String customerId, @Param("projectStatus") Object projectStatus);

    @Select("select * from kpm_requirements where project_id=#{projectId} and customer_id=#{customerId} and del_flag=0 order by created_date desc")
    List<Map<String, Object>> requirements(@Param("projectId") String projectId, @Param("customerId") Object customerId);

    @Select("""
            select r.title, count(*) as customer_count, string_agg(c.name, ', ' order by c.name) as customers,
                   max(r.priority) as priority, string_agg(distinct r.status, ', ') as statuses
            from kpm_requirements r join kpm_customers c on c.id = r.customer_id
            where r.project_id = #{projectId} and r.del_flag=0 and c.del_flag=0 group by r.title order by customer_count desc, r.title
            """)
    List<Map<String, Object>> requirementOverview(@Param("projectId") String projectId);

    @Insert("""
            insert into kpm_requirements (id, project_id, customer_id, title, user_story, business_value, acceptance, priority, status, proposer, creator, created_date, task_id)
            values (#{id}, #{projectId}, #{customerId}, #{body.title}, #{body.userStory}, #{body.businessValue}, #{body.acceptance}, #{body.priority}, #{body.status}, #{body.proposer}, #{body.creator}, current_date, #{taskId})
            """)
    void insertRequirement(@Param("id") String id, @Param("projectId") String projectId, @Param("customerId") String customerId, @Param("body") Map<String, Object> body, @Param("taskId") String taskId);

    @Select("select * from kpm_requirements where id=#{id} and del_flag=0")
    Map<String, Object> requirement(@Param("id") String id);

    @Update("update kpm_requirements set status=#{status}, update_time=current_timestamp where id=#{id} and del_flag=0")
    void voidRequirement(@Param("id") String id, @Param("status") String status);

    @Update("update kpm_requirements set del_flag=1, update_time=current_timestamp where id=#{id}")
    void deleteRequirement(@Param("id") String id);

    @Select("select coalesce(max(cast(regexp_replace(id, '[^0-9]', '', 'g') as int)), 0) from kpm_requirements where id like 'REQ-%' and del_flag=0")
    Integer maxRequirementNumber();

    @Insert("""
            insert into kpm_tasks (id, title, description, project_id, category, status, priority, creator_user_id, creator, expected_completion_at, due_date, source, customer_id)
            values (#{taskId}, #{body.title}, #{body.userStory}, #{projectId}, #{category}, #{status}, #{body.priority}, #{creatorUserId}, #{creatorName}, cast(#{body.expectedCompletionAt} as date), cast(#{body.expectedCompletionAt} as date), #{source}, #{customerId})
            """)
    void insertRequirementTask(@Param("taskId") String taskId, @Param("projectId") String projectId, @Param("customerId") String customerId, @Param("body") Map<String, Object> body, @Param("category") String category, @Param("status") String status, @Param("source") String source, @Param("creatorUserId") String creatorUserId, @Param("creatorName") String creatorName);

    @Insert("insert into kpm_task_assignees (task_id, user_id, assignee_name) values (#{taskId}, #{userId}, #{assigneeName})")
    void insertRequirementTaskAssignee(@Param("taskId") String taskId, @Param("userId") String userId, @Param("assigneeName") Object assigneeName);

    @Select("select coalesce(max(cast(regexp_replace(id, '[^0-9]', '', 'g') as int)), 100) from kpm_tasks where id like 'KPM-%' and del_flag=0")
    Integer maxTaskNumber();

    @Insert("""
            insert into kpm_notification_events (id, event_type, aggregate_type, aggregate_id, title, content, recipient_user_ids, status)
            values (#{id}, #{eventType}, 'project', #{aggregateId}, #{title}, #{content}, cast(#{recipientUserIdsJson} as jsonb), 'PENDING')
            """)
    void insertNotificationEvent(@Param("id") String id, @Param("eventType") String eventType, @Param("aggregateId") String aggregateId, @Param("title") String title, @Param("content") String content, @Param("recipientUserIdsJson") String recipientUserIdsJson);

    @Select("select * from kpm_process_templates where del_flag=0 order by updated_at desc, name")
    List<Map<String, Object>> templates();

    @Select("select * from kpm_process_templates where id=#{id} and del_flag=0")
    Map<String, Object> template(@Param("id") String id);

    @Select("select id from kpm_process_templates where id=#{id} and del_flag=0")
    List<String> templateIds(@Param("id") String id);

    @Insert("insert into kpm_process_templates (id, name, scope, status, updated_at) values (#{id}, #{body.name}, #{body.scope}, #{body.status}, current_date)")
    void insertTemplate(@Param("id") String id, @Param("body") Map<String, Object> body);

    @Update("update kpm_process_templates set name=#{body.name}, scope=#{body.scope}, status=#{body.status}, updated_at=current_date, update_time=current_timestamp where id=#{id} and del_flag=0")
    void updateTemplate(@Param("id") String id, @Param("body") Map<String, Object> body);

    @Update("update kpm_process_templates set del_flag=1, status='停用', update_time=current_timestamp where id=#{id}")
    void deleteTemplate(@Param("id") String id);

    @Delete("delete from kpm_template_stages where template_id=#{templateId}")
    void deleteTemplateStages(@Param("templateId") String templateId);

    @Insert("insert into kpm_template_stages (id, template_id, stage_name, sort_order) values (#{id}, #{templateId}, #{stageName}, #{sortOrder})")
    void insertTemplateStage(@Param("id") String id, @Param("templateId") String templateId, @Param("stageName") Object stageName, @Param("sortOrder") int sortOrder);
}
