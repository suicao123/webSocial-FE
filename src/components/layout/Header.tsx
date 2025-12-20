import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react"
import { CiChat1, CiSearch } from "react-icons/ci"
import { MdHome } from "react-icons/md"
import { Link, useNavigate } from "react-router"
import type { payload } from "../../types/user";
import { useAuth } from "../../context/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";

function Header(
    {menuId}:
    {menuId: number}
) {

    const [userId, setUserId] = useState<string | undefined>();
    const [menu, setMenu] = useState<boolean>(false);
    const [isActionMenu, setActionMenu] = useState<number>(menuId);
    const navigate = useNavigate();

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

    function handleMenu(path: string, n: number) {
        navigate(`${path}`);
        setActionMenu(n);
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
                <div 
                    className={`icon-main-header-center ${isActionMenu == 1 ? 'show' : ''}`}
                    onClick={ () => handleMenu("/", 1) }
                >
                    <MdHome
                        className="icon"
                    />
                </div>
                <div 
                    className={`icon-main-header-center ${isActionMenu == 2 ? 'show' : ''}`}
                    onClick={ () => handleMenu("/friends", 2) }
                >
                    <FaUserFriends
                        className="icon"
                    />
                </div>
                <div 
                    className={`icon-main-header-center ${isActionMenu == 3 ? 'show' : ''}`}
                    onClick={ () => handleMenu("/chat", 3) }
                >
                    <CiChat1
                        className="icon"
                    />
                </div>
            </div>
            <div className="main-header-right">
                <div 
                    className="chat-main-header-right"
                >
                    <CiChat1
                        className="icon"
                    />
                </div>
                <div 
                    className="avatar-user-header"
                    onMouseEnter={ () => setMenu(true) }
                    onMouseLeave={ () => setMenu(false) }
                ></div>
                
                <div 
                    className="main-header-menu"
                    onMouseEnter={ () => setMenu(true) }
                    onMouseLeave={ () => setMenu(false) }
                    onClick={ handleLogout }
                >
                    <div 
                        className={`item ${menu ? 'show' : ''}`}
                    >
                        <FiLogOut />
                        <p>Đăng xuất</p>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
