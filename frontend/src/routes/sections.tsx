import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from '@/theme/styles';
import { AuthLayout } from '@/layouts/auth';
import { DashboardLayout } from '@/layouts/dashboard';
import PrivatePage from './privateRouter';
import AnnouncementPortal from '@/pages/admin/AnnouncementPortal';
import Profile from '@/pages/Profile'
import Apply from '@/pages/Apply';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('@/pages/home'));
export const BlogPage = lazy(() => import('@/pages/blog'));
export const UserPage = lazy(() => import('@/pages/user'));
export const SignInPage = lazy(() => import('@/pages/sign-in'));
export const ProductsPage = lazy(() => import('@/pages/products'));
export const Users = lazy(() => import('@/pages/admin/RegisterRequest'));
export const GrantRequest = lazy(() => import('@/pages/GrantRequest'));
export const Page404 = lazy(() => import('@/pages/page-not-found'));
export const Register = lazy(() => import("@/pages/auth/register"));
export const Login = lazy(() => import('@/pages/auth/login'));
// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <PrivatePage component={HomePage} />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'profile', element: <PrivatePage component={Profile} />},
        { path: 'users', element: <PrivatePage requiredRole={['grant_dir', 'col_dean']} component={Users}/>},
        { path: 'grant-request', element: <PrivatePage component={GrantRequest}/>},
        { path: 'announcement-portal', element: <PrivatePage requiredRole={['grant_dir']} component={AnnouncementPortal}/>},
        { path: 'apply/:id', element: <PrivatePage component={Apply}/>}
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      )
    },
    {
      path: "/register",
      element: (
        <AuthLayout>
          <Register />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
