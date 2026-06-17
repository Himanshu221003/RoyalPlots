import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import API_URL from '../config/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'user';
const TOKEN_KEY = 'royalplotsToken';

/**
 * Clean professional icons for the profile system
 */
const ICONS = {
    male: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    female: 'https://cdn-icons-png.flaticon.com/512/3135/3135823.png',
    neutral: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
};

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    // PERSIST SESSION: Fetch user data from backend on mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const res = await fetch(`${API_URL}/api/users/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    } else {
                        // Token might be invalid or expired
                        logout();
                    }
                } catch (err) {
                    console.error('Failed to fetch user data:', err);
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, [token]);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
    }, []);

    const login = useCallback((newToken, newUser) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }, []);

    const saveProfile = useCallback(async (updatedFields) => {
        try {
            const res = await fetch(`${API_URL}/api/users/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedFields)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setUser(data.user);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
                return data.user;
            } else {
                throw new Error(data.message || 'Profile update failed');
            }
        } catch (err) {
            console.error('Profile update failed:', err);
            throw err;
        }
    }, [token]);

    const toggleFavorite = useCallback(async (propertyId) => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/users/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ propertyId })
            });
            if (res.ok) {
                const data = await res.json();
                const updatedUser = { ...user, favorites: data.favorites };
                setUser(updatedUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
        }
    }, [token, user]);

    // Derived Profile Image - THE SINGLE SOURCE OF TRUTH FOR AVATARS
    const profileImage = useMemo(() => {
        if (!user) return ICONS.neutral;
        
        // 1. Custom profile image (if provided and not empty)
        if (user.profileImage && typeof user.profileImage === 'string' && user.profileImage.trim() !== '') {
            return user.profileImage;
        }

        // 2. Gender-based icon
        const g = (user.gender || '').toLowerCase().trim();
        if (g === 'female') return ICONS.female;
        if (g === 'male') return ICONS.male;

        // 3. Fallback to neutral
        return ICONS.neutral;
    }, [user]);

    const isAuthenticated = !!token && !!user;

    const authFetch = useCallback(async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const res = await fetch(url, { ...options, headers });
        if (res.status === 401) logout();
        return res;
    }, [token, logout]);

    const value = {
        token,
        user,
        setUser,
        loading,
        profileImage,
        isAuthenticated,
        login,
        logout,
        saveProfile,
        authFetch,
        toggleFavorite
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}
