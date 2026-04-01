import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ForgotUsernamePage from './pages/ForgotUsernamePage';
import CustomerDashboard from './pages/CustomerDashboard';
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import BookingPage from './pages/BookingPage';

// Public routes (no auth required)
export const publicRoutes = [
  { path: '/', element: LandingPage },
  { path: '/login', element: LoginPage },
  { path: '/register', element: RegisterPage },
  { path: '/forgot-password', element: ForgotPasswordPage },
  { path: '/forgot-username', element: ForgotUsernamePage },
];

// Role-based protected routes
// CUSTOMER routes
export const customerRoutes = [
  { path: '/home', element: CustomerDashboard, allowedRoles: ['customer'] },
  { path: '/shop/:shopId', element: BookingPage, allowedRoles: ['customer'] },
];

// SHOP_OWNER routes
export const shopOwnerRoutes = [
  { path: '/shop-owner', element: ShopOwnerDashboard, allowedRoles: ['owner'] },
  { path: '/shop/:shopId', element: BookingPage, allowedRoles: ['owner'] },
];

// Combined protected routes for App.jsx to use
export const allProtectedRoutes = [...customerRoutes, ...shopOwnerRoutes];
