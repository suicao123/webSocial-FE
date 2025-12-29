import { IoIosLogOut } from "react-icons/io"
import { useAuth } from "../../context/useAuth"
import type { typeUser } from "../../types/user";

function HeaderAdmin(
    {
        user
    } :
    {
        user: typeUser | undefined
    }
) {

    const { logout } = useAuth()

    function handleLogout(){
        logout();
    }

    return (
        <div id="header-admin">
            <div className="header-main-content">
                <div className="left">
                    <div className="info-admin">
                        <img src={user?.avatar_url} />
                        <div className="content">
                            <p>{user?.display_name}</p>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </div>
                <div 
                    className="right"
                    onClick={ handleLogout }
                >
                    <IoIosLogOut />
                    <p>Đăng xuất</p>
                </div>
            </div>
        </div>
    )
}

export default HeaderAdmin
