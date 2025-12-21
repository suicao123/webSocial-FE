import { Link } from "react-router";
import { useAuth } from "../../../context/useAuth";
import type { typeUser } from "../../../types/user";

function PostComposer( 
    { 
        setPosting,
        dataUser
    } : 
    { 
        setPosting: React.Dispatch<React.SetStateAction<boolean>> ,
        dataUser: typeUser | undefined
    } 
) {

    function handlePost() {
        setPosting((prev:boolean) => !prev);
    }

    const { user } = useAuth();

    return (
        <div id="post-composer">
            <Link to={`/profile/${user?.user_id}`}>
                <div className="avatar-post-composer">
                    <img src={dataUser?.avatar_url} alt="" />
                </div>
            </Link>
            
            <div 
                className="input-post-composer"
                onClick={ handlePost }
            >
                <p>Bạn đang nghĩ gì thế?</p>
            </div>
        </div>
    )
}

export default PostComposer
