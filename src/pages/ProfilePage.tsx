import { useEffect, useState } from "react";
import Header from "../components/layout/Header"
import type { typeFriends, typeUser } from "../types/user"
import type { typePost } from "../types/post";
import { MdEdit, MdPersonAddAlt1 } from "react-icons/md";
import HomePost from "../features/home/components/HomePost";
import HomeComment from "../features/home/components/HomeComment";
import { useParams } from "react-router";
import MenuAbout from "../features/profile/components/MenuAbout";
import MenuFriendShip from "../features/profile/components/MenuFriendShip";
import { useAuth } from "../context/useAuth";
import { FaUserCheck, FaUserClock } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import PostComposer from "../components/ui/posts/PostComposer";
import Post from "../components/ui/posts/Post";
import EditProfile from "../features/profile/components/EditProfile";

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
    const [btnAction, setBtnAction] = useState<string>('');
    const [menu, setMenu] = useState<boolean>(false);
    const [isEdit, setEdit] = useState<boolean>(false);
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

        const getStatus = async () => {
            try {
                const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/getFriendshipStatus/${user_id}`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                });

                if(response.ok) {
                    const data = await response.json();
                    setBtnAction(data);
                }

            } catch (error) {
                alert(error);
            }
        }

        getPosts();
        getUser();
        getFriends();
        getStatus();
    }, [refreshKey, user_id]);

    async function handleAddFriend() {
        const target_user_id = user_id;
        const token = localStorage.getItem('authToken');

        const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/sendFriendRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({target_user_id}),
        });

        if(!dataApi.ok) {
            alert('Gủi kết bạn thất bại');
        }
        else {
            setRefreshKey(prev => prev + 1);
        }

    }

    async function handleCancelRequest() {

        const token = localStorage.getItem('authToken');
        const target_user_id = user_id;

        const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/cancelFriendRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({target_user_id}),
        });

        if(!dataApi.ok) {
            alert('Hủy kết bạn thất bại');
        }
        else {
            setRefreshKey(prev => prev + 1);
        }
    }

    async function handleAcceptRequest(id: any) {
        const token = localStorage.getItem('authToken');
        const target_user_id = id;

        const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/acceptFriendRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({target_user_id}),
        });

        if (!dataApi.ok) {
            alert('Kết bạn thất bại');
        }
        else {
            setRefreshKey(prev => prev + 1);
        }
    }

    async function handleDenyRequest() {

        const token = localStorage.getItem('authToken');
        const target_user_id = user_id;

        const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/cancelFriendRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({target_user_id}),
        });

        if(!dataApi.ok) {
            alert('Hủy kết bạn thất bại');
        }
        else {
            setRefreshKey(prev => prev + 1);
        }
    }

    async function handleUnfriend() {
        if (!window.confirm("Bạn có chắc chắn muốn xóa kết bạn?")) {
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/unfriend/${user_id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok) {
                alert("Xóa kết bạn thất bại");
            }
            else {
                setRefreshKey(prev => prev += 1);
            }
        } catch (error) {
            alert(error);
        }
    }

    const renderActionButton = () => {
        switch (btnAction) {
            case 'NOT_FRIEND':
                return (
                    <div 
                        className="button-edit-profile" 
                        onClick={handleAddFriend}
                    >
                        <MdPersonAddAlt1 />
                        <p>Thêm bạn bè</p>
                    </div>
                );

            case 'REQUEST_SENT':
                return (
                    <div 
                        className="button-friended-profile" 
                        onClick={handleCancelRequest}
                    >
                        <FaUserClock />
                        <p>Đã gửi</p>
                    </div>
                );

            case 'REQUEST_RECEIVED':
                return (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div 
                            className="button-edit-profile" 
                            onClick={() => handleAcceptRequest(user_id)}
                        >
                            <MdPersonAddAlt1 />
                            <p>Đồng ý</p>
                        </div>
                        <div 
                            className="button-friended-profile" 
                            onClick={handleDenyRequest}
                        >
                            <FaUserXmark />
                            <p>Từ chối</p>
                        </div>
                    </div>
                );

            case 'accepted': // Hoặc 'FRIEND' tùy backend trả về
                return (
                    <div>
                        <div 
                            className="button-friended-profile"
                            onMouseEnter={ () => setMenu(true) }
                            onMouseLeave={ () => setMenu(false) }
                        >
                            <FaUserCheck />
                            <p>Bạn bè</p>
                        </div>
                        <div 
                            className={`dropdown ${menu ? 'show' : ''}`}
                            onMouseEnter={ () => setMenu(true) }
                            onMouseLeave={ () => setMenu(false) }
                        >
                            <div 
                                className={`item ${menu ? 'show' : ''}`}
                                onClick={handleUnfriend}
                            >
                                <FaUserXmark />
                                <p>Hủy kết bạn</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    function handleMenu(menuIndex: number) {
        setActiveMenu(menuIndex);
    }
    
    return (
        <div id="main-layout-profile">
            {
                isEdit ? 
                <EditProfile 
                    setEdit = {setEdit}
                    dataUser = {dataUser}
                    setRefreshKey = {setRefreshKey}
                /> :
                ''
            }
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
                            {/* <p>1 bạn bè</p> */}
                        </div>
                    </div>
                    <div className="profile-header-right">
                        {
                            btnAction == 'SELF' ?
                            <div 
                                className="button-edit-profile"
                                onClick={ () => setEdit(prev => !prev) }
                            >
                                <MdEdit />
                                <p>Chỉnh sửa trang cá nhân</p>
                            </div> :
                            <div>
                                {renderActionButton()}
                            </div>
                        }
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
                    // activeMenu == 0 ?
                    // <MenuPost 
                    //     setPosting={setPosting}
                    //     dataPosts={dataPosts}
                    //     setCommenting={setCommenting}
                    //     setPost={setPost}
                    //     setRefreshKey={setRefreshKey}
                    // /> : 
                    // ''

                    activeMenu == 0 ?
                    <div className="profile-container">
                        <div className="profile-container-main">
                            {
                                myId == user_id ? 
                                <PostComposer 
                                    setPosting={setPosting}
                                    dataUser = {dataUser}
                                /> : ''
                            }
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
                    </div> : 
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
