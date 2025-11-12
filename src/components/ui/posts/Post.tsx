import { BiLike, BiSolidLike } from "react-icons/bi"
import { FaRegCommentAlt } from "react-icons/fa"
import { IoEllipsisHorizontalOutline } from "react-icons/io5"
import type { typePost } from "../../../types/post"
import { useState } from "react"

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function Post( {
    dataPost,
    setPost,
    setCommenting
} : {
    dataPost: typePost | undefined,
    setPost: React.Dispatch<React.SetStateAction<typePost | undefined>>,
    setCommenting: React.Dispatch<React.SetStateAction<boolean>>
} ) {

    const [like, setLike] = useState<boolean | undefined>(dataPost?.isLike);

    function handleComment() {
        setPost(dataPost);
        setCommenting((prev) => !prev);
    }    

    async function handleLike() {
        const token = localStorage.getItem('authToken');
        setLike(prev => !prev);

        const likePost = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/createLike/${dataPost?.post_id}`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${token}`
            }
        })

        if(!likePost.ok) {
            alert('Lỗi like bài viết');
        }
    }

    return (
        <div id="post">
            <div className="post-header">
                <div className="post-header-left">
                    <img src={dataPost?.users_posts_user_idTousers.avatar_url} className="avatar-post-header" />
                    <p>{dataPost?.users_posts_user_idTousers.display_name}</p>
                </div>
                <div className="post-header-right">
                    <IoEllipsisHorizontalOutline 
                        className="icon"
                    />
                </div>  
            </div>
            <div className="post-content">
                <p>{dataPost?.content}</p>
                {
                    dataPost?.image_url?.map(img => {
                        return (
                            <img src={img} className="image"/>
                        )
                    })
                }
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
                        like ? <BiSolidLike 
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

export default Post
