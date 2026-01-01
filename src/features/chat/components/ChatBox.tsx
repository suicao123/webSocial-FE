import { useEffect, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import { IoMdSend } from "react-icons/io";
import type { typeFriends } from "../../../types/user";
import { io } from "socket.io-client";
import { BsThreeDots } from "react-icons/bs";

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
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

    const { user } = useAuth();
    const socket = io(SOCKET_URL);

    // tắt menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest('.message-options')) {
                setActiveMessageId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

        const handleMessageDeleted = (deletedId: string) => {
             // Lọc bỏ tin nhắn đã xóa
             setMessages((prev: any) => prev?.filter((m: any) => m.message_id.toString() !== deletedId));
        };

        socket.on("receive_message", handleNewMessage);
        socket.on("message_deleted", handleMessageDeleted);

        // Cleanup
        return () => {
            socket.off("receive_message", handleNewMessage);
            socket.off("message_deleted", handleMessageDeleted);
        };
    }, [conversationId]);

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm("Bạn muốn xóa tin nhắn này?")) return;
        
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            // Gọi API (Bạn cần viết API này bên Backend nhé)
            const res = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/chat/deleteMessage/${messageId}`, {
                method: "DELETE", // Hoặc POST tùy backend bạn
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                // Xóa ngay trên UI (Optimistic Update)
                setMessages((prev: any) => prev?.filter((m: any) => m.message_id.toString() !== messageId));
                setActiveMessageId(null);
            } else {
                alert("Xóa thất bại");
            }
        } catch (err) {
            console.error(err);
        }
    };

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
            
            if (!res.ok) {
                alert("Lỗi gửi tin nhắn");
            }
            else {
                setMessage("");
            }
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

                {/* <div className="box-message">
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
                </div> */}

                <div className="box-message">
                    {
                        dataMessages?.map(data => {    
                            const isMine = data.sender_id.toString() == user?.user_id.toString();
                            // Key fallback
                            const msgId = data.message_id ? data.message_id.toString() : Math.random().toString();

                            const isActive = activeMessageId === msgId;

                            return (
                                <div className={`${isMine ? 'my-message' : 'another-message'}`} key={msgId}>
                                    {/* Wrapper để căn chỉnh icon và tin nhắn */}
                                    <div className="message-row">
                                        
                                        {/* Nếu là tin nhắn của mình thì hiện nút option bên trái */}
                                        {isMine && (
                                            <div 
                                                className={`message-options ${isActive ? 'active' : ''}`}
                                            >
                                                <div 
                                                    className="option-icon"
                                                    onClick={() => setActiveMessageId(activeMessageId === msgId ? null : msgId)}
                                                >
                                                    <BsThreeDots size={16} />
                                                </div>

                                                {/* Dropdown Menu */}
                                                {activeMessageId === msgId && (
                                                    <div className="option-menu">
                                                        <div 
                                                            className="menu-item delete"
                                                            onClick={() => handleDeleteMessage(msgId)}
                                                        >
                                                            Xóa
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="message">
                                            <p>{data.content}</p>
                                        </div>
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
