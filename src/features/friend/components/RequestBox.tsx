import { useState } from "react"
import type { typeUser } from "../../../types/user";
import { useNavigate } from "react-router";

const PROTOCOL:string = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST:string = import.meta.env.VITE_API_HOST || 'localhost';
const PORT:string = import.meta.env.VITE_API_PORT || '8080';


function RequestBox(
    {user} :
    {user: typeUser | undefined}
) {

    const [isSend, setSend]= useState<boolean>(true);
    const navigate = useNavigate();

    async function handleSendRequest() {
        const target_user_id = user?.user_id;
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

        setSend(prev => !prev)
    }

    async function handleCancel() {

        const token = localStorage.getItem('authToken');
        const target_user_id = user?.user_id;

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

        setSend(prev => !prev)
    }

    function handleClickImg(id: any) {
        navigate(`/profile/${id}`);
    }

    return (
        <div className="item">
            <img 
                src={`${user?.avatar_url}`} 
                onClick={() => handleClickImg(user?.user_id)}
            />
            <div className="content">
                <p>{user?.display_name}</p>
                {
                    isSend ? 
                    <div 
                        className='add'
                        onClick={ handleSendRequest }
                    >
                        Gửi lời mời
                    </div> : 
                    <div 
                        className='cancel'
                        onClick={ handleCancel }
                    >
                        Hủy lời mời
                    </div>
                }
            </div>
        </div>
    )
}

export default RequestBox