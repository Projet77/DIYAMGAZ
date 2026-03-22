import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                // Decode JWT payload (without verification, just to get user data on client side)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ id: payload.id, role: payload.role });
            } catch (e) {
                console.error('Invalid token format');
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (userData, jwtToken) => {
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    // A simple abstraction for authenticated fetch requests
    const authFetch = async (url, options = {}) => {
        const headers = { ...options.headers };

        // Do not force JSON content-type if we are sending FormData (for file uploads)
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = headers['Content-Type'] || 'application/json';
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            logout(); // Auto logout if token expires
            window.location.href = '/login';
        }
        return response;
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, authFetch, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
