import { useEffect, useRef, useState } from "react";
import { MdPersonAddAlt1 } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
// Import hàm validate và kiểu dữ liệu vừa sửa
import { validateSignup, type SignUpErrors } from "../../../validation/auth"; 

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function SignUpAdmin() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [previewUrl, setPreviewUrl] = useState<string>("https://res.cloudinary.com/dd0yqxowo/image/upload/v1761823049/user-default_jxnvbw.jpg"); 
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordA, setPasswordA] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState<SignUpErrors>({});

    function handleClickAddImg() {
        fileInputRef.current?.click();
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
        }
    }

    useEffect(() => {
        if(!selectedFile) return;
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleRegister = async () => {
        const validationErrors = validateSignup(username, displayName, password, passwordA);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setErrors({});

        try {
            const token = localStorage.getItem('authToken');
            let finalAvatarUrl = "https://res.cloudinary.com/dd0yqxowo/image/upload/v1761823049/user-default_jxnvbw.jpg";

            if (selectedFile) {
                const formData = new FormData();
                formData.append('avatar', selectedFile);

                const uploadResponse = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/uploadAvatarProfile`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!uploadResponse.ok) {
                    alert("Lỗi khi upload ảnh đại diện!");
                    return;
                }

                const uploadResult = await uploadResponse.json();
                finalAvatarUrl = uploadResult.data.url; 
            }

            const registerResponse = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/login/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    display_name: displayName,
                    email: email,
                    avatar_url: finalAvatarUrl,
                    role_id: 0,    
                    bio: "Quản trị viên hệ thống"
                })
            });

            const registerResult = await registerResponse.json();

            if (registerResponse.ok) {
                alert("Tạo tài khoản Admin thành công!");
                
                // Reset form về rỗng sau khi tạo thành công
                setUsername("");
                setPassword("");
                setDisplayName("");
                setEmail("");
                setSelectedFile(undefined);
                setPreviewUrl("https://res.cloudinary.com/dd0yqxowo/image/upload/v1761823049/user-default_jxnvbw.jpg");
            } else {
                // Hiển thị lỗi từ Backend trả về (ví dụ: Tên đăng nhập đã tồn tại)
                alert(registerResult.message || "Đăng ký thất bại");
            }

        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            alert("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
        }
    }

    return (
        <div className="signup-admin">
            <div className="signup-container">
            
                <div className="signup-header">
                    <div className="icon-box">
                        <MdPersonAddAlt1 />
                    </div>
                    <div className="title-box">
                        <h3>Đăng ký tài khoản Admin</h3>
                        <p>Tạo tài khoản quản trị viên mới cho hệ thống</p>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="avatar-section">
                    <div className="avatar-wrapper" onClick={handleClickAddImg}>
                        <img src={previewUrl} alt="Avatar Preview" />
                        <div className="overlay">
                            <FaCamera />
                        </div>
                    </div>
                    <p className="avatar-label">Ảnh đại diện</p>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="form-grid">
                    <div className="input-group">
                        <label>Tên hiển thị <span className="required">*</span></label>
                        <input 
                            type="text" 
                            placeholder="Nhập tên hiển thị (VD: Admin Chính)"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className={errors.displayName ? "input-error" : ""}
                        />
                        {errors.displayName && <span className="error-message">{errors.displayName}</span>}
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Tên đăng nhập <span className="required">*</span></label>
                        <input 
                            type="text" 
                            placeholder="Nhập username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={errors.username ? "input-error" : ""}
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="input-group">
                        <label>Mật khẩu <span className="required">*</span></label>
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? "input-error" : ""}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="input-group">
                        <label>Nhập lại mật khẩu <span className="required">*</span></label>
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu"
                            value={passwordA}
                            onChange={(e) => setPasswordA(e.target.value)}
                            className={errors.password ? "input-error" : ""}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-submit" onClick={handleRegister}>
                        <MdPersonAddAlt1 /> Tạo tài khoản Admin
                    </button>
                </div>

            </div>
        </div>
    )
}

export default SignUpAdmin;