import { useEffect, useState } from "react"
import Header from "../../../components/layout/Header"
import Post from "../../../components/ui/posts/Post"
import PostComposer from "../../../components/ui/posts/PostComposer"
import type { typePost } from "../../../types/post";
import HomePost from "./HomePost";
import type { typeUser } from "../../../types/user";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function Home() {

    const [dataPosts, setPosts] = useState<typePost[]>([]);
    const [dataUser, setuser] = useState<typeUser | undefined>();
    const [isPosting, setPosting] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts`);

                if (!dataApi.ok) {
                    alert(`Lỗi HTTP: ${dataApi.status}`);
                }

                const data: typePost[] = await dataApi.json();

                setPosts(data);

            } catch (error) {
                alert(error);
            }
        }

        getData();
    }, []); 

    useEffect(() => {
        if(isPosting) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };

    }, [isPosting]);

    return (
        <div id="main-layout">
            { isPosting ? 
                <HomePost 
                    setPosting={setPosting}
                    dataUser={dataUser}
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
