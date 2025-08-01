import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Create axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Enable cookies for refresh token
    timeout: 10000,
});

// Token management
let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

// Get token from localStorage
const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

// Set token in localStorage and axios header
const setToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        localStorage.setItem('accessToken', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('accessToken');
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// Initialize token from storage
if (typeof window !== 'undefined') {
    const storedToken = getStoredToken();
    if (storedToken) {
        setToken(storedToken);
    }
}

// Process failed queue
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor - Add auth header
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = accessToken || getStoredToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Check for token refresh headers
        if (response.headers['x-token-refreshed'] === 'true') {
            const newToken = response.headers['x-new-token'];
            if (newToken) {
                console.log('Token refreshed automatically');
                setToken(newToken);

                // Update user info in localStorage if exists
                try {
                    const userInfo = localStorage.getItem('userInfo');
                    if (userInfo) {
                        // Decode new token and update user info
                        const payload = JSON.parse(atob(newToken.split('.')[1]));
                        localStorage.setItem('userInfo', JSON.stringify(payload));
                    }
                } catch (error) {
                    console.error('Error updating user info after token refresh:', error);
                }
            }
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Handle different error scenarios
        if (error.response?.status === 401) {
            const errorCode = (error.response.data as any)?.code;

            // Token expired - attempt refresh
            if (errorCode === 'TOKEN_EXPIRED' && !originalRequest._retry) {
                if (isRefreshing) {
                    // If already refreshing, queue the request
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(() => {
                        return apiClient(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    // Backend should automatically refresh via cookie
                    // Retry the original request
                    const response = await apiClient(originalRequest);
                    processQueue(null);
                    return response;
                } catch (refreshError) {
                    processQueue(refreshError);

                    // Check if refresh failed
                    const refreshErrorCode = (refreshError as AxiosError)?.response?.data as any;
                    if (refreshErrorCode?.code === 'REFRESH_FAILED') {
                        // Refresh token expired, redirect to login
                        handleLogout();
                        toast.error('جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.');
                    }

                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Refresh failed or other auth errors
            if (errorCode === 'REFRESH_FAILED' || errorCode === 'invalid_token') {
                handleLogout();
                toast.error('جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.');
                return Promise.reject(error);
            }

            // Token missing
            if (errorCode === 'token_missing') {
                // Don't show error for public endpoints
                if (!originalRequest.url?.includes('/admin/')) {
                    return Promise.reject(error);
                }
                handleLogout();
                return Promise.reject(error);
            }
        }

        // Handle other errors
        if (error.response?.status === 403) {
            toast.error('شما دسترسی به این بخش را ندارید.');
        } else if (error.response && error.response.status >= 500) {
            toast.error('خطای سرور. لطفاً بعداً تلاش کنید.');
        } else if (!error.response) {
            toast.error('خطای اتصال. اتصال اینترنت خود را بررسی کنید.');
        }

        return Promise.reject(error);
    }
);

// Handle logout
const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');

    // Redirect to home page since you use modal login
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.href = '/';
    }
};

// Export functions for external use
export { setToken, handleLogout };
export default apiClient;