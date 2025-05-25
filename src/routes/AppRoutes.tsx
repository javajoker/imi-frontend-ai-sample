import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/atoms/LoadingSpinner";
import Layout from "../components/templates/Layout";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Lazy load components for code splitting
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage")
);
const BrowseIPPage = lazy(() => import("../pages/ip/BrowseIPPage"));
const IPDetailPage = lazy(() => import("../pages/ip/IPDetailPage"));
const MarketplacePage = lazy(
  () => import("../pages/marketplace/MarketplacePage")
);
const ProductDetailPage = lazy(
  () => import("../pages/marketplace/ProductDetailPage")
);
const CreateContentPage = lazy(
  () => import("../pages/create/CreateContentPage")
);
const VerificationPage = lazy(
  () => import("../pages/verification/VerificationPage")
);
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("../pages/checkout/CheckoutPage"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* Authentication routes - only accessible when not logged in */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* IP browsing routes */}
        <Route path="browse-ip" element={<BrowseIPPage />} />
        <Route path="ip/:id" element={<IPDetailPage />} />

        {/* Marketplace routes */}
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />

        {/* Verification route */}
        <Route path="verify" element={<VerificationPage />} />
        <Route path="verify/:code" element={<VerificationPage />} />

        {/* Protected routes - require authentication */}
        <Route
          path="create"
          element={
            <PrivateRoute>
              <CreateContentPage />
            </PrivateRoute>
          }
        />

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route
          path="checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Admin routes - require admin privileges */}
        <Route
          path="admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Catch all route - 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
