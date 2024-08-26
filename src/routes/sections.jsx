import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

// External imports
import Logs from 'src/pages/admin/Logs'; 
import Media from 'src/pages/admin/Media';
import BrandPage from 'src/pages/admin/Brand';
import VaultTable from 'src/pages/admin/Vault';
import Password from 'src/pages/admin/Password';
import Passwords from 'src/pages/user/Passwords';
import Members from 'src/pages/superadmin/Members';
import DashboardLayout from 'src/layouts/dashboard';
import LandingPage from 'src/landing-page/LandingPage';
import UserProfilePage from 'src/pages/user/UserProfile';
import TotalAdmins from 'src/pages/superadmin/TotalAdmins';

import AdminProfilePage from 'src/sections/login/Profile';
import RegisterView from 'src/sections/login/RegisterView';
import ForgotPassword from 'src/sections/login/ForgotPassword';
import ClientDetails from 'src/sections/admin-table/ClientDetails'; // Moved here
import PaymentSettings from 'src/pages/superadmin/PaymentSettings'; // Moved here
import ResetPasswordView from 'src/sections/login/ResetPasswordView';
import ForgotPasswordView from 'src/sections/login/ForgotPasswordView';
import MediaAccountForm from 'src/sections/admin-table/MediaAccountForm';
import Subscriptionindex from 'src/sections/admin-table/Subscriptionindex';


// Lazy imports
export const IndexPage = lazy(() => import('src/pages/admin/app'));
export const UserPage = lazy(() => import('src/pages/admin/user'));
export const LoginPage = lazy(() => import('src/pages/admin/login'));
export const Page404 = lazy(() => import('src/pages/admin/page-not-found'));

// Exported component
export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout userRole="admin">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <IndexPage />, index: true },
        { path: 'brand', element: <BrandPage /> },
        { path: 'agency', element: <UserPage /> },
        { path: 'password', element: <Password /> },
        { path: 'clientinfo', element: <ClientDetails /> },
        { path: 'logs', element: <Logs /> },
        { path: 'subscription', element: <Subscriptionindex /> },
        { path: 'mediaform', element: <MediaAccountForm /> },
        { path: 'profile', element: <AdminProfilePage /> },
        { path: 'vault', element: <VaultTable /> }
      ],
    },
    {
      path: 'superadmin',
      element: (
        <DashboardLayout userRole="superadmin">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'payment', element: <PaymentSettings /> },
        { path: 'admins', element: <TotalAdmins /> },
        { path: 'members', element: <Members /> },
        { path: 'media-account', element: <Media /> },
      ],
    },
    {
      path: 'user',
      element: (
        <DashboardLayout userRole="user">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <Passwords />, index: true },
        { path: 'userprofile', element: <UserProfilePage /> }
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterView />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'forgot',
      element: <ForgotPassword />
    },
    {
      path: '/',
      element: <LandingPage/>
    },
    {
      path: 'forgot',
      element: <ForgotPasswordView/>
    },
    {
      path: 'reset',
      element:<ResetPasswordView/>
    }
  ]);

  return routes;
}
