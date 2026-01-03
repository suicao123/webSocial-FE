import { BiLike, BiSolidLike } from "react-icons/bi"
import { FaRegCommentAlt } from "react-icons/fa"
import { IoEllipsisHorizontalOutline } from "react-icons/io5"
import type { typePost } from "../../../types/post"
import { memo, useState } from "react"
import { useAuth } from "../../../context/useAuth"
import { RiDeleteBin5Fill } from "react-icons/ri"
import { Link } from "react-router"

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function Post( {
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

    // useEffect(() => {
    //     setLike(dataPost?.isLike ?? false);
    // }, []);

    // 1. Tạo state nội bộ để hiển thị (QUAN TRỌNG)
    // const [internalPost, setInternalPost] = useState<typePost | undefined>(dataPost);
    // const [like, setLike] = useState<boolean>(internalPost?.isLike ?? false);
    

    // Cập nhật state nội bộ nếu cha truyền data mới vào (khi load trang lần đầu)
    // useEffect(() => {
    //     setInternalPost(dataPost);
    // }, [dataPost]);

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

        // if (!internalPost) return;

        // // Lưu lại giá trị cũ để phòng trường hợp lỗi thì quay xe (revert)
        // const previousPostData = { ...internalPost };
        // const isCurrentlyLiked = internalPost.isLike;
        // setLike(prev => !prev);
        
        // // --- BƯỚC QUAN TRỌNG NHẤT: CẬP NHẬT UI NGAY LẬP TỨC ---
        // setInternalPost(prev => {
        //     if (!prev) return undefined;
        //     return {
        //         ...prev,
        //         isLike: !isCurrentlyLiked, // Đảo ngược trạng thái (Like -> Unlike)
        //         _count: {
        //             ...prev._count,
        //             // Nếu đang like thì trừ 1, chưa like thì cộng 1
        //             post_likes: isCurrentlyLiked ? prev._count.post_likes - 1 : prev._count.post_likes + 1
        //         }
        //     };
        // });

        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/createLike/${dataPost?.post_id}`, {
                method: 'POST',
                headers: { 'authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error("Like thất bại");
            }
            else {
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            // Nếu lỗi mạng hoặc server lỗi:
            // Trả lại trạng thái cũ (Rollback)
            // setInternalPost(previousPostData);
            alert('Không thể thích bài viết lúc này!');
        }
    }
    
    // const renderPostImages = () => {
    //     const images = dataPost?.image_url || [];
    //     if (images.length === 0) return null;

    //     // Trường hợp 1 ảnh: Hiển thị full
    //     if (images.length === 1) {
    //         return <img src={images[0]} 
    //             className="image single-image" 
    //             alt="post-img" 
    //             onClick={ handleComment }
    //         />;
    //     }

    //     // Trường hợp nhiều ảnh: Lấy tối đa 4 ảnh để hiển thị
    //     const displayImages = images.slice(0, 4);
    //     const remainingImages = images.length - 4; // Số ảnh còn dư nếu > 4

    //     // Xác định class layout dựa trên số lượng ảnh (2, 3, hoặc 4)
    //     // Nếu > 4 ảnh thì layout vẫn giống layout-4 nhưng có thêm xử lý overlay
    //     const layoutClass = `layout-${Math.min(images.length, 4)}`;

    //     return (
    //         <div className={`image-grid ${layoutClass}`}>
    //             {displayImages.map((img, index) => {
    //                 // Logic xử lý trường hợp đặc biệt cho layout 3 ảnh:
    //                 // Ảnh thứ 3 (index 2) sẽ nằm ở dưới và chiếm toàn bộ chiều rộng (span 2 cột)
    //                 const isThirdItemInLayout3 = images.length === 3 && index === 2;
                    
    //                 // Logic xử lý ảnh thứ 4 khi tổng số ảnh > 4 (Hiển thị overlay số dư)
    //                 const isOverlayItem = index === 3 && remainingImages > 0;

    //                 return (
    //                     <div 
    //                         key={index} 
    //                         className={`grid-item ${isThirdItemInLayout3 ? 'span-col-2' : ''}`}
    //                         onClick={ handleComment }
    //                     >
    //                         <img src={img} alt={`post-img-${index}`} />
                            
    //                         {/* Overlay hiển thị số ảnh còn lại (+N) */}
    //                         {isOverlayItem && (
    //                             <div className="more-overlay">
    //                                 <span>+{remainingImages}</span>
    //                             </div>
    //                         )}
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //     );
    // };

    const renderPostImages = () => {
        const images = dataPost?.image_url || [];
        if (images.length === 0) return null;

        // Xử lý logic chia ảnh
        const displayImages = images.slice(0, 4);
        const remainingImages = images.length - 4;
        
        // Class layout dựa trên số lượng ảnh thực tế (1, 2, 3, 4)
        // Nếu chỉ có 1 ảnh -> layout-1 -> ăn CSS đã sửa ở trên
        const layoutClass = `layout-${Math.min(images.length, 4)}`;

        return (
            <div className={`image-grid ${layoutClass}`}>
                {displayImages.map((img, index) => {
                    // Logic Layout 3: Ảnh thứ 3 (index 2) span 2 cột
                    const isThirdItemInLayout3 = images.length === 3 && index === 2;
                    
                    // Logic Overlay: Ảnh thứ 4 (index 3) hiện số dư
                    const isOverlayItem = index === 3 && remainingImages > 0;

                    return (
                        <div 
                            key={index} 
                            // Thêm class span-col-2 nếu cần
                            className={`grid-item ${isThirdItemInLayout3 ? 'span-col-2' : ''}`}
                            onClick={ handleComment }
                        >
                            <img src={img} alt={`post-img-${index}`} loading="lazy" />
                            
                            {isOverlayItem && (
                                <div className="more-overlay">
                                    <span>+{remainingImages}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
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
                {/* {
                    dataPost?.image_url?.map(img => {
                        return (
                            <img src={img} className="image"/>
                        )
                    })
                } */}
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

export default memo(Post)
