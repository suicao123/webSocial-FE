// src/context/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "./AuthContext"; // Import Context từ file gốc

export const useAuth = () => {

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;

};