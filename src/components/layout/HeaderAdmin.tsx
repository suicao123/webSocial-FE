import { IoIosLogOut } from "react-icons/io"
import { useAuth } from "../../context/useAuth"

function HeaderAdmin() {

    const { logout } = useAuth()

    function handleLogout(){
        logout();
    }

    return (
        <div id="header-admin">
            <div className="header-main-content">
                <div className="left">
                    <div className="info-admin">
                        <img src="https://res.cloudinary.com/dd0yqxowo/image/upload/v1761823049/user-default_jxnvbw.jpg" />
                        <div className="content">
                            <p>admin_name</p>
                            <p>email</p>
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
