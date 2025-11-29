import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";

// 1. Định nghĩa kiểu dữ liệu của Token (Payload từ Node.js gửi về)
interface DecodedToken {
    user_id: number;      // ID người dùng
    username: string;
    display_name: string;
    email: string;
    role: number;         // 0: Admin, 1: User (Dựa theo code Node.js của bạn)
    exp: number;          // Thời gian hết hạn (Unix timestamp)
    iat: number;          // Thời gian tạo
}

// 2. Định nghĩa kiểu dữ liệu cho Context
interface AuthContextType {
    user: DecodedToken | null; // Lưu toàn bộ thông tin user (null là chưa đăng nhập)
    isAuthenticated: boolean;  // true nếu đã đăng nhập
    role: number | null;       // Lấy nhanh role (0 hoặc 1)
    isLoading: boolean;        // Trạng thái tải (để chặn redirect khi F5)
    login: (token: string) => void;
    logout: () => void;
}

// Tạo Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<DecodedToken | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Hàm xử lý lưu user từ token
    const handleUserFromToken = (token: string) => {
        try {
            const decoded = jwtDecode<DecodedToken>(token);

            // Kiểm tra hết hạn
            const currentTime = Date.now() / 1000;
            
            if (decoded.exp < currentTime) {
                logout();
                return;
            }

            setUser(decoded);
        } catch (error) {
            // Nếu token lỗi -> xóa sạch
            logout();
        }
    };

    // useEffect: Chạy 1 lần duy nhất khi F5 trang
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            handleUserFromToken(token);
        }
        setIsLoading(false); // Kết thúc quá trình load dù có token hay không
    }, []);

    // Hàm Login: Gọi khi đăng nhập thành công
    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        handleUserFromToken(token); // Decode ngay lập tức để cập nhật State
    };

    // Hàm Logout
    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    // Tính toán các giá trị derived (dẫn xuất)
    const isAuthenticated = !!user; // Nếu có user object -> true
    const role = user?.role ?? null; // Lấy role từ user object

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, role, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};