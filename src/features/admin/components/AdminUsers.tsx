import { useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"
import { FaCircle, FaEdit, FaLock, FaUnlock, FaUserFriends } from "react-icons/fa"
import { GrDocumentText } from "react-icons/gr"
import type { typeUser } from "../../../types/user";
import EditProfile from "../../profile/components/EditProfile";
import AdminLockModal from "./AdminLockModal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import ToastMessage from "../../../components/common/ToastMessage";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function AdminUsers() {

    const [users, setUsers] = useState<any[]>([]);
    const [dataUser, setUser] = useState<typeUser>();
    const [isEdit, setEdit] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    const [isLockModalOpen, setLockModalOpen] = useState<boolean>(false);
    const [userToLock, setUserToLock] = useState<number | null>(null);

    const [toast, setToast] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        actionType: null as 'unlock' | null,
        userId: 0 as number,
        title: '',
        message: '',
        confirmText: '',
        variant: 'primary' as 'primary' | 'danger'
    });
    
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
                        status: u.status,
                        bio: u.bio,
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

    // async function handleDelete(userId: number) {
    //     if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác!")) {
    //         return;
    //     }

    //     try {
    //         const token = localStorage.getItem('authToken');
    //         const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/deleteUser/${userId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (response.ok) {
    //             alert("Xóa thành công!");
    //             setRefreshKey(prev => prev + 1);
    //         } else {
    //             const data = await response.json();
    //             alert(data.message || "Lỗi khi xóa");
    //         }
    //     } catch (error) {
    //         console.error("Lỗi xóa:", error);
    //         alert("Lỗi server");
    //     }
    // }

    function openLockModal(userId: number) {
        setUserToLock(userId);
        setLockModalOpen(true);
    }

    const requestUnlock = (userId: number) => {
        setConfirmConfig({
            isOpen: true,
            actionType: 'unlock',
            userId: userId,
            title: 'Mở khóa tài khoản',
            message: 'Bạn có chắc chắn muốn mở khóa cho người dùng này không?',
            confirmText: 'Mở khóa',
            variant: 'primary'
        });
    };

    async function handleUnlockUser(userId: number) {

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/unLockUser/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if(response.ok) {
                const rs = await response.json();

                setToast({ isOpen: true, message: rs.message || "Đã mở khóa thành công!", type: 'success' });
                // alert(rs.message)
                setRefreshKey(prev => prev + 1);
            }
            else {
                setToast({ isOpen: true, message: 'Mở khóa thất bại!!!', type: 'error' });
                // alert('Mở khóa thất bại!!!');
            }
        } catch (error) {
            alert("Lỗi server" + error);
        }
    }

    const handleConfirmModal = () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false })); 

        handleUnlockUser(confirmConfig.userId);
    };

    return (
        <div className="admin-users">

            <ToastMessage
                isOpen={toast.isOpen}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, isOpen: false })}
            />

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                variant={confirmConfig.variant}
                onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmModal}
            />
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
                            <th style={{ width: '25%' }}>Người dùng</th>
                            <th style={{ width: '20%' }}>Email</th>
                            <th style={{ width: '15%' }}>Trạng thái</th>
                            <th style={{ width: '10%' }}>Bài viết</th>
                            <th style={{ width: '10%' }}>Bạn bè</th>
                            <th style={{ width: '10%' }}>Ngày tham gia</th>
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

                                <td className="status-cell">
                                    {user.status === 'active' ? (
                                        <div className="status-badge active" style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                            padding: '4px 10px', borderRadius: '20px', 
                                            backgroundColor: '#e6f4ea', color: '#2e7d32', 
                                            fontSize: '13px', fontWeight: 'bold' 
                                        }}>
                                            <FaCircle style={{ fontSize: '8px' }} />
                                            Hoạt động
                                        </div>
                                    ) : (
                                        <div className="status-badge locked" style={{ 
                                            display: 'inline-flex', alignItems: 'center', gap: '6px', 
                                            padding: '4px 10px', borderRadius: '20px', 
                                            backgroundColor: '#fce8e6', color: '#c62828', 
                                            fontSize: '13px', fontWeight: 'bold' 
                                        }}>
                                            <FaLock style={{ fontSize: '10px' }} />
                                            Bị khóa
                                        </div>
                                    )}
                                </td>

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
                                        {/* <button 
                                            className="btn-icon delete" 
                                            title="Xóa người dùng"
                                            onClick={ () => handleDelete(user.id) }
                                        >
                                            <FaTrash />
                                        </button> */}
                                        {
                                            user.status == 'active' ?
                                            <button 
                                                className="btn-icon lock" 
                                                title="Khóa người dùng"
                                                onClick={ () => openLockModal(user.id) }
                                            >
                                                <FaLock />
                                            </button> : 
                                            <button 
                                                className="btn-icon lock" 
                                                title="Khóa người dùng"
                                                onClick={ () => requestUnlock(user.id) }
                                            >
                                                <FaUnlock />
                                            </button>
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminLockModal 
                isOpen= { isLockModalOpen }
                userId={ userToLock }
                onClose={ () => setLockModalOpen(false) }
                onSuccess={ () => setRefreshKey(prev => prev + 1) }
                toast={toast}
                setToast={setToast}
            />
        </div>
    )
}

export default AdminUsers
