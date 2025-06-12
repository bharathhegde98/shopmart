import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext(null);

// Create a custom hook for easy access to the context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check localStorage for a logged-in user when the app first loads
    useEffect(() => {
        const storedUser = localStorage.getItem("shopmartUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        // We expect userData to be an object like { id, firstName, email }
        localStorage.setItem("shopmartUser", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("shopmartUser");
        setUser(null);
    };

    // The value provided to consuming components
    const value = {
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
