import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci"
import { FaEdit, FaEye } from "react-icons/fa"
import type { typeListAccout, typeUser, typeViewListData } from "../../../types/user";
import AdminDetail from "./AdminDetail";
import { useAuth } from "../../../context/useAuth";
import EditProfile from "../../profile/components/EditProfile";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function AdminList() {

    const [admins, setAdmins] = useState<typeViewListData[] | undefined>([]);
    const [admin, setAdmin] = useState<typeViewListData | undefined>();
    const [dataUser, setUser] = useState<typeUser | undefined>();
    const [search, setSearch] = useState<string>('');
    const [isEdit, setEdit] = useState<boolean>(false);
    const { user } = useAuth();
    const [isWatch, setWatching] = useState<boolean>(false);
    
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/getAdminsList?search=${search}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const result = await response.json();

                if (response.ok) {

                    const myAdmin = result.filter((u: typeListAccout) => u.user_id == user?.user_id);

                    const otherAdmin = result.filter((u: typeListAccout) => u.user_id != user?.user_id);

                    const arrangeList = [...myAdmin, ...otherAdmin];

                    const mappedUsers = arrangeList.map((u: typeListAccout) => ({
                        id: u.user_id,
                        name: u.display_name??'',
                        email: u.email??'',
                        avatar: u.avatar_url??'',
                        posts: u.post_count,
                        friends: u.friend_count,
                        joinDate: new Date(u.created_at).toLocaleDateString('vi-VN')
                    }));
                    
                    setAdmins(mappedUsers);
                }
                else {
                    alert("Lỗi lấy người dùng");
                }
            } catch (error) {
                console.error("Lỗi tải user:", error);
            }
        }

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users?user_id=${user?.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                
                    const result = await response.json();
                    
                    setUser(result);
                }
                else {
                    alert("Lỗi lấy người dùng hien tai");
                }
            } catch (error) {
                console.error("Lỗi tải user:", error);
            }
        }

        fetchUsers();
        fetchUser();
    }, [refreshKey, search]);

    function handleWatching(admin: typeViewListData) {
        setAdmin(admin);
        setWatching(prev => !prev);
    }

    return (
        <div className="admin-list">
            {
                isEdit ? 
                <EditProfile
                    setEdit = {setEdit}
                    dataUser = {dataUser}
                    setRefreshKey = {setRefreshKey}
                /> :
                ''
            }
            {
                isWatch ? 
                <AdminDetail 
                    admin ={admin}
                    setWatching = {setWatching}
                /> :
                ''
            }
            <p className="title">
                Tài khoản admin
            </p>
            <div className="admin-list-input">
                <CiSearch
                    className="icon"
                />
                <input 
                    type="text"     
                    value={search??''}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm admin"
                />
            </div>
            <div className="admin-list-table"> 
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '35%' }}>Quản trị viên</th>
                            <th style={{ width: '35%' }}>Email</th>
                            <th style={{ width: '20%' }}>Ngày tạo tài khoản</th>
                            <th style={{ width: '10%', textAlign: 'center' }}>Hoạt động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins?.map((admin) => (
                            <tr key={admin.id}>
                                <td className="user-cell">
                                    <img src={admin.avatar} alt="avatar" />
                                    <span className="user-name">{admin.name}</span>
                                </td>

                                <td className="email-cell">{admin.email}</td>

                                <td className="date-cell">{admin.joinDate}</td>

                                <td>
                                    <div className="action-cell">

                                        {
                                            admin.id == user?.user_id ? 
                                            <button 
                                                className="btn-icon edit" 
                                                title="Chỉnh sửa"
                                                onClick={ () => setEdit(prev => !prev) }
                                            >
                                                <FaEdit />
                                            </button> : 
                                            ''
                                        }

                                        <button 
                                            className="btn-icon" 
                                            title="Xem chi tiết"
                                            style={{ color: '#00B4D8' }}
                                            onClick={ () => handleWatching(admin) }
                                        >
                                            <FaEye />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminList
