import { useEffect, useState } from "react";
import Header from "../components/layout/Header"
import type { typeFriends, typeUser } from "../types/user"
import type { typePost } from "../types/post";
import { MdEdit } from "react-icons/md";
import MenuPost from "../features/profile/components/MenuPost";
import HomePost from "../features/home/components/HomePost";
import HomeComment from "../features/home/components/HomeComment";
import { useParams } from "react-router";
import MenuAbout from "../features/profile/components/MenuAbout";
import MenuFriendShip from "../features/profile/components/MenuFriendShip";
import { useAuth } from "../context/useAuth";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function ProfilePage() {

    const [dataPosts, setPosts] = useState<typePost[]>([]);
    const [dataPost, setPost] = useState<typePost>();
    const [dataUser, setUser] = useState<typeUser | undefined>();
    const [dataFriends, setFriends] = useState<typeFriends[]>();
    const [isPosting, setPosting] = useState<boolean>(false);
    const [isCommenting, setCommenting] = useState<boolean>(false);
    const { user_id } = useParams();
    const { user } = useAuth();
    const myId = user?.user_id;

    const [activeMenu, setActiveMenu] = useState<number>(0);

    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        const getPosts = async () => {
            try {
                const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/postsProfile/${user_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({myId, user_id}),
                });

                // const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/login`, {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({username, password}),
                // });

                if (!dataApi.ok) {
                    alert(`Lỗi HTTP: ${dataApi.status}`);
                }

                const data: typePost[] = await dataApi.json();

                setPosts(data);

            } catch (error) {
                alert(error);
            }
        }

        const getUser = async () => {
            try {
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users?user_id=${user_id}`);

                if(!response.ok) {
                    alert('Lấy người dùng không thành công');
                }
                else {
                    const data = await response.json();
                    
                    setUser(data);
                }

            } catch (error) {
                alert(error);
            }
        }

        const getFriends = async () => {
            try {
                
                const friendList = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/getFriends/${user_id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                });

                if(!friendList.ok) {
                    alert('Lấy danh sách bạn bè không thành công');
                }
                else {
                    const data = await friendList.json();

                    setFriends(data.data);
                }

            } catch (error) {
                alert(error);
            }
        }

        getPosts();
        getUser();
        getFriends();
    }, [refreshKey]);

    function handleMenu(menuIndex: number) {
        setActiveMenu(menuIndex);
    }
    
    return (
        <div id="main-layout-profile">
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
                    setRefreshKey = {setRefreshKey}
                /> : 
                "" 
            }
            <Header 
                menuId={0}
            />
            <div className="profile-header">
                <div className="profile-header-top">
                    <div className="profile-header-left">
                        <img src={dataUser?.avatar_url} />
                        <div className="text">
                            <p>{dataUser?.display_name}</p>
                            <p>1 bạn bè</p>
                        </div>
                    </div>
                    <div className="profile-header-right">
                        <div className="button-edit-profile">
                            <MdEdit />
                            <p>Chỉnh sửa trang cá nhân</p>
                        </div>
                    </div>
                </div>
                <div className="profile-header-bottom">
                    <div className="line"></div>
                    <div className="profile-header-bottom-menu">
                        <div 
                            className={`profile-header-bottom-menu-item ${activeMenu == 0 ? "show" : ''}`}
                            onClick={ () => handleMenu(0) }
                        >
                            <p>Bài viết</p>
                        </div>
                        <div 
                            className={`profile-header-bottom-menu-item ${activeMenu == 1 ? "show" : ''}`}
                            onClick={ () => handleMenu(1) }
                        >
                            <p>Giới thiệu</p>
                        </div>
                        <div 
                            className={`profile-header-bottom-menu-item ${activeMenu == 2 ? "show" : ''}`}
                            onClick={ () => handleMenu(2) }
                        >
                            <p>Bạn bè</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile-layout-content">
                {
                    activeMenu == 0 ?
                    <MenuPost 
                        setPosting={setPosting}
                        dataPosts={dataPosts}
                        setCommenting={setCommenting}
                        setPost={setPost}
                        setRefreshKey={setRefreshKey}
                    /> : 
                    ''
                }
                {
                    activeMenu == 1 ?
                    <MenuAbout 
                        dataUser={dataUser}
                    /> : 
                    ''
                }
                {
                    activeMenu == 2 ?
                    <MenuFriendShip
                        dataFriends = {dataFriends}
                    /> : 
                    ''
                }
            </div>
        </div>
    )
}

export default ProfilePage
