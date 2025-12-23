import { GrDocumentText } from "react-icons/gr"
import HeaderAdmin from "../components/layout/HeaderAdmin"
import { HiUsers } from "react-icons/hi"
import { IoShieldOutline } from "react-icons/io5"
import { MdPersonAddAlt1 } from "react-icons/md"
import { useState } from "react"
import AdminPosts from "../features/admin/components/AdminPosts"

function AdminPage() {

    const [menu, setMenu] = useState<number>(1);

    return (
        <div id="admin-main-layout">
            <HeaderAdmin />

            <div className="admin-parameter">
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng bài viết</p>
                        <p className="parameter">1,300</p>
                        <p className="increase">+12% so với tháng trước</p>
                    </div>
                    <div className="item-icon">
                        <GrDocumentText 
                            className="icon"
                        />
                    </div>
                </div>
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng người dùng</p>
                        <p className="parameter">1,300</p>
                        <p className="increase">+12% so với tháng trước</p>
                    </div>
                    <div className="item-icon">
                        <HiUsers
                            className="icon"
                        />
                    </div>
                </div>
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng bài viết</p>
                        <p className="parameter">1,300</p>
                        <p className="increase">+12% so với tháng trước</p>
                    </div>
                    <div className="item-icon">
                        <IoShieldOutline
                            className="icon"
                        />
                    </div>
                </div>
            </div>

            <div className="admin-menu">
                <div 
                    className={`item ${menu == 1 ? 'show' : ''}`}
                    onClick={ () => setMenu(1) }
                >
                    <GrDocumentText 
                        className="icon"
                    />
                    <p>Bài viết</p>
                </div>
                <div 
                    className={`item ${menu == 2 ? 'show' : ''}`}
                    onClick={ () => setMenu(2) }
                >
                    <HiUsers 
                        className="icon"
                    />
                    <p>Người dùng</p>
                </div>
                <div 
                    className={`item ${menu == 3 ? 'show' : ''}`}
                    onClick={ () => setMenu(3) }
                >
                    <IoShieldOutline 
                        className="icon"
                    />
                    <p>Admin</p>
                </div>
                <div 
                    className={`item ${menu == 4 ? 'show' : ''}`}
                    onClick={ () => setMenu(4) }
                >
                    <MdPersonAddAlt1
                        className="icon"
                    />
                    <p>Thêm Admin</p>
                </div>
            </div>

            <div className="admin-menu-container">
                <AdminPosts />
            </div>
        </div>
    )
}

export default AdminPage
