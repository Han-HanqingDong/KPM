import { CheckCircleOutlined, ClockCircleOutlined, ProjectOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataState } from '../components/common/DataState';
import { PageScaffold } from '../components/PageScaffold';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useKpmData } from '../hooks/useKpmData';
import type { Project } from '../types';
import { isAssignedToUser, isClosedTaskStatus, isCompletedTaskStatus } from '../utils/format';

export function DashboardPage() {
  const { data, isLoading, error } = useKpmData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const taskStats = useMemo(() => {
    const tasks = data?.tasks || [];
    const completedStatusValues = new Set((data?.bootstrap?.enumItems || [])
      .filter((item) => item.enumType === 'task_status' && item.semantic === '完成')
      .map((item) => item.value)
      .filter(Boolean));
    const currentName = user?.name || user?.account || '';
    const openTasks = tasks.filter((task) => !isClosedTaskStatus(task.status));
    const mine = openTasks.filter((task) => isAssignedToUser(task.assignees, currentName));
    const waiting = openTasks.filter((task) => !isAssignedToUser(task.assignees, currentName));
    const completed = tasks.filter((task) => completedStatusValues.has(String(task.status || '')) || isCompletedTaskStatus(task.status));
    return { total: tasks.length, mine: mine.length, waiting: waiting.length, completed: completed.length };
  }, [data?.bootstrap?.enumItems, data?.tasks, user?.account, user?.name]);

  const recentProjects = (data?.projects || []).slice(0, 12);

  return (
    <PageScaffold title="工作台" subtitle="快速查看与你有关的任务、项目与系统动态。">
      <DataState loading={isLoading} error={error}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}><StatCard icon={<UnorderedListOutlined />} title="任务总数" value={taskStats.total} onClick={() => navigate('/tasks')} /></Col>
          <Col xs={24} md={6}><StatCard icon={<ClockCircleOutlined />} title="我正在执行" value={taskStats.mine} accent="green" onClick={() => navigate('/tasks?assignee=me')} /></Col>
          <Col xs={24} md={6}><StatCard icon={<ClockCircleOutlined />} title="等待他人" value={taskStats.waiting} accent="yellow" onClick={() => navigate('/tasks?assignee=others')} /></Col>
          <Col xs={24} md={6}><StatCard icon={<CheckCircleOutlined />} title="已完成" value={taskStats.completed} accent="blue" onClick={() => navigate('/tasks?status=completed')} /></Col>
        </Row>

        <Row gutter={[16, 16]} className="kpm-section-row">
          <Col xs={24}>
            <Card title="项目气泡" className="kpm-card" extra={<ProjectOutlined />}>
              {recentProjects.length ? (
                <div className="kpm-project-bubbles">
                  {recentProjects.map((project: Project, index) => (
                    <button key={project.id} className={`project-bubble tone-${index % 6}`} type="button" onClick={() => navigate(`/projects/${project.id}`, { state: { from: '/dashboard' } })}>
                      <strong>{project.externalName}</strong>
                      <span>{project.modelName || project.internalName || '未设置型号'}</span>
                    </button>
                  ))}
                </div>
              ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无项目" />}
            </Card>
          </Col>
        </Row>
      </DataState>
    </PageScaffold>
  );
}
