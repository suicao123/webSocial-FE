import { BiLike, BiSolidLike } from "react-icons/bi"
import { FaRegCommentAlt } from "react-icons/fa"
import { IoEllipsisHorizontalOutline } from "react-icons/io5"

function Post() {
    return (
        <div id="post">
            <div className="post-header">
                <img src="https://res.cloudinary.com/dd0yqxowo/image/upload/v1761823049/user-default_jxnvbw.jpg" className="avatar-post-header" />
                <IoEllipsisHorizontalOutline 
                    className="icon"
                />
            </div>
            <div className="post-content">
                <p>Chào, hôm nay cùng kết thúc phần này nhé!!!</p>
                <img src="https://res.cloudinary.com/dd0yqxowo/image/upload/v1761819380/photo-1633346887817-0a90c2ad1b90_ar4m0p.jpg" className="image"/>
            </div>
            <div className="post-interact-show">
                <p>Lượt thích</p>
                <p>Bình luận</p>
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
