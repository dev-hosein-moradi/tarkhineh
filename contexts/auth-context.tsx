"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { UserRole, UserType, PermissionType } from "@/types";
import apiClient, { setToken, handleLogout } from "@/lib/axios";
import { toast } from "sonner";
import SecureTokenStorage from "@/lib/secureTokenStorage";

// Enhanced User Info Interface
interface UserInfo {
  id: string;
  mobile?: string;
  mobileNumber?: string;
  role?: UserRole | string;
  type?: UserType | string;
  branchId?: string;
  isActive?: boolean;
  permissions?: Array<{
    permission: PermissionType;
    branchId?: string;
  }>;
  iat: number;
  exp: number;
  userInfo?: {
    role: string;
    type: string;
    branchId?: string;
    branch?: any;
    permissions: any[];
  };
}

// Auth Context Interface
interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (mobile: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  checkAuth: () => void;
  hasPermission: (permission: PermissionType, branchId?: string) => boolean;
  isRole: (role: UserRole) => boolean;
  isType: (type: UserType) => boolean;
  canAccessBranch: (branchId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT
const decodeJWT = (token: string): UserInfo | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const paddedPayload = payload + "===".slice((payload.length + 3) % 4);
    const base64 = paddedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Helper to check if token is expired
const isTokenExpired = (userInfo: UserInfo): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  return userInfo.exp < currentTime;
};

// Helper function to get token from cookies as fallback
const getTokenFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "authToken" || name === "accessToken") {
        return decodeURIComponent(value);
      }
    }
    return null;
  } catch (error) {
    console.error("Failed to get token from cookie:", error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Check authentication status
  const checkAuth = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      if (!SecureTokenStorage.validateEnvironment()) {
        setUser(null);
        setTokenState(null);
        setInitialized(true);
        return;
      }

      let storedToken = SecureTokenStorage.getToken();
      let storedUserInfo = SecureTokenStorage.getUserInfo();

      // If no token in localStorage, check cookies (fallback)
      if (!storedToken) {
        storedToken = getTokenFromCookie();
        if (storedToken) {
          const decodedUser = decodeJWT(storedToken);
          if (decodedUser) {
            const flattenedUser = {
              ...decodedUser,
              role: decodedUser.userInfo?.role || decodedUser.role,
              type: decodedUser.userInfo?.type || decodedUser.type,
              mobileNumber: decodedUser.mobile || decodedUser.mobileNumber,
            };

            SecureTokenStorage.setToken(storedToken, flattenedUser);
            storedUserInfo = flattenedUser;
          }
        }
      } else {
        // If user was stored before flattening, flatten it now
        if (storedUserInfo && storedUserInfo.userInfo && !storedUserInfo.role) {
          const flattenedUser = {
            ...storedUserInfo,
            role: storedUserInfo.userInfo?.role || storedUserInfo.role,
            type: storedUserInfo.userInfo?.type || storedUserInfo.type,
            mobileNumber: storedUserInfo.mobile || storedUserInfo.mobileNumber,
          };

          SecureTokenStorage.setToken(storedToken, flattenedUser);
          storedUserInfo = flattenedUser;
        }
      }

      if (storedToken && storedUserInfo) {
        if (isTokenExpired(storedUserInfo)) {
          SecureTokenStorage.clearAll();
          handleLogout();
          setUser(null);
          setTokenState(null);
        } else {
          setToken(storedToken);
          setUser(storedUserInfo);
          setTokenState(storedToken);
        }
      } else {
        setUser(null);
        setTokenState(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      SecureTokenStorage.clearAll();
      setUser(null);
      setTokenState(null);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Login function
  const login = async (mobile: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/login", {
        mobile,
        password,
      });

      if (response.data.ok) {
        const { token: newToken, userInfo } = response.data.data;

        const decodedUser = decodeJWT(newToken);
        if (!decodedUser) {
          throw new Error("Invalid token received");
        }

        const flattenedUser = {
          ...decodedUser,
          role: decodedUser.userInfo?.role || decodedUser.role,
          type: decodedUser.userInfo?.type || decodedUser.type,
          mobileNumber: decodedUser.mobile || decodedUser.mobileNumber,
          isActive: true,
        };

        setToken(newToken);
        setTokenState(newToken);
        setUser(flattenedUser);

        SecureTokenStorage.setToken(newToken, flattenedUser);

        setTimeout(() => {
          toast.success("با موفقیت وارد شدید");

          if (typeof window !== "undefined") {
            if (
              flattenedUser.role === "superAdmin" ||
              flattenedUser.role === "admin"
            ) {
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          }
        }, 100);
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "خطا در ورود";

      setTimeout(() => {
        toast.error(errorMessage);
      }, 100);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: any): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/register", userData);

      if (response.data.ok) {
        const { token: newToken } = response.data.data;

        const decodedUser = decodeJWT(newToken);
        if (!decodedUser) {
          throw new Error("Invalid token received");
        }

        setToken(newToken);
        setTokenState(newToken);
        setUser(decodedUser);

        SecureTokenStorage.setToken(newToken, decodedUser);

        setTimeout(() => {
          toast.success("ثبت نام با موفقیت انجام شد");
        }, 100);
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.message || "خطا در ثبت نام";

      setTimeout(() => {
        toast.error(errorMessage);
      }, 100);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await apiClient.post("/api/logout");

      SecureTokenStorage.clearAll();
      setUser(null);
      setTokenState(null);
      setToken(null);

      setTimeout(() => {
        toast.success("با موفقیت خارج شدید");
      }, 100);

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);

      SecureTokenStorage.clearAll();
      setUser(null);
      setTokenState(null);
      setToken(null);

      setTimeout(() => {
        toast.success("خارج شدید");
      }, 100);

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  // Permission checking functions
  const hasPermission = useCallback(
    (permission: PermissionType, branchId?: string): boolean => {
      if (!user) return false;

      if (user.role === "superAdmin" || user.role === UserRole.superAdmin)
        return true;

      const userPermissions = user.permissions || [];

      if (branchId) {
        return userPermissions.some(
          (p) => p.permission === permission && p.branchId === branchId
        );
      } else {
        return userPermissions.some(
          (p) => p.permission === permission && !p.branchId
        );
      }
    },
    [user]
  );

  const isRole = useCallback(
    (role: UserRole | string): boolean => {
      return user?.role === role || user?.role === role.toString();
    },
    [user]
  );

  const isType = useCallback(
    (type: UserType | string): boolean => {
      return user?.type === type || user?.type === type.toString();
    },
    [user]
  );

  const canAccessBranch = useCallback(
    (branchId: string): boolean => {
      if (!user) return false;

      if (user.role === "superAdmin" || user.role === UserRole.superAdmin)
        return true;

      if (user.role === "admin" || user.role === UserRole.admin) return true;

      if (
        user.role === "branchManager" ||
        user.role === UserRole.branchManager
      ) {
        return user.branchId === branchId;
      }

      if (user.role === "staff" || user.role === UserRole.staff) {
        return user.branchId === branchId;
      }

      return false;
    },
    [user]
  );

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    initialized,
    login,
    logout,
    register,
    checkAuth,
    hasPermission,
    isRole,
    isType,
    canAccessBranch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
