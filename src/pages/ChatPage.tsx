import { CiSearch } from "react-icons/ci"
import Header from "../components/layout/Header"
import { useEffect, useState } from "react";
import type { typeFriends, typeOnlineUser } from "../types/user";
import { useAuth } from "../context/useAuth";
import ChatBox from "../features/chat/components/ChatBox";
import { io } from "socket.io-client";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

const SOCKET_URL = `${PROTOCOL}://${HOST}:${PORT}`;

function ChatPage() {

    const [dataFriends, setFriends] = useState<typeFriends[]>();
    const [dataPartner, setPartner] = useState<typeFriends>();
    const [dataMessages, setMessages] = useState<any[]>();
    const [conversationId, setConversationId] = useState<BigInt>();
    const [search, setSearch] = useState<string>("");
    const { user } = useAuth();

    const [onlineUsers, setOnlineUsers] = useState<typeOnlineUser[]>([]);
    const [socket, setSocket] = useState<any>(null);
    // const [socket] = useState(() => io(SOCKET_URL));

    useEffect(() => {
        // 1. Kết nối socket
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // 2. Gửi tín hiệu mình đang online (nếu đã đăng nhập)
        if (user?.user_id) {
            newSocket.emit("addNewUser", user.user_id);
        }

        // 3. Lắng nghe danh sách online từ server trả về
        newSocket.on("getOnlineUsers", (res: typeOnlineUser[]) => {
            console.log("Danh sách Online từ Server:", res);
            setOnlineUsers(res);
        });

        // 4. Cleanup khi rời trang
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        const getFriends = async () => {
            try {
                
                const friendList = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/getFriends/${user?.user_id}?search=${search}`, {
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

        getFriends();
    }, [search]);

    const openConsersation = async (partner_id: string) => {
        try {
            const token = localStorage.getItem('authToken');

            let conversation_id: bigint = BigInt (0) ;
            
            const dataApi = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/chat/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    partner_id: partner_id
                }),
            });

            if(!dataApi.ok) {
                alert('Mở cuộc trò chuyện thất bại');
            }
            else {
                const data = await dataApi.json();
                conversation_id = data.data.conversation_id;
                setConversationId(conversation_id);

                setPartner(data.data.formattedPartner);
            }

            const dataMsg = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/chat/getMessages/${conversation_id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                },
            });

            if(!dataMsg.ok) {
                alert('Xem cuộc trò chuyện thất bại');
            }
            else {
                const data = await dataMsg.json();

                setMessages(data);
            }

        } catch (error) {
            alert(error);
        }
    }

    return (
        <div id="chat-page">
            <Header 
                menuId = {3}
            />
            <div className="chat-container">
                <div className="chat-list-container">
                    <div className="chat-list">
                        <p>Chat</p>
                        <div className="search">
                            <CiSearch
                                className="icon"
                            />
                            <input 
                                type="text" 
                                value={search}
                                onChange={ (e) => setSearch(e.target.value) }
                                placeholder="Tìm kiếm"
                            />
                        </div>
                        <div className="line"></div>
                        {
                            dataFriends?.map(data => {
                                console.log("Checking User:", data.user_id, "Type:", typeof data.user_id);
                                const isOnline = onlineUsers.some(
                                    u => String(u.userId) === String(data.user_id)
                                );
                                return (
                                    <div 
                                        className="item"
                                        onClick={ () => openConsersation(data.user_id) }
                                    >
                                        {/* <img src={`${data.avatar_url}`} className="avatar" /> */}
                                        <div className="avatar-wrapper">
                                            <img src={`${data.avatar_url}`} className="avatar" alt="avatar" />
                                            {/* Đây là dấu chấm xanh, sau này logic sẽ check điều kiện ở đây để ẩn/hiện */}
                                            {/* <span className="online-dot"></span> */}
                                            {isOnline && <span className="online-dot"></span>}
                                        </div>
                                        <p>{data.display_name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <ChatBox 
                    dataMessages={dataMessages}
                    dataPartner={dataPartner}
                    conversationId={conversationId}
                    setMessages={setMessages}
                    socket={socket}
                />
                {/* <div className="chat-box-container">
                    <div className="chat-box">
                        <div className="chat-box-header">
                            <div className="chat-box-user">
                                <img src={`${dataPartner?.avatar_url}`} className="avatar" />
                                <p>{dataPartner?.display_name}</p>
                            </div>
                        </div>

                        <div className="box-message">
                            {
                                dataMessages?.slice().reverse().map(data => {    
                                    const isMine = data.sender_id == user?.user_id;
                                    return (
                                        <div className={`${isMine ? 'my-message' : 'another-message'}`}>
                                            <div className="message">
                                                <p>{data.content}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className="input-message">
                            <div className="input">
                                <input 
                                    type="text" 
                                    placeholder="Gửi tin nhắn"
                                />
                                <IoMdSend
                                    className="icon"
                                    size={22}
                                    // onClick={ handleComment }
                                />
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default ChatPage
