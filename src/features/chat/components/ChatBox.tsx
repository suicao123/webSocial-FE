import { useEffect, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import { IoMdSend } from "react-icons/io";
import type { typeFriends } from "../../../types/user";
import { io } from "socket.io-client";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';   

const SOCKET_URL = `${PROTOCOL}://${HOST}:${PORT}`;

function ChatBox(
    {
        dataMessages,
        dataPartner,
        conversationId,
        setMessages
    }:
    {
        dataMessages: any[] | undefined,
        dataPartner: typeFriends | undefined,
        conversationId: BigInt | undefined,
        setMessages: React.Dispatch<React.SetStateAction<any[] | undefined>>
    }
) {

    const [message, setMessage] = useState<string>("");

    const { user } = useAuth();
    const socket = io(SOCKET_URL);

    // 1. JOIN ROOM khi conversationId thay đổi
    useEffect(() => {
        if (conversationId) {
            // Gửi sự kiện bảo server: "Tôi đang xem phòng này, có tin mới thì báo tôi"
            socket.emit("join_room", conversationId);
        }
    }, [conversationId]);

    // 2. LẮNG NGHE TIN NHẮN MỚI
    useEffect(() => {
        // Hàm xử lý khi có tin nhắn mới bay về
        const handleNewMessage = (newMessage: any) => {
            if (newMessage.conversation_id === conversationId) {
                setMessages((prev: any) => [newMessage, ...prev]);
            }
        };

        socket.on("receive_message", handleNewMessage);

        // Cleanup
        return () => {
            socket.off("receive_message", handleNewMessage);
        };
    }, [conversationId]);

    // 3. HÀM GỬI TIN NHẮN (Gọi API)
    const handleSend = async () => {
        if (!message.trim()) return;

        const token = localStorage.getItem('authToken');
        
        try {
            // Gọi API lưu tin nhắn
            const res = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/chat/sendMessage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    conversation_id: conversationId,
                    content: message
                })
            });
            
            // Lưu ý: Không cần setMessages ở đây nữa!
            // Vì API chạy xong sẽ bắn Socket -> Socket lắng nghe ở trên sẽ tự update UI.
            // Điều này giúp đồng bộ dữ liệu chuẩn hơn.
            
            setMessage("");
        } catch (err) {
            console.error(err);
        }
    };

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if(e.key === 'Enter') {
            e.preventDefault();

            if(message !== '') {
                handleSend();
                setMessage("");
            }
        }
    }

    return (
        <div className="chat-box-container">
            <div className="chat-box">
                <div className="chat-box-header">
                    <div className="chat-box-user">
                        <img src={`${dataPartner?.avatar_url}`} className="avatar" />
                        <p>{dataPartner?.display_name}</p>
                    </div>
                </div>

                <div className="box-message">
                    {
                        dataMessages?.map(data => {    
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
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={ handleKeyDown }
                        />
                        <IoMdSend
                            className="icon"
                            size={22}
                            onClick={ handleSend }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox
