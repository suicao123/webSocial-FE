import { memo } from "react"
import PostComposer from "../../../components/ui/posts/PostComposer"
import type { typePost } from "../../../types/post"
import Post from "../../../components/ui/posts/Post"

function MenuPost(
    { 
        setPosting,
        dataPosts,
        setCommenting,
        setPost,
        setRefreshKey
    } : 
    { 
        setPosting: React.Dispatch<React.SetStateAction<boolean>>,
        dataPosts: typePost[],
        setCommenting: React.Dispatch<React.SetStateAction<boolean>>,
        setPost: React.Dispatch<React.SetStateAction<typePost | undefined>>,
        setRefreshKey: React.Dispatch<React.SetStateAction<number>>
    } 
) {
    
    console.log(dataPosts);
    

    return (
        <div className="profile-container">
            <div className="profile-container-main">
                <PostComposer 
                    setPosting={setPosting}
                />
                {
                    dataPosts.map(data => {
                        console.log(data);
                        
                        return (
                            <Post
                                dataPost={data}
                                setPost={setPost}
                                setCommenting={setCommenting}
                                setRefreshKey={setRefreshKey}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default memo(MenuPost)
