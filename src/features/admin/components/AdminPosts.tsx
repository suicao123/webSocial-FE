import { CiSearch } from "react-icons/ci"
import { FaComment, FaEdit, FaEye, FaHeart, FaRegImage, FaTrash } from "react-icons/fa"
import type { typePost } from "../../../types/post";
import { useEffect, useState } from "react";
import HomeComment from "../../home/components/HomeComment";
import type { typeUser } from "../../../types/user";
import { useAuth } from "../../../context/useAuth";
import EditPost from "./EditPost";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function AdminPosts() {

    const [dataPosts, setPosts] = useState<typePost[]>([]);
    const [dataPost, setPost] = useState<typePost>();
    const [dataUser, setUser] = useState<typeUser | undefined>();
    const [isCommenting, setCommenting] = useState<boolean>(false);
    const [isEditing, setEditing] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const { user } = useAuth();

    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        const getData = async () => {
            try {
                const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts?search=${search}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                });

                if (!dataApi.ok) {
                    alert(`Lỗi HTTP: ${dataApi.status}`);
                }

                const data: typePost[] = await dataApi.json();

                setPosts(data);

            } catch (error) {
                alert(error);
            }
        }

        const getUser = async () => {
            try {
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users?user_id=${user?.user_id}`);

                if(!response.ok) {
                    alert('Lấy người dùng không thành công');
                }
                else {
                    const data = await response.json();
                    
                    setUser(data);
                }

            } catch (error) {
                alert(error);
            }
        }

        getData();
        getUser();
    }, [refreshKey, search]);


    const formatDate = (isoString: string | null) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            // second: '2-digit', // Bật dòng này nếu muốn hiện cả giây
        }).format(date);
    };

    function handleWatch(post: typePost) {
        setPost(post);
        setCommenting(prev => !prev);
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/delete/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok) {
                alert("Xóa bài viết thất bại");
            }
            else {
                setRefreshKey(prev => prev += 1);
            }
        } catch (error) {
            alert(error);
        }
    }

    function handleEdit(post: typePost) {
        setPost(post);
        setEditing(prev => !prev);
    }

    return (
        <div className="admin-posts">
            { 
                isCommenting ? 
                <HomeComment
                    dataPost={dataPost}
                    setPost = {setPost}
                    setCommenting = {setCommenting}
                    dataUser = {dataUser}
                    setRefreshKey = {setRefreshKey}
                /> : 
                "" 
            }
            {
                isEditing ? 
                <EditPost 
                    setEditing = {setEditing}
                    dataUser = {dataUser}
                    setRefreshKey = {setRefreshKey}
                    dataPost = {dataPost}
                /> :
                ""
            }
            <p className="title">
                Quản lý bài viết
            </p>
            <div className="admin-posts-input">
                <CiSearch
                    className="icon"
                />
                <input 
                    type="text"     
                    value={search??''}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm bài viết"
                />
            </div>
            <div className="admin-posts-table">
                <table>
                    <thead>
                        <tr>
                            {/* Điều chỉnh lại % độ rộng cho cân đối */}
                            <th style={{ width: '25%' }}>Tác giả</th>
                            <th style={{ width: '15%' }}>Hình ảnh</th>
                            <th style={{ width: '20%' }}>Tương tác</th>
                            <th style={{ width: '20%' }}>Ngày tạo</th>
                            <th style={{ width: '20%', textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        dataPosts?.map((post) => {
                            return (
                            <tr>
                                <td className="author-cell">
                                    <span className="author-name">{post.users_posts_user_idTousers.display_name}</span>
                                </td>
                                
                                {/* Cột hiển thị số lượng ảnh */}
                                <td className="image-cell">
                                    <div className="image-count-badge">
                                        <FaRegImage /> 
                                        <span>{post.image_url.length}</span>
                                    </div>
                                </td>

                                <td>
                                    <div className="interaction-cell">
                                        <div className="item like">
                                            <FaHeart /> <span>{post._count.post_likes}</span>
                                        </div>
                                        <div className="item comment">
                                            <FaComment /> <span>{post._count.comments}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="date-cell">{formatDate(post.created_at)}</td>
                                <td>
                                    <div className="action-cell">
                                        <button 
                                            className="btn-icon view" 
                                            title="Xem chi tiết"
                                            onClick={ () => handleWatch(post) }
                                        >
                                            <FaEye />
                                        </button>
                                        
                                        <button 
                                            className="btn-icon edit" 
                                            title="Chỉnh sửa"
                                            onClick={ () => handleEdit(post) }
                                        >
                                            <FaEdit />
                                        </button>

                                        <button 
                                            className="btn-icon delete" 
                                            title="Xóa bài viết"
                                            onClick={ () => handleDelete(post.post_id) }
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
                
            </div>
        </div>
    )
}

export default AdminPosts
