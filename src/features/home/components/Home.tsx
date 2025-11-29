import { useEffect, useState } from "react"
import Header from "../../../components/layout/Header"
import Post from "../../../components/ui/posts/Post"
import PostComposer from "../../../components/ui/posts/PostComposer"
import type { typePost } from "../../../types/post";
import HomePost from "./HomePost";
import { type payload, type typeUser } from "../../../types/user";
import HomeComment from "./HomeComment";
import { jwtDecode } from "jwt-decode";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function Home() {

    const [dataPosts, setPosts] = useState<typePost[]>([]);
    const [dataPost, setPost] = useState<typePost>();
    const [dataUser, setUser] = useState<typeUser | undefined>();
    const [isPosting, setPosting] = useState<boolean>(false);
    const [isCommenting, setCommenting] = useState<boolean>(false);

    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {

        const token = localStorage.getItem('authToken');

        const getData = async () => {
            try {
                const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                });

                if (!dataApi.ok) {
                    alert(`Lỗi HTTP: ${dataApi.status}`);
                }

                const data: typePost[] = await dataApi.json();

                setPosts(data);

            } catch (error) {
                alert(error);
            }
        }

        let userToken = null;

        if(token) {
            userToken = jwtDecode<payload>(token);
        }
        
        const userId = userToken?.user_id;
        

        const getUser = async () => {
            try {
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users?user_id=${userId}`);

                if(!response.ok) {
                    alert('Lấy người dùng không thành công')
                }
                else {
                    const data = await response.json();
                    
                    setUser(data);
                }

            } catch (error) {
                alert(error);
            }
        }

        getUser();
        getData();
    }, [refreshKey]); 

    useEffect(() => {
        if(isPosting || isCommenting) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };

    }, [isPosting || isCommenting]);

    return (
        <div id="main-layout">
            { 
                isPosting ? 
                <HomePost 
                    setPosting={setPosting}
                    dataUser={dataUser}
                    // onPostSuccess={() => setRefreshKey(prev => prev + 1)}
                    setRefreshKey={setRefreshKey}
                /> : 
                "" 
            }
            { 
                isCommenting ? 
                <HomeComment 
                    dataPost={dataPost}
                    setPost = {setPost}
                    setCommenting = {setCommenting}
                    dataUser = {dataUser}
                /> : 
                "" 
            }
            <Header />
            <div id="main-layout-home">
                <div className="main-layout-home-left"></div>
                <div className="main-layout-home-center">
                    <PostComposer 
                        setPosting={setPosting}
                    />
                    {
                        dataPosts.map((data) => {
                            return (
                                <Post
                                    dataPost = {data}
                                    setPost = {setPost}
                                    setCommenting = {setCommenting}
                                    setRefreshKey={setRefreshKey}
                                />
                            )
                        })
                    }
                </div>
                <div className="main-layout-home-right"></div>
            </div>
        </div>
    )
}

export default Home
