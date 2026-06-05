import { DownloadOutlined, LeftOutlined, LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Empty, Input, List, Modal, Space, Spin, Tag, Tooltip, Typography, message } from "antd";
import type { UIEvent } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { KozenLogo } from "../../components/KozenLogo";
import { LanguageSwitch } from "../../components/LanguageSwitch";
import {
  clearCustomerPortalSession,
  customerPortalApi,
  customerPortalStorageKeys,
  readCustomerPortalToken,
} from "../../services/customerPortalApi";
import type { AnyRecord, KnowledgeArticle } from "../../types";
import { dateTimeText } from "../../utils/format";

const PORTAL_KB_PAGE_SIZE = 10;

function downloadFromSignedUrl(url: string, fileName?: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "download";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function ArticleReader({ article, onDownload }: { article: KnowledgeArticle; onDownload: (file: AnyRecord) => void }) {
  const { t } = useTranslation();
  return (
    <article className="kpm-knowledge-article kpm-portal-kb-article">
      <header>
        <Space wrap>
          <Tag color="processing">{article.projectScope === "OTHER" ? t("knowledge.projectOther") : article.projectNames?.join("、") || t("knowledge.projectSpecific")}</Tag>
          <Typography.Text type="secondary">{dateTimeText(article.publishedAt || article.updatedAt)}</Typography.Text>
        </Space>
        <Typography.Title level={3}>{article.title}</Typography.Title>
      </header>
      <section>
        <h3>{t("knowledge.symptom")}</h3>
        <Typography.Paragraph>{article.symptom}</Typography.Paragraph>
      </section>
      <section>
        <h3>{t("knowledge.rootCause")}</h3>
        <Typography.Paragraph>{article.rootCause}</Typography.Paragraph>
      </section>
      {article.solution ? (
        <section>
          <h3>{t("knowledge.solution")}</h3>
          <Typography.Paragraph>{article.solution}</Typography.Paragraph>
        </section>
      ) : null}
      {article.workaround ? (
        <section>
          <h3>{t("knowledge.workaround")}</h3>
          <Typography.Paragraph>{article.workaround}</Typography.Paragraph>
        </section>
      ) : null}
      {article.attachments?.length ? (
        <section>
          <h3>{t("knowledge.attachments")}</h3>
          <Space wrap>
            {article.attachments.map((file, index) => (
              <Tag
                key={file.objectKey || file.fileName || file.name || index}
                className="clickable-tag"
                icon={<DownloadOutlined />}
                onClick={() => onDownload(file)}
              >
                {file.fileName || file.name || t("knowledge.attachment")}
              </Tag>
            ))}
          </Space>
        </section>
      ) : null}
    </article>
  );
}

export function CustomerPortalKnowledgePage() {
  const hasPortalToken = Boolean(readCustomerPortalToken());
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [detail, setDetail] = useState<KnowledgeArticle | null>(null);

  const customerName = window.localStorage.getItem(customerPortalStorageKeys.customerName) || t("portal.fallbackCustomer");

  const query = useInfiniteQuery({
    queryKey: ["kpm", "customer-portal", "knowledge", appliedKeyword],
    enabled: hasPortalToken,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => customerPortalApi.knowledgePage(appliedKeyword, Number(pageParam), PORTAL_KB_PAGE_SIZE),
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: 20_000,
  });

  const articles = useMemo(() => query.data?.pages.flatMap((page) => page.items) || [], [query.data]);

  if (!hasPortalToken) return <Navigate to="/customer-login" replace />;

  function logout() {
    clearCustomerPortalSession();
    queryClient.removeQueries({ queryKey: ["kpm", "customer-portal"] });
    message.success(t("portal.loggedOut"));
    navigate("/customer-login", { replace: true });
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 32;
    if (nearBottom && query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
  }

  async function openDetail(article: KnowledgeArticle) {
    const row = await customerPortalApi.knowledgeArticle(article.id);
    setDetail(row);
  }

  async function downloadAttachment(file: AnyRecord) {
    const objectKey = file.objectKey || file.object_key;
    const fileName = file.fileName || file.name || t("knowledge.attachment");
    if (!objectKey) {
      message.error(t("portal.missingObjectKey"));
      return;
    }
    const { url } = await customerPortalApi.downloadUrl(objectKey, fileName);
    downloadFromSignedUrl(url, fileName);
  }

  return (
    <main className="kpm-customer-portal kpm-customer-kb-page">
      <header className="kpm-customer-portal-header">
        <Space size={14}>
          <KozenLogo compact />
          <div>
            <strong>Kozen</strong>
            <span>{customerName}</span>
          </div>
        </Space>
        <Space className="kpm-customer-portal-actions" wrap>
          <LanguageSwitch />
          <Button icon={<LeftOutlined />} onClick={() => navigate("/customer-portal")}>{t("knowledge.backPortal")}</Button>
          <Button icon={<LogoutOutlined />} onClick={logout}>{t("portal.exit")}</Button>
        </Space>
      </header>
      <section className="kpm-customer-portal-body">
        <Card className="kpm-card kpm-portal-kb-card" title={t("knowledge.portalTitle")}>
          <Input.Search
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder={t("knowledge.portalSearchPlaceholder")}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onSearch={(value) => setAppliedKeyword(value.trim())}
          />
          <div className="kpm-portal-kb-list" onScroll={handleScroll}>
            {query.isLoading ? (
              <div className="kpm-portal-comment-loading"><Spin /><Typography.Text type="secondary">{t("knowledge.loading")}</Typography.Text></div>
            ) : articles.length ? (
              <List
                dataSource={articles}
                renderItem={(article) => (
                  <List.Item
                    actions={[<Button key="detail" type="link" onClick={() => openDetail(article)}>{t("knowledge.detail")}</Button>]}
                  >
                    <List.Item.Meta
                      title={(
                        <Tooltip title={article.symptom}>
                          <Button type="link" className="kpm-portal-kb-title" onClick={() => openDetail(article)}>{article.title}</Button>
                        </Tooltip>
                      )}
                      description={(
                        <Space wrap size={[8, 4]}>
                          <Tag color="processing">{article.projectScope === "OTHER" ? t("knowledge.projectOther") : article.projectNames?.join("、") || t("knowledge.projectSpecific")}</Tag>
                          <Typography.Text type="secondary">{dateTimeText(article.publishedAt || article.updatedAt)}</Typography.Text>
                        </Space>
                      )}
                    />
                  </List.Item>
                )}
              />
            ) : <Empty description={t("knowledge.portalEmpty")} />}
            {query.isFetchingNextPage ? <div className="kpm-portal-comment-loading"><Spin size="small" />{t("knowledge.loading")}</div> : null}
            {!query.hasNextPage && articles.length ? <Typography.Text className="kpm-portal-comment-end" type="secondary">{t("portal.noMoreComments")}</Typography.Text> : null}
          </div>
        </Card>
      </section>
      <Modal
        title={detail?.title || t("knowledge.detail")}
        open={Boolean(detail)}
        maskClosable
        onCancel={() => setDetail(null)}
        footer={<Button type="primary" onClick={() => setDetail(null)}>{t("common.close")}</Button>}
        width={860}
        className="kpm-knowledge-detail-modal"
      >
        {detail ? <ArticleReader article={detail} onDownload={(file) => downloadAttachment(file).catch((error) => message.error(error.message || t("portal.downloadFailed")))} /> : null}
      </Modal>
    </main>
  );
}
