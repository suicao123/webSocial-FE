import { memo, useEffect, useState } from "react"
import Header from "../components/layout/Header"
import { FaUserClock, FaUserFriends } from "react-icons/fa"
import { MdGroupAdd } from "react-icons/md"
import RequestBox from "../features/friend/components/RequestBox";
import type { typeUser } from "../types/user";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function FriendPage() {

    const [menuAction, setMenuAction] = useState<number>(1); 
    const [listReceivedFriendRequest, setListReceivedFriendRequest] = useState<typeUser[]>();
    const [listNonFriend, setListNonFriend] = useState<typeUser[]>();
    const [refreshKey, setRefreshKey] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const getReceivedFriendRequests = async () => {
            try {
                const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/getReceivedFriendRequests`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                });

                if(dataApi.ok) {
                    const data = await dataApi.json();
                    setListReceivedFriendRequest(data);
                }
                else {
                    alert('Lấy danh sách lời mời thất bại');
                }

            } catch (error) {
                alert(error);
            }
        };

        const getNonFriends = async () => {
            try {
                const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/getNonFriends`, {
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                });

                if(dataApi.ok) {
                    const data = await dataApi.json();
                    setListNonFriend(data);
                }
                else {
                    alert('Lấy danh sách nonFriends thất bại');
                }

            } catch (error) {
                alert(error);
            }
        };

        getReceivedFriendRequests();

        getNonFriends();
    }, [refreshKey]);


    async function handleAccept(id: number) {
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

    async function handleCancel(id: number) {

        const token = localStorage.getItem('authToken');
        const target_user_id = id;

        const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/cancelFriendRequest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({target_user_id}),
        });

        if(!dataApi.ok) {
            alert('Từ chối thất bại');
        }
        else {
            setRefreshKey(prev => prev + 1);
        }
    }

    return (
        <div id="friend-page">
            <Header 
                menuId={2}
            />
            <div className="friend-container">
                <div className="friend-page-menu">
                    <div className="menu-items">
                        <p>Bạn bè</p>
                        <div 
                            className={`item ${menuAction == 1 ? 'show' : ''}`}
                            onClick={ () => setMenuAction(1) }
                        >
                            <FaUserFriends />
                            <p>Trang chủ</p>
                        </div>
                        <div 
                            className={`item ${menuAction == 2 ? 'show' : ''}`}
                            onClick={ () => setMenuAction(2) }
                        >
                            <FaUserClock />
                            <p>Lời mời kết bạn</p>
                        </div>
                        <div 
                            className={`item ${menuAction == 3 ? 'show' : ''}`}
                            onClick={ () => setMenuAction(3) }
                        >
                            <MdGroupAdd />
                            <p>Tìm kiếm bạn bè</p>
                        </div>
                    </div>
                </div>
                <div className="friend-page-list">
                    <div className="list-items">
                        {
                            menuAction == 1 || menuAction == 2 ?
                            <>
                                <p className="context">Lời mời kết bạn</p>
                                <div className="lists">
                                    {
                                        listReceivedFriendRequest?.map(req => {
                                            return (
                                                <div className="item">
                                                    <img src={`${req.avatar_url}`} />
                                                    <div className="content">
                                                        <p>{req.display_name}</p>
                                                        <div 
                                                            className="accept"
                                                            onClick={ () => handleAccept(req.user_id) }
                                                        >
                                                            Đồng ý
                                                        </div>
                                                        <div 
                                                            className="reject"
                                                            onClick={ () => handleCancel(req.user_id) }
                                                        >
                                                            Từ chối
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </> : ''
                        }

                        {
                            menuAction == 1 ? 
                            <div className="line"></div> : ''
                        }

                        {
                            (menuAction == 1 || menuAction == 3) ?
                            <>
                                <p className="context">Danh sách kết bạn</p>
                                <div className="list-add">
                                    {
                                        listNonFriend?.map(user => {
                                            return (
                                                <RequestBox
                                                    user = {user}
                                                />
                                            )
                                        })
                                    }
                                    
                                </div>
                            </> : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(FriendPage)
