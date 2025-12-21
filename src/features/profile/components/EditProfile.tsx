import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io"
import type { typeUser } from "../../../types/user";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function EditProfile(
    {
        setEdit,
        dataUser,
        setRefreshKey
    } :
    {
        setEdit: React.Dispatch<React.SetStateAction<boolean>>,
        dataUser: typeUser | undefined,
        setRefreshKey: React.Dispatch<React.SetStateAction<number>>
    }
) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string|undefined>(dataUser?.avatar_url);
    const [name, setName] = useState<string|undefined>(dataUser?.display_name);
    const [bio, setBio] = useState<string|undefined>(dataUser?.bio);
    const [email, setEmail] = useState<string|null|undefined>(dataUser?.email);

    function handleClickAddImg() {
        fileInputRef.current?.click();
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const file = e.target.files[0];
            setSelectedFile(file);
        }
    }

    useEffect(() => {
        if(!selectedFile) {
            setPreviewUrl(previewUrl);
            return;
        }

        const objectUrls =  URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrls);
        return () => {
            URL.revokeObjectURL(objectUrls);
        };

    }, [selectedFile]);

    async function handleSave() {
        try {
            const token = localStorage.getItem('authToken');
            let uploadedAvatarUrls = dataUser?.avatar_url;
            if(selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);

                const uploadRes = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/uploadAvatarProfile`, {
                    method: 'POST',
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if(!uploadRes.ok) {
                    alert('upload thất bại!!!');
                    return;
                }

                const data = await uploadRes.json();
                uploadedAvatarUrls = data.data.url;
            }

            const updateRes = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/updateProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    display_name: name,
                    email: email,
                    bio: bio,
                    avatar_url: uploadedAvatarUrls
                })
            });

            if(updateRes.ok) {
                setRefreshKey(prev => prev + 1);
                
            }
            else {
                alert('Cập nhật trang chủ thất bại!!!');
            }
            setEdit(prev => !prev)
        } catch (error) {
            console.error(error);
            alert("Lỗi cập nhật trang chủ .");
        }
    }

    return (
        <div className="edit-profile">
            <div className="edit-profile-container">
                <div className="edit-profile-header">
                    <p>Chỉnh sửa trang cá nhân</p>
                    <IoMdClose
                        className="icon"
                        onClick={ () => setEdit(prev => !prev) }
                    />
                </div>
                <div className="line"></div>
                <div className="edit-profile-img">
                    <div className="header">
                        <p>Ảnh đại diện</p>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={ handleFileChange }
                        />
                        <p 
                            className="change"
                            onClick={ handleClickAddImg }
                        >
                            Đổi
                        </p>
                    </div>
                    <div className="edit-img">
                        <img src={previewUrl} alt="" />
                    </div>
                </div>
                <div className="edit-profile-text">
                    <p>Tên hiển thị:</p>
                    <div className="input-group">
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên hiển thị của bạn"
                        />
                    </div>
                </div>
                <div className="edit-profile-text">
                    <p>Email:</p>
                    <div className="input-group">
                        <input 
                            type="text"     
                            value={email??''}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                        />
                    </div>
                </div>
                <div className="edit-profile-area">
                    <p>Giới thiệu:</p>
                    <div className="input-group">
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Mô tả ngắn về bản thân bạn..."
                        />
                    </div>
                </div>
                <div 
                    className="button-save"
                    onClick={ handleSave }
                >
                    <p>Lưu</p>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
