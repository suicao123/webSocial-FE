import { CiChat1, CiSearch } from "react-icons/ci"
import { MdHome } from "react-icons/md"

function Header() {
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
                    <MdHome
                        className="icon"
                    />
                </div>
            </div>
            <div className="main-header-right">
                <div className="chat-main-header-right">
                    <CiChat1
                        className="icon"
                    />
                </div>
                <div className="avatar-user-header"></div>
            </div>
        </header>
    )
}

export default Header
