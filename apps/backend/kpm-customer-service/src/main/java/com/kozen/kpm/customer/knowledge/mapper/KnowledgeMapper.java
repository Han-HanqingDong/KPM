package com.kozen.kpm.customer.knowledge.mapper;

import com.kozen.kpm.customer.knowledge.entity.KnowledgeArticleEntity;
import com.kozen.kpm.customer.knowledge.entity.KnowledgeUserEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface KnowledgeMapper {
    @Select("""
            <script>
            select ka.id::text as id,
                   ka.title,
                   ka.symptom,
                   ka.root_cause as rootCause,
                   ka.solution,
                   ka.workaround,
                   ka.attachments::text as attachments,
                   ka.status,
                   ka.author_user_id::text as authorUserId,
                   ka.author_name as authorName,
                   ka.published_at as publishedAt,
                   ka.created_at as createdAt,
                   ka.updated_at as updatedAt,
                   coalesce(string_agg(distinct kap.project_id::text, ',') filter (where kap.project_id is not null and kap.del_flag=0), '') as projectIds,
                   coalesce(string_agg(distinct p.external_name, ',') filter (where p.id is not null and kap.del_flag=0), '') as projectNames,
                   coalesce(string_agg(distinct kap.project_scope, ',') filter (where kap.del_flag=0), '') as projectScopes,
                   coalesce(string_agg(distinct kac.customer_id::text, ',') filter (where kac.customer_id is not null and kac.del_flag=0), '') as customerIds,
                   coalesce(string_agg(distinct c.name, ',') filter (where c.id is not null and kac.del_flag=0), '') as customerNames,
                   coalesce(string_agg(distinct kac.customer_scope, ',') filter (where kac.del_flag=0), '') as customerScopes,
                   coalesce(string_agg(distinct kat.task_id::text, ',') filter (where kat.del_flag=0), '') as taskIds
            from kpm_knowledge_articles ka
            left join kpm_knowledge_article_projects kap on kap.article_id=ka.id and kap.del_flag=0
            left join kpm_projects p on p.id=kap.project_id and p.del_flag=0
            left join kpm_knowledge_article_customers kac on kac.article_id=ka.id and kac.del_flag=0
            left join kpm_customers c on c.id=kac.customer_id and c.del_flag=0
            left join kpm_knowledge_article_tasks kat on kat.article_id=ka.id and kat.del_flag=0
            where ka.del_flag=0
              and (#{keyword} = '' or ka.title ilike #{keyword} or ka.symptom ilike #{keyword} or ka.root_cause ilike #{keyword})
              and (#{status} = '' or ka.status = #{status})
              and (#{projectId} = '' or exists (
                select 1 from kpm_knowledge_article_projects fp
                where fp.article_id=ka.id and fp.del_flag=0 and fp.project_id=nullif(#{projectId}, '')::bigint
              ))
              and (#{customerId} = '' or exists (
                select 1 from kpm_knowledge_article_customers fc
                where fc.article_id=ka.id and fc.del_flag=0 and fc.customer_id=nullif(#{customerId}, '')::bigint
              ))
              and (#{taskId} = '' or exists (
                select 1 from kpm_knowledge_article_tasks ft
                where ft.article_id=ka.id and ft.del_flag=0 and ft.task_id=nullif(#{taskId}, '')::bigint
              ))
            group by ka.id
            order by ka.updated_at desc, ka.id desc
            limit #{limit} offset #{offset}
            </script>
            """)
    List<KnowledgeArticleEntity> pageRows(@Param("keyword") String keyword,
                                          @Param("status") String status,
                                          @Param("projectId") String projectId,
                                          @Param("customerId") String customerId,
                                          @Param("taskId") String taskId,
                                          @Param("limit") int limit,
                                          @Param("offset") int offset);

    @Select("""
            <script>
            select count(1)
            from kpm_knowledge_articles ka
            where ka.del_flag=0
              and (#{keyword} = '' or ka.title ilike #{keyword} or ka.symptom ilike #{keyword} or ka.root_cause ilike #{keyword})
              and (#{status} = '' or ka.status = #{status})
              and (#{projectId} = '' or exists (
                select 1 from kpm_knowledge_article_projects fp
                where fp.article_id=ka.id and fp.del_flag=0 and fp.project_id=nullif(#{projectId}, '')::bigint
              ))
              and (#{customerId} = '' or exists (
                select 1 from kpm_knowledge_article_customers fc
                where fc.article_id=ka.id and fc.del_flag=0 and fc.customer_id=nullif(#{customerId}, '')::bigint
              ))
              and (#{taskId} = '' or exists (
                select 1 from kpm_knowledge_article_tasks ft
                where ft.article_id=ka.id and ft.del_flag=0 and ft.task_id=nullif(#{taskId}, '')::bigint
              ))
            </script>
            """)
    long countRows(@Param("keyword") String keyword,
                   @Param("status") String status,
                   @Param("projectId") String projectId,
                   @Param("customerId") String customerId,
                   @Param("taskId") String taskId);

    @Select("""
            select ka.id::text as id,
                   ka.title,
                   ka.symptom,
                   ka.root_cause as rootCause,
                   ka.solution,
                   ka.workaround,
                   ka.attachments::text as attachments,
                   ka.status,
                   ka.author_user_id::text as authorUserId,
                   ka.author_name as authorName,
                   ka.published_at as publishedAt,
                   ka.created_at as createdAt,
                   ka.updated_at as updatedAt,
                   coalesce(string_agg(distinct kap.project_id::text, ',') filter (where kap.project_id is not null and kap.del_flag=0), '') as projectIds,
                   coalesce(string_agg(distinct p.external_name, ',') filter (where p.id is not null and kap.del_flag=0), '') as projectNames,
                   coalesce(string_agg(distinct kap.project_scope, ',') filter (where kap.del_flag=0), '') as projectScopes,
                   coalesce(string_agg(distinct kac.customer_id::text, ',') filter (where kac.customer_id is not null and kac.del_flag=0), '') as customerIds,
                   coalesce(string_agg(distinct c.name, ',') filter (where c.id is not null and kac.del_flag=0), '') as customerNames,
                   coalesce(string_agg(distinct kac.customer_scope, ',') filter (where kac.del_flag=0), '') as customerScopes,
                   coalesce(string_agg(distinct kat.task_id::text, ',') filter (where kat.del_flag=0), '') as taskIds
            from kpm_knowledge_articles ka
            left join kpm_knowledge_article_projects kap on kap.article_id=ka.id and kap.del_flag=0
            left join kpm_projects p on p.id=kap.project_id and p.del_flag=0
            left join kpm_knowledge_article_customers kac on kac.article_id=ka.id and kac.del_flag=0
            left join kpm_customers c on c.id=kac.customer_id and c.del_flag=0
            left join kpm_knowledge_article_tasks kat on kat.article_id=ka.id and kat.del_flag=0
            where ka.id=#{id} and ka.del_flag=0
            group by ka.id
            """)
    KnowledgeArticleEntity detail(@Param("id") String id);

    @Insert("""
            insert into kpm_knowledge_articles
            (id, title, symptom, root_cause, solution, workaround, attachments, status, author_user_id, author_name, creator, updator)
            values (#{id}, #{title}, #{symptom}, #{rootCause}, #{solution}, #{workaround}, cast(#{attachments} as jsonb), '待审核', cast(#{authorUserId} as bigint), #{authorName}, #{operator}, #{operator})
            """)
    void insertArticle(@Param("id") String id,
                       @Param("title") String title,
                       @Param("symptom") String symptom,
                       @Param("rootCause") String rootCause,
                       @Param("solution") String solution,
                       @Param("workaround") String workaround,
                       @Param("attachments") String attachments,
                       @Param("authorUserId") String authorUserId,
                       @Param("authorName") String authorName,
                       @Param("operator") String operator);

    @Update("""
            update kpm_knowledge_articles
            set title=#{title},
                symptom=#{symptom},
                root_cause=#{rootCause},
                solution=#{solution},
                workaround=#{workaround},
                attachments=cast(#{attachments} as jsonb),
                updated_at=current_timestamp,
                updator=#{operator},
                update_time=current_timestamp
            where id=#{id} and del_flag=0
            """)
    int updateArticle(@Param("id") String id,
                      @Param("title") String title,
                      @Param("symptom") String symptom,
                      @Param("rootCause") String rootCause,
                      @Param("solution") String solution,
                      @Param("workaround") String workaround,
                      @Param("attachments") String attachments,
                      @Param("operator") String operator);

    @Update("""
            update kpm_knowledge_articles
            set status=#{status},
                published_at=case when #{status}='已发布' then coalesce(published_at, current_timestamp) else published_at end,
                updated_at=current_timestamp,
                updator=#{operator},
                update_time=current_timestamp
            where id=#{id} and del_flag=0
            """)
    int updateStatus(@Param("id") String id, @Param("status") String status, @Param("operator") String operator);

    @Update("update kpm_knowledge_articles set del_flag=1, updator=#{operator}, update_time=current_timestamp where id=#{id} and del_flag=0")
    int deleteArticle(@Param("id") String id, @Param("operator") String operator);

    @Update("update kpm_knowledge_article_projects set del_flag=1, updator=#{operator}, update_time=current_timestamp where article_id=#{articleId} and del_flag=0")
    void deleteProjectLinks(@Param("articleId") String articleId, @Param("operator") String operator);

    @Update("update kpm_knowledge_article_customers set del_flag=1, updator=#{operator}, update_time=current_timestamp where article_id=#{articleId} and del_flag=0")
    void deleteCustomerLinks(@Param("articleId") String articleId, @Param("operator") String operator);

    @Update("update kpm_knowledge_article_tasks set del_flag=1, updator=#{operator}, update_time=current_timestamp where article_id=#{articleId} and del_flag=0")
    void deleteTaskLinks(@Param("articleId") String articleId, @Param("operator") String operator);

    @Insert("insert into kpm_knowledge_article_projects (id, article_id, project_id, project_scope, creator, updator) values (#{id}, #{articleId}, cast(#{projectId} as bigint), 'PROJECT', #{operator}, #{operator})")
    void insertProjectLink(@Param("id") String id, @Param("articleId") String articleId, @Param("projectId") String projectId, @Param("operator") String operator);

    @Insert("insert into kpm_knowledge_article_projects (id, article_id, project_scope, creator, updator) values (#{id}, #{articleId}, #{scope}, #{operator}, #{operator})")
    void insertProjectScope(@Param("id") String id, @Param("articleId") String articleId, @Param("scope") String scope, @Param("operator") String operator);

    @Insert("insert into kpm_knowledge_article_customers (id, article_id, customer_id, customer_scope, creator, updator) values (#{id}, #{articleId}, cast(#{customerId} as bigint), 'CUSTOMER', #{operator}, #{operator})")
    void insertCustomerLink(@Param("id") String id, @Param("articleId") String articleId, @Param("customerId") String customerId, @Param("operator") String operator);

    @Insert("insert into kpm_knowledge_article_customers (id, article_id, customer_scope, creator, updator) values (#{id}, #{articleId}, #{scope}, #{operator}, #{operator})")
    void insertCustomerScope(@Param("id") String id, @Param("articleId") String articleId, @Param("scope") String scope, @Param("operator") String operator);

    @Insert("insert into kpm_knowledge_article_tasks (id, article_id, task_id, creator, updator) values (#{id}, #{articleId}, cast(#{taskId} as bigint), #{operator}, #{operator})")
    void insertTaskLink(@Param("id") String id, @Param("articleId") String articleId, @Param("taskId") String taskId, @Param("operator") String operator);

    @Select("select id::text as id, account, email, name from kpm_users where del_flag=0 and (account=#{account} or email=#{account}) limit 1")
    KnowledgeUserEntity userByAccount(@Param("account") String account);

    @Select("select count(1) from kpm_projects where id=cast(#{id} as bigint) and del_flag=0")
    int projectExists(@Param("id") String id);

    @Select("select count(1) from kpm_customers where id=cast(#{id} as bigint) and del_flag=0")
    int customerExists(@Param("id") String id);

    @Select("select count(1) from kpm_tasks where id=cast(#{id} as bigint) and del_flag=0")
    int taskExists(@Param("id") String id);

    @Select("""
            <script>
            select ka.id::text as id,
                   ka.title,
                   ka.symptom,
                   ka.root_cause as rootCause,
                   ka.solution,
                   ka.workaround,
                   ka.attachments::text as attachments,
                   ka.status,
                   ka.author_user_id::text as authorUserId,
                   ka.author_name as authorName,
                   ka.published_at as publishedAt,
                   ka.created_at as createdAt,
                   ka.updated_at as updatedAt,
                   coalesce(string_agg(distinct kap.project_id::text, ',') filter (where kap.project_id is not null and kap.del_flag=0), '') as projectIds,
                   coalesce(string_agg(distinct p.external_name, ',') filter (where p.id is not null and kap.del_flag=0), '') as projectNames,
                   coalesce(string_agg(distinct kap.project_scope, ',') filter (where kap.del_flag=0), '') as projectScopes,
                   coalesce(string_agg(distinct kac.customer_id::text, ',') filter (where kac.customer_id is not null and kac.del_flag=0), '') as customerIds,
                   coalesce(string_agg(distinct c.name, ',') filter (where c.id is not null and kac.del_flag=0), '') as customerNames,
                   coalesce(string_agg(distinct kac.customer_scope, ',') filter (where kac.del_flag=0), '') as customerScopes,
                   coalesce(string_agg(distinct kat.task_id::text, ',') filter (where kat.del_flag=0), '') as taskIds
            from kpm_knowledge_articles ka
            left join kpm_knowledge_article_projects kap on kap.article_id=ka.id and kap.del_flag=0
            left join kpm_projects p on p.id=kap.project_id and p.del_flag=0
            left join kpm_knowledge_article_customers kac on kac.article_id=ka.id and kac.del_flag=0
            left join kpm_customers c on c.id=kac.customer_id and c.del_flag=0
            left join kpm_knowledge_article_tasks kat on kat.article_id=ka.id and kat.del_flag=0
            where ka.del_flag=0
              and ka.status='已发布'
              and (#{keyword} = '' or ka.title ilike #{keyword} or ka.symptom ilike #{keyword} or ka.root_cause ilike #{keyword})
              and (
                exists (select 1 from kpm_knowledge_article_customers allc where allc.article_id=ka.id and allc.del_flag=0 and allc.customer_scope='ALL')
                or exists (select 1 from kpm_knowledge_article_customers cc where cc.article_id=ka.id and cc.del_flag=0 and cc.customer_scope='CUSTOMER' and cc.customer_id=cast(#{customerId} as bigint))
              )
              and not exists (select 1 from kpm_knowledge_article_customers ic where ic.article_id=ka.id and ic.del_flag=0 and ic.customer_scope='INTERNAL')
            group by ka.id
            order by ka.published_at desc nulls last, ka.updated_at desc, ka.id desc
            limit #{limit} offset #{offset}
            </script>
            """)
    List<KnowledgeArticleEntity> portalPageRows(@Param("customerId") String customerId,
                                                @Param("keyword") String keyword,
                                                @Param("limit") int limit,
                                                @Param("offset") int offset);

    @Select("""
            <script>
            select count(1)
            from kpm_knowledge_articles ka
            where ka.del_flag=0
              and ka.status='已发布'
              and (#{keyword} = '' or ka.title ilike #{keyword} or ka.symptom ilike #{keyword} or ka.root_cause ilike #{keyword})
              and (
                exists (select 1 from kpm_knowledge_article_customers allc where allc.article_id=ka.id and allc.del_flag=0 and allc.customer_scope='ALL')
                or exists (select 1 from kpm_knowledge_article_customers cc where cc.article_id=ka.id and cc.del_flag=0 and cc.customer_scope='CUSTOMER' and cc.customer_id=cast(#{customerId} as bigint))
              )
              and not exists (select 1 from kpm_knowledge_article_customers ic where ic.article_id=ka.id and ic.del_flag=0 and ic.customer_scope='INTERNAL')
            </script>
            """)
    long portalCountRows(@Param("customerId") String customerId, @Param("keyword") String keyword);

    @Select("""
            select count(1)
            from kpm_knowledge_articles ka
            where ka.id=#{id}
              and ka.del_flag=0
              and ka.status='已发布'
              and (
                exists (select 1 from kpm_knowledge_article_customers allc where allc.article_id=ka.id and allc.del_flag=0 and allc.customer_scope='ALL')
                or exists (select 1 from kpm_knowledge_article_customers cc where cc.article_id=ka.id and cc.del_flag=0 and cc.customer_scope='CUSTOMER' and cc.customer_id=cast(#{customerId} as bigint))
              )
              and not exists (select 1 from kpm_knowledge_article_customers ic where ic.article_id=ka.id and ic.del_flag=0 and ic.customer_scope='INTERNAL')
            """)
    int portalArticleVisible(@Param("id") String id, @Param("customerId") String customerId);
}
