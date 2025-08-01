import { useAuth } from '@/contexts/auth-context';
import { PermissionType, UserRole } from '@/types';
import { useMemo } from 'react';

export const usePermissions = () => {
    const { user, hasPermission, isRole, isType, canAccessBranch } = useAuth();

    // Memoize permission checks for performance
    const permissions = useMemo(() => {
        if (!user) {
            return {
                canManageUsers: false,
                canViewUsers: false,
                canDeleteUsers: false,
                canManageFoods: false,
                canViewFoods: false,
                canManageBranches: false,
                canViewBranches: false,
                canManageOrders: false,
                canViewOrders: false,
                canManageAccompaniments: false,
                canViewAccompaniments: false,
                canViewReports: false,
                canManageSystemSettings: false,
                isSuperAdmin: false,
                isAdmin: false,
                isBranchManager: false,
                isStaff: false,
                isCustomer: false,
            };
        }

        return {
            // User management permissions
            canManageUsers: hasPermission(PermissionType.MANAGE_USERS) || isRole(UserRole.superAdmin) || isRole(UserRole.admin),
            canViewUsers: hasPermission(PermissionType.VIEW_USERS) || isRole(UserRole.superAdmin) || isRole(UserRole.admin),
            canDeleteUsers: isRole(UserRole.superAdmin), // Only superAdmin can delete users

            // Food management permissions
            canManageFoods: hasPermission(PermissionType.MANAGE_FOODS),
            canViewFoods: hasPermission(PermissionType.VIEW_FOODS),

            // Branch management permissions
            canManageBranches: hasPermission(PermissionType.MANAGE_BRANCHES),
            canViewBranches: hasPermission(PermissionType.VIEW_BRANCHES),
            canManageOwnBranch: hasPermission(PermissionType.MANAGE_OWN_BRANCH),

            // Order management permissions
            canManageOrders: hasPermission(PermissionType.MANAGE_ORDERS),
            canViewOrders: hasPermission(PermissionType.VIEW_ORDERS),
            canManageBranchOrders: hasPermission(PermissionType.MANAGE_BRANCH_ORDERS),

            // Accompaniment permissions
            canManageAccompaniments: hasPermission(PermissionType.MANAGE_ACCOMPANIMENTS),
            canViewAccompaniments: hasPermission(PermissionType.VIEW_ACCOMPANIMENTS),

            // Reports permissions
            canViewReports: hasPermission(PermissionType.VIEW_REPORTS),
            canViewBranchReports: hasPermission(PermissionType.VIEW_BRANCH_REPORTS),

            // System settings
            canManageSystemSettings: hasPermission(PermissionType.MANAGE_SYSTEM_SETTINGS),

            // Role checks
            isSuperAdmin: isRole(UserRole.superAdmin),
            isAdmin: isRole(UserRole.admin),
            isBranchManager: isRole(UserRole.branchManager),
            isStaff: isRole(UserRole.staff),
            isCustomer: isRole(UserRole.customer),
        };
    }, [user, hasPermission, isRole]);

    return {
        ...permissions,
        user,
        hasPermission,
        isRole,
        isType,
        canAccessBranch,
    };
};