import { lazy, Suspense } from 'react';
import { Navigate, Route, HashRouter as Router, Routes, useLocation } from 'react-router-dom';
import { Skeleton } from 'antd';
import './styles.css';
import { MainLayout } from './components/MainLayout';
import { I18nDomBridge } from './components/I18nDomBridge';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';

const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const CustomersPage = lazy(() => import('./pages/CustomersPage').then((module) => ({ default: module.CustomersPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const OrdersPage = lazy(() => import('./pages/OrdersPage').then((module) => ({ default: module.OrdersPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));
const TasksPage = lazy(() => import('./pages/TasksPage').then((module) => ({ default: module.TasksPage })));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage').then((module) => ({ default: module.TemplatesPage })));
const CustomerPortalLoginPage = lazy(() => import('./pages/customerPortal/CustomerPortalLoginPage').then((module) => ({ default: module.CustomerPortalLoginPage })));
const CustomerPortalPage = lazy(() => import('./pages/customerPortal/CustomerPortalPage').then((module) => ({ default: module.CustomerPortalPage })));

function RouteFallback() {
  return <div className="kpm-route-fallback"><Skeleton active paragraph={{ rows: 8 }} /></div>;
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <MainLayout />;
}

function AuthRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <I18nDomBridge />
      <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/login" element={<AuthRedirect />} />
            <Route path="/customer-login" element={<CustomerPortalLoginPage />} />
            <Route path="/customer-portal" element={<CustomerPortalPage />} />
            <Route element={<ProtectedLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/analytics/*" element={<AnalyticsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
