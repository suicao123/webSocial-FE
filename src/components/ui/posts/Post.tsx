import { BiLike, BiSolidLike } from "react-icons/bi"
import { FaRegCommentAlt } from "react-icons/fa"
import { IoEllipsisHorizontalOutline } from "react-icons/io5"
import type { typePost } from "../../../types/post"

function Post( {
    dataPost
} : {
    dataPost: typePost
} ) {
    

    return (
        <div id="post">
            <div className="post-header">
                <div className="post-header-left">
                    <img src={dataPost.users_posts_user_idTousers.avatar_url} className="avatar-post-header" />
                    <p>{dataPost.users_posts_user_idTousers.display_name}</p>
                </div>
                <div className="post-header-right">
                    <IoEllipsisHorizontalOutline 
                        className="icon"
                    />
                </div>  
            </div>
            <div className="post-content">
                <p>{dataPost.content}</p>
                {
                    dataPost.image_url?.map(img => {
                        return (
                            <img src={img} className="image"/>
                        )
                    })
                }
            </div>
            <div className="post-interact-show">
                <p>{dataPost._count.post_likes} Lượt thích</p>
                <p>{dataPost._count.comments} Bình luận</p>
            </div>
            <hr className="post-divider" />
            <div className="post-interact">
                <div className="post-interact-like">
                    {/* <BiSolidLike 
                        className="icon"
                    /> */}
                    <BiLike 
                        className="icon"
                    />
                    Thích
                </div>
                <div className="post-interact-comment">
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
