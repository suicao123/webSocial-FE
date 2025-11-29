
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth(); 

    // 1. Nếu đang check token thì hiện loading
    if (isLoading) {
        return <div>Loading...</div>; 
    }

    // 2. Nếu chưa đăng nhập -> Đá về trang chủ ('/') nơi chứa Form Login
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // 3. Nếu đã đăng nhập -> Cho phép đi tiếp vào các route con (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;