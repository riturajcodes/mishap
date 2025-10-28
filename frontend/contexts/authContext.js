"use client";

import { createContext, useState, useMemo, useContext } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [authState, setAuthState] = useState({});

    const updateAuthState = (updatedValue) => {
        setAuthState(updatedValue);
    };

    const contextValue = useMemo(
        () => ({
            authState,
            updateAuthState,
        }),
        [authState]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};

export default AuthContext;