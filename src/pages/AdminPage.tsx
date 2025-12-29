import { GrDocumentText } from "react-icons/gr"
import HeaderAdmin from "../components/layout/HeaderAdmin"
import { HiUsers } from "react-icons/hi"
import { IoShieldOutline } from "react-icons/io5"
import { MdPersonAddAlt1 } from "react-icons/md"
import { useEffect, useState } from "react"
import AdminPosts from "../features/admin/components/AdminPosts"
import AdminUsers from "../features/admin/components/AdminUsers"
import AdminList from "../features/admin/components/AdminList"
import SignUpAdmin from "../features/admin/components/SignUpAdmin"
import type { typeUser } from "../types/user"
import { useAuth } from "../context/useAuth"

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function AdminPage() {

    const [menu, setMenu] = useState<number>(1);
    const [admin, setAdmin] = useState<typeUser>();
    const [stats, setStats] = useState({
        posts: { total: 0, increase: 0 },
        users: { total: 0, increase: 0 },
        admins: { total: 0 }
    });

    const { user } = useAuth();

    useEffect(() => {
        const getUser = async () => {
            try {
                // const token = localStorage.getItem('authToken');
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users?user_id=${user?.user_id}`);
                if (!response.ok) {
                    alert("Lay admin khong thanh cong");
                    return;
                }
                else {
                    const data = await response.json();
                    setAdmin(data);
                }
            } catch (error) {
                console.error("Lỗi tải user:", error);
            }
        }

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchStats();
        getUser();
    }, []);

    return (
        <div id="admin-main-layout">
            <HeaderAdmin 
                user={admin}
            />

            <div className="admin-parameter">
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng bài viết</p>
                        <p className="parameter">{stats.posts.total}</p>
                        <p className="increase">+{stats.posts.increase}% so với tháng trước</p>
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
                        <p className="parameter">{stats.users.total}</p>
                        <p className="increase">+{stats.users.increase}% so với tháng trước</p>
                    </div>
                    <div className="item-icon">
                        <HiUsers
                            className="icon"
                        />
                    </div>
                </div>
                <div className="admin-parameter-item">
                    <div className="content">
                        <p className="title">Tổng số admin</p>
                        <p className="parameter">{stats.admins.total}</p>
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
                {
                    menu == 1 ?
                    <AdminPosts /> :
                    ''
                }
                {
                    menu == 2 ?
                    <AdminUsers /> :
                    ''
                }
                {
                    menu == 3 ?
                    <AdminList /> :
                    ''
                }
                {
                    menu == 4 ?
                    <SignUpAdmin /> :
                    ''
                }
            </div>
        </div>
    )
}

export default AdminPage
