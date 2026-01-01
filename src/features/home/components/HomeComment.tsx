
import { useEffect, useState } from "react";
import type { typeComment, typePost } from "../../../types/post";
import { IoMdClose, IoMdSend } from "react-icons/io";
import type { typeUser } from "../../../types/user";
import { io } from "socket.io-client";
import PostDetail from "../../../components/ui/posts/PostDetail";
import { useAuth } from "../../../context/useAuth";
import { BsThreeDots } from "react-icons/bs";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

const SOCKET_URL = `${PROTOCOL}://${HOST}:${PORT}`;

function HomeComment(
    {
        dataPost,
        setPost,
        setCommenting,
        dataUser,
        setRefreshKey
    } :
    {
        dataPost: typePost | undefined
        setPost: React.Dispatch<React.SetStateAction<typePost | undefined>>,
        setCommenting: React.Dispatch<React.SetStateAction<boolean>>
        dataUser: typeUser | undefined,
        setRefreshKey: React.Dispatch<React.SetStateAction<number>>
    }
) {

    const [dataComments, setComments] = useState<typeComment[]>([]);
    const [commentValue, setCommentValue] = useState<string>('');
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const { user } = useAuth();
    let token: string | null = '';

    function handleClose() {
        setCommenting((prev) => !prev);
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Bạn có chắc muốn xóa bình luận này?")) return;

        try {
            // Lấy token mới nhất từ localStorage
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
                return;
            }

            const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/deleteComment/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Cập nhật UI ngay lập tức (Optimistic update)
                // Ép kiểu về String để so sánh chính xác 100%
                setComments(prev => prev.filter(c => String(c.comment_id) !== String(commentId)));
                
                // Đóng menu 3 chấm
                setActiveCommentId(null); 
            } else {
                // Thử lấy thông báo lỗi từ server nếu có
                const errorData = await response.json();
                alert(errorData.error || "Xóa thất bại");
            }
        } catch (error) {
            console.error("Lỗi xóa comment:", error);
            alert("Đã có lỗi xảy ra, vui lòng thử lại.");
        }
    }

    useEffect(() => {

        token = localStorage.getItem('authToken');

        if (!token) {
            alert('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.');
            return;
        }

        const fetchComments = async () => {
            try {
                const postId = dataPost?.post_id;
                const respone = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/comment?post_id=${postId}`, {
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                })

                const data = await respone.json();

                setComments(data);
            } 
            catch (error) {
                console.log(error);
            }
        }

        fetchComments();
    }, []);


    useEffect(() => {

        const postId = dataPost?.post_id;
        
        // Biến này chỉ tồn tại trong phạm vi của lần chạy effect này
        const newSocket = io(SOCKET_URL);

        if (postId) {
            // Join room
            newSocket.emit("join_post", postId.toString());
        }

        // Thêm
        newSocket.on("new_comment_created", (newComment: typeComment) => {
            console.log("Socket nhận comment mới:", newComment);
            
            setComments((prev) => {
                return [newComment, ...prev];
            });
        });

        // Xóa
        newSocket.on("comment_deleted", (deletedCommentId: string) => {
            console.log("Socket nhận lệnh xóa comment ID:", deletedCommentId);
            
            // Lọc bỏ comment có ID trùng khớp khỏi danh sách
            setComments((prev) => prev.filter(c => c.comment_id.toString() !== deletedCommentId));
        });

        // Cleanup function: Chạy khi component unmount hoặc postId đổi
        return () => {
            newSocket.disconnect(); // Ngắt kết nối socket này
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Nếu click không trúng vào vùng .comment-options thì tắt menu
            if (!(event.target as HTMLElement).closest('.comment-options')) {
                setActiveCommentId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeCommentId]);

    async function handleComment() {
        try {
            token = localStorage.getItem('authToken');

            console.log(token);
            
            
            const user_id = dataUser?.user_id;
            const post_id = dataPost?.post_id;
            const content = commentValue;

            const comment = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/createComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    post_id: post_id,
                    content: content,
                    user_id: user_id
                })
            })

            console.log(comment);
            

            if (!comment.ok) {
                alert('Đăng bài thất bại!!');
            }

        } catch (error) {
            alert('Bình luận thất bại!!!');
        } finally {
            setCommentValue('');
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if(e.key === 'Enter') {
            e.preventDefault();

            if(commentValue !== '') {
                handleComment();
                setCommentValue('');
            }
        }
    }

    return (
        <div className="home-comment">
            <div className="home-comment-container">
                <div className="home-comment-header">
                    {/* Thêm dấu ? để tránh lỗi nếu dataPost chưa load xong */}
                    <p>Bài viết của {dataPost?.users_posts_user_idTousers?.display_name}</p>
                    <IoMdClose
                        className="icon"
                        onClick={handleClose}
                    />
                </div>

                <div className="line"></div>

                <div className="home-comment-main">
                    <PostDetail
                        dataPost={dataPost}
                        setPost={setPost}
                        setCommenting={setCommenting}
                        setRefreshKey={setRefreshKey}
                    />

                    <div className="line"></div>

                    <div className="home-comment-content">
                        {
                            dataComments.map(data => {
                                // FIX 1: Kiểm tra kỹ user_id tồn tại trước khi toString() để tránh crash
                                const isMyComment = (user?.user_id && data.user_id) 
                                    ? user.user_id.toString() === data.user_id.toString() 
                                    : false;

                                return (
                                    // FIX 2: Thêm fallback key nếu comment_id bị thiếu
                                    <div className="comment" key={data.comment_id ? data.comment_id.toString() : Math.random()}>
                                        {/* FIX 3: Dùng ?. để an toàn nếu users bị null */}
                                        <img 
                                            src={data.users?.avatar_url || "https://via.placeholder.com/50"} 
                                            className="avatar-post-header" 
                                            alt="avatar"
                                        />
                                        
                                        <div className="comment-wrapper">
                                            <div className="comment-data">
                                                <div className="data">
                                                    {/* FIX 4: Dùng ?. cho display_name */}
                                                    <p>{data.users?.display_name || "Người dùng"}</p>
                                                    <p>{data.content}</p>
                                                </div>
                                            </div>
                                            
                                            {isMyComment && (
                                                <div className="comment-options">
                                                    <div 
                                                        className="option-icon"
                                                        // FIX 5: Kiểm tra data.comment_id tồn tại trước khi so sánh
                                                        onClick={() => {
                                                            if (!data.comment_id) return;
                                                            const currentId = data.comment_id.toString();
                                                            setActiveCommentId(activeCommentId === currentId ? null : currentId);
                                                        }}
                                                    >
                                                        <BsThreeDots size={20} />
                                                    </div>

                                                    {/* FIX 6: So sánh an toàn */}
                                                    {data.comment_id && activeCommentId === data.comment_id.toString() && (
                                                        <div className="option-menu">
                                                            <div 
                                                                className="menu-item delete"
                                                                // FIX 7: Ép kiểu string an toàn
                                                                onClick={() => handleDeleteComment(data.comment_id.toString())}
                                                            >
                                                                Xóa bình luận
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="line"></div>

                <div className="home-comment-footer">
                    <img src={dataUser?.avatar_url || ""} className="avatar-post-header" />
                    <div className="home-comment-footer-content">
                        <textarea 
                            placeholder="Viết bình luận"
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <IoMdSend
                            className="icon"
                            size={22}
                            onClick={handleComment}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeComment;
