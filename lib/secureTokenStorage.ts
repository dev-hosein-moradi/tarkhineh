// lib/secureTokenStorage.ts
class SecureTokenStorage {
    private static readonly ACCESS_TOKEN_KEY = 'accessToken';
    private static readonly USER_INFO_KEY = 'userInfo';

    // Store with additional security checks
    static setToken(token: string, userInfo: any): void {
        if (typeof window === 'undefined') return;

        try {
            // Add timestamp for additional validation
            const tokenData = {
                token,
                timestamp: Date.now(),
                userAgent: navigator.userAgent.slice(0, 50), // Partial fingerprint
            };

            localStorage.setItem(this.ACCESS_TOKEN_KEY, JSON.stringify(tokenData));
            localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    }

    // Get with validation - FIXED to handle both formats
    static getToken(): string | null {
        if (typeof window === 'undefined') return null;

        try {
            const storedData = localStorage.getItem(this.ACCESS_TOKEN_KEY);
            if (!storedData) return null;

            // Try to parse as JSON first (new format)
            try {
                const tokenData = JSON.parse(storedData);

                // Check if it's our enhanced format
                if (tokenData && typeof tokenData === 'object' && tokenData.token) {
                    // Basic tampering check
                    if (!tokenData.timestamp) {
                        this.clearAll();
                        return null;
                    }

                    // Check if stored too long ago (additional security)
                    const daysSinceStored = (Date.now() - tokenData.timestamp) / (1000 * 60 * 60 * 24);
                    if (daysSinceStored > 7) { // Auto-clear after 7 days
                        this.clearAll();
                        return null;
                    }

                    return tokenData.token;
                }
            } catch (parseError) {
                // If JSON.parse fails, it might be a raw token string
                console.log('Stored data is not JSON, treating as raw token');
            }

            // Check if it's a raw JWT token (starts with 'eyJ')
            if (storedData.startsWith('eyJ')) {
                console.log('Found raw JWT token, migrating to new format');

                // Migrate to new format
                try {
                    // Decode the token to get user info
                    const payload = JSON.parse(atob(storedData.split('.')[1]));

                    // Store in new format
                    this.setToken(storedData, payload);

                    return storedData;
                } catch (error) {
                    console.error('Failed to migrate token:', error);
                    this.clearAll();
                    return null;
                }
            }

            // If we get here, the stored data is invalid
            this.clearAll();
            return null;

        } catch (error) {
            console.error('Failed to retrieve token:', error);
            this.clearAll();
            return null;
        }
    }

    static getUserInfo(): any | null {
        if (typeof window === 'undefined') return null;

        try {
            const userInfo = localStorage.getItem(this.USER_INFO_KEY);
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Failed to retrieve user info:', error);
            this.clearAll();
            return null;
        }
    }

    static clearAll(): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(this.ACCESS_TOKEN_KEY);
            localStorage.removeItem(this.USER_INFO_KEY);
        } catch (error) {
            console.error('Failed to clear storage:', error);
        }
    }

    // Additional security: Clear on suspicious activity
    static validateEnvironment(): boolean {
        if (typeof window === 'undefined') return false;

        // Basic environment checks
        try {
            // Check if localStorage is actually working
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }
}

export default SecureTokenStorage;