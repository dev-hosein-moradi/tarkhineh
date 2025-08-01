"use client";
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { UserRole, UserType, PermissionType } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AccessDenied from "@/components/auth/access-denied";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: UserRole | UserRole[];
  requireType?: UserType | UserType[];
  requirePermission?: PermissionType;
  requireBranchId?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireRole,
  requireType,
  requirePermission,
  requireBranchId,
  fallback,
  redirectTo = "/auth/login",
}) => {
  const {
    isAuthenticated,
    user,
    loading,
    initialized,
    hasPermission,
    isRole,
    isType,
    canAccessBranch,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [initialized, requireAuth, isAuthenticated, router, redirectTo]);

  // Show loading while checking auth or during operations
  if (!initialized || loading) {
    return fallback || <LoadingSpinner />;
  }

  // Redirect to login if auth required but not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Check role requirements
  if (requireRole && user) {
    const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!roles.some((role) => isRole(role))) {
      return <AccessDenied message="شما دسترسی به این بخش را ندارید" />;
    }
  }

  // Check type requirements
  if (requireType && user) {
    const types = Array.isArray(requireType) ? requireType : [requireType];
    if (!types.some((type) => isType(type))) {
      return (
        <AccessDenied message="نوع حساب کاربری شما دسترسی به این بخش را ندارد" />
      );
    }
  }

  // Check permission requirements
  if (requirePermission && user) {
    if (!hasPermission(requirePermission, requireBranchId)) {
      return (
        <AccessDenied message="شما دسترسی لازم برای مشاهده این بخش را ندارید" />
      );
    }
  }

  // Check branch access requirements
  if (requireBranchId && user) {
    if (!canAccessBranch(requireBranchId)) {
      return <AccessDenied message="شما دسترسی به این شعبه را ندارید" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
