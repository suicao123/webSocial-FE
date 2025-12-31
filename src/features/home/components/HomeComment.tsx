
import { useEffect, useState } from "react";
import type { typeComment, typePost } from "../../../types/post";
import { IoMdClose, IoMdSend } from "react-icons/io";
import type { typeUser } from "../../../types/user";
import { io } from "socket.io-client";
import PostDetail from "../../../components/ui/posts/PostDetail";

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
    let token: string | null = '';

    function handleClose() {
        setCommenting((prev) => !prev);
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
        
        // 1. Khởi tạo socket ngay trong useEffect
        // Biến này chỉ tồn tại trong phạm vi của lần chạy effect này
        const newSocket = io(SOCKET_URL);

        if (postId) {
            // Join room
            newSocket.emit("join_post", postId.toString());
        }

        // Lắng nghe sự kiện
        newSocket.on("new_comment_created", (newComment: typeComment) => {
            console.log("Socket nhận comment mới:", newComment);
            
            setComments((prev) => {
                return [...prev, newComment];
            });
        });

        // Cleanup function: Chạy khi component unmount hoặc postId đổi
        return () => {
            newSocket.disconnect(); // Ngắt kết nối socket này
        };
    }, []);

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
                    <p>Bài viết của {dataPost?.users_posts_user_idTousers.display_name}</p>
                    <IoMdClose
                        className="icon"
                        onClick={ handleClose }
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
                                return (
                                    <div className="comment">
                                        <img src={data.users.avatar_url} className="avatar-post-header" />
                                        <div className="comment-data">
                                            <div className="data">
                                                <p>{data.users.display_name}</p>
                                                <p>{data.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {/* <div className="comment">
                            <img src={dataPost.users_posts_user_idTousers.avatar_url} className="avatar-post-header" />
                            <div className="comment-data">
                                <div className="data">
                                    <p>{dataPost.users_posts_user_idTousers.display_name}</p>
                                    <p>Ahihiewiuhfeiuwgfeiqwuof geqwiufgweiufgeiquwfgewiuofgewiufgewqiufg ewiufgewiugqfwhfsjhfweiohfewiofheqwio</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div className="line"></div>

                <div className="home-comment-footer">
                    <img src={dataUser?.avatar_url} className="avatar-post-header" />
                    <div className="home-comment-footer-content">
                        <textarea 
                            placeholder="Viết bình luận"
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            onKeyDown={ handleKeyDown }
                        />
                        <IoMdSend
                            className="icon"
                            size={22}
                            onClick={ handleComment }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeComment;
