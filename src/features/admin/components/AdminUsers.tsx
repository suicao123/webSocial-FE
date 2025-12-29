import { useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"
import { FaEdit, FaTrash, FaUserFriends } from "react-icons/fa"
import { GrDocumentText } from "react-icons/gr"
import type { typeUser } from "../../../types/user";
import EditProfile from "../../profile/components/EditProfile";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function AdminUsers() {

    const [users, setUsers] = useState<any[]>([]);
    const [dataUser, setUser] = useState<typeUser>();
    const [isEdit, setEdit] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/getUsersList?search=${search}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                
                const result = await response.json();

                if (response.ok) {
                    const mappedUsers = result.map((u: any) => ({
                        id: u.user_id,
                        name: u.display_name,
                        email: u.email,
                        avatar: u.avatar_url,
                        posts: u.post_count,
                        friends: u.friend_count,
                        joinDate: new Date(u.created_at).toLocaleDateString('vi-VN')
                    }));
                    
                    setUsers(mappedUsers);
                }
                else {
                    alert("Lỗi lấy người dùng");
                }
            } catch (error) {
                console.error("Lỗi tải user:", error);
            }
        }

        fetchUsers();
    }, [refreshKey, search]);

    function handleEdit(user: any) {
        const userForEdit: typeUser = {
            user_id: user.id,  
            display_name: user.name, 
            email: user.email,   
            avatar_url: user.avatar,  
            username: user.username, 
            bio: user.bio
        };

        setUser(userForEdit);
        setEdit(true);
    }

    async function handleDelete(userId: number) {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác!")) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/deleteUser/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Xóa thành công!");
                setRefreshKey(prev => prev + 1);
            } else {
                const data = await response.json();
                alert(data.message || "Lỗi khi xóa");
            }
        } catch (error) {
            console.error("Lỗi xóa:", error);
            alert("Lỗi server");
        }
    }

    return (
        <div className="admin-users">
            {
                isEdit ? 
                <EditProfile 
                    setEdit = {setEdit}
                    dataUser = {dataUser}
                    setRefreshKey = {setRefreshKey}
                /> :
                ''
            }
            <p className="title">
                Quản lý tài khoản
            </p>
            <div className="admin-posts-input">
                <CiSearch
                    className="icon"
                />
                <input 
                    type="text"     
                    value={search??''}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm người dùng"
                />
            </div>
            <div className="admin-users-table">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Người dùng</th>
                            <th style={{ width: '25%' }}>Email</th>
                            <th style={{ width: '10%' }}>Bài viết</th>
                            <th style={{ width: '10%' }}>Bạn bè</th>
                            <th style={{ width: '15%' }}>Ngày tham gia</th>
                            <th style={{ width: '10%', textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user: any) => (
                            <tr>
                                <td className="user-cell">
                                    <img src={user.avatar} alt="avatar" />
                                    <span className="user-name">{user.name}</span>
                                </td>

                                <td className="email-cell">{user.email}</td>

                                <td className="stats-cell">
                                    <GrDocumentText /> {user.posts}
                                </td>

                                <td className="stats-cell">
                                    <FaUserFriends /> {user.friends}
                                </td>

                                <td className="date-cell">{user.joinDate}</td>

                                <td>
                                    <div className="action-cell">
                                        <button 
                                            className="btn-icon edit" 
                                            title="Sửa thông tin"
                                            onClick={ () => handleEdit(user) }
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="btn-icon delete" 
                                            title="Xóa người dùng"
                                            onClick={ () => handleDelete(user.id) }
                                        >
                                            <FaTrash />
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

export default AdminUsers
