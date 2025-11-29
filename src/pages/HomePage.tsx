
import Auth from "../features/auth/components/Auth"
import Home from "../features/home/components/Home";
import { useAuth } from "../context/useAuth";
import AdminPage from "./AdminPage";

function HomePage() {

    const { role, isAuthenticated, isLoading } = useAuth();
    console.log(isAuthenticated);
    
    if (isLoading) {
        return <div className="loading-screen">Đang tải...</div>; 
    }

    return (
        <>
            {
                isAuthenticated ?
                role == 1 ? <Home /> : <AdminPage /> :
                <Auth />
            }
        </>
    )
}

export default HomePage
