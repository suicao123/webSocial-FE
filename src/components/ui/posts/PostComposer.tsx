import { Link } from "react-router";
import { useAuth } from "../../../context/useAuth";

function PostComposer( 
    { 
        setPosting
    } : 
    { 
        setPosting: React.Dispatch<React.SetStateAction<boolean>> 
    } 
) {

    function handlePost() {
        setPosting((prev:boolean) => !prev);
    }

    const { user } = useAuth();

    return (
        <div id="post-composer">
            <Link to={`/profile/${user?.user_id}`}>
                <div className="avatar-post-composer"></div>
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
