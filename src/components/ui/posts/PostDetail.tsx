import { BiLike, BiSolidLike } from "react-icons/bi"
import { FaRegCommentAlt } from "react-icons/fa"
import { IoEllipsisHorizontalOutline } from "react-icons/io5"
import type { typePost } from "../../../types/post"
import { memo, useState } from "react"
import { useAuth } from "../../../context/useAuth"
import { RiDeleteBin5Fill } from "react-icons/ri"
import { Link } from "react-router"

// --- THÊM IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// --------------------------

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function PostDetail( {
    dataPost,
    setPost,
    setCommenting,
    setRefreshKey
} : {
    dataPost: typePost | undefined,
    setPost: React.Dispatch<React.SetStateAction<typePost | undefined>>,
    setCommenting: React.Dispatch<React.SetStateAction<boolean>>,
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>
} ) {

    const { user } = useAuth();
    const [menu, setMenu] = useState<boolean>(false);

    function handleComment() {
        setPost(dataPost);
        setCommenting((prev) => !prev);
    }    

    async function handleDelete() {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/delete/${dataPost?.post_id}`, {
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
    
    async function handleLike() {
        // try {
        //     const token = localStorage.getItem('authToken');
        //     const res = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/createLike/${dataPost?.post_id}`, {
        //         method: 'POST',
        //         headers: { 'authorization': `Bearer ${token}` }
        //     });

        //     if (!res.ok) {
        //         throw new Error("Like thất bại");
        //     }
        //     else {
        //         setRefreshKey(prev => prev + 1);
        //     }
        // } catch (error) {
        //     alert('Không thể thích bài viết lúc này!');
        // }

        try {
            const token = localStorage.getItem('authToken');
            
            // --- CẬP NHẬT UI NGAY LẬP TỨC (Optimistic Update) ---
            // Sử dụng setPost được truyền từ props xuống
            setPost((prev) => {
                if (!prev) return prev;
                
                const isCurrentlyLiked = prev.isLike;
                
                return {
                    ...prev,
                    isLike: !isCurrentlyLiked, // Đảo ngược trạng thái like
                    _count: {
                        ...prev._count,
                        // Tăng hoặc giảm số lượng like dựa trên trạng thái mới
                        post_likes: !isCurrentlyLiked 
                            ? prev._count.post_likes + 1 
                            : prev._count.post_likes - 1
                    }
                };
            });
            // ----------------------------------------------------

            const res = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/createLike/${dataPost?.post_id}`, {
                method: 'POST',
                headers: { 'authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                // Nếu API lỗi, bạn nên revert (đảo ngược) lại state setPost ở đây
                // Hoặc thông báo lỗi và reload lại trang
                throw new Error("Like thất bại");
            }
            else {
                // Cập nhật lại danh sách bên ngoài Home để đồng bộ
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            alert('Không thể thích bài viết lúc này!');
            // Revert lại state nếu cần thiết tại đây
        }
    }
    
    // --- SỬA HÀM RENDER DÙNG SWIPER ---
    const renderPostImages = () => {
        const images = dataPost?.image_url || [];
        if (images.length === 0) return null;

        return (
            // Đặt class riêng để dễ CSS
            <div className="post-detail-slider">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}      // Khoảng cách giữa các ảnh
                    slidesPerView={1}     // Hiện 1 ảnh 1 lúc
                    navigation={true}     // Hiện mũi tên
                    pagination={{ clickable: true }} // Hiện chấm tròn
                    className="my-swiper"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="slide-content">
                                {/* Ảnh chính */}
                                <img 
                                    src={img} 
                                    alt={`detail-${index}`} 
                                    loading="lazy"
                                />
                                {/* Background mờ (trang trí cho đẹp nếu ảnh không vừa khung) */}
                                <div 
                                    className="blur-backdrop" 
                                    style={{backgroundImage: `url(${img})`}}
                                ></div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    };

    return (
        <div id="post">
            <div className="post-header">
                <div className="post-header-left">
                    <Link to={`/profile/${dataPost?.user_id}`}>
                        <img src={dataPost?.users_posts_user_idTousers.avatar_url} className="avatar-post-header" />
                    </Link>
                    <p>{dataPost?.users_posts_user_idTousers.display_name}</p>
                </div>
                <div className="post-header-right">
                    {
                        user?.user_id == dataPost?.user_id ?
                        <div 
                            className="post-header-icon"
                            onMouseEnter={ () => setMenu(true) }
                            onMouseLeave={ () => setMenu(false) }
                        >
                            <IoEllipsisHorizontalOutline 
                                className="icon"
                            />
                        </div> : ''
                    }
                    <div 
                        className={`post-header-menu ${menu ? 'show' : ''}`}
                        onMouseEnter={ () => setMenu(true) }
                        onMouseLeave={ () => setMenu(false) }
                    >
                        <div 
                            className={`item ${menu ? 'show' : ''}`}
                            onClick={ handleDelete }
                        >
                            <RiDeleteBin5Fill />
                            <p>Xóa bài viết</p>
                        </div>
                    </div>
                </div> 
            </div>
            <div className="post-content">
                <p>{dataPost?.content}</p>
                {/* Render Slider */}
                {renderPostImages()}
            </div>
            <div className="post-interact-show">
                <p>{dataPost?._count.post_likes} Lượt thích</p>
                <p>{dataPost?._count.comments} Bình luận</p>
            </div>
            <hr className="post-divider" />
            <div className="post-interact">
                <div
                    className="post-interact-like"
                    onClick={ handleLike }
                >
                    {
                        dataPost?.isLike ? <BiSolidLike 
                            className="icon"
                        /> :
                        <BiLike 
                            className="icon"
                        />
                    }
                    Thích
                </div>
                <div 
                    className="post-interact-comment"
                    onClick={ handleComment }
                >
                    <FaRegCommentAlt 
                        className="icon"
                    />
                    Bình luận
                </div>
            </div>
        </div>
    )
}

export default memo(PostDetail)