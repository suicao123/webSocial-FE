import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"
import { CiChat1, CiSearch } from "react-icons/ci"
import { MdHome } from "react-icons/md"
import { Link } from "react-router"
import type { payload } from "../../types/user";
import { useAuth } from "../../context/useAuth";

function Header() {

    const [userId, setUserId] = useState<string | undefined>();

    const { logout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        let userToken = null;

        if(token) {
            userToken = jwtDecode<payload>(token);
        }
        
        const user_id = userToken?.user_id;

        setUserId(user_id);
        
    }, []);

    function handleLogout() {
        logout();
    }

    return (
        <header id="main-header">
            <div className="main-header-left">
                <div className="avatar-web-header"></div>
                <div className="input-header">
                    <CiSearch 
                        className="icon"
                    />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm"
                    />
                </div>
            </div>
            <div className="main-header-center">
                <div className="icon-main-header-center show">
                    <Link to="/">
                        <MdHome
                            className="icon"
                        />
                    </Link>
                </div>
            </div>
            <div className="main-header-right">
                <div 
                    className="chat-main-header-right"
                    onClick={ handleLogout }
                >
                    <CiChat1
                        className="icon"
                    />
                </div>
                <Link to={`/profile/${userId}`}>
                    <div className="avatar-user-header"></div>
                </Link>
            </div>
        </header>
    )
}

export default Header
