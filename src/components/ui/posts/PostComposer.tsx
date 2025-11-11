
function PostComposer( { setPosting } : { setPosting: React.Dispatch<React.SetStateAction<boolean>> } ) {

    function handlePost() {
        setPosting((prev:boolean) => !prev);
    }

    return (
        <div id="post-composer">
            <div className="avatar-post-composer"></div>
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
