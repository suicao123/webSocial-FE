import { IoMdClose } from "react-icons/io"
import type { payload, typeUser } from "../../../types/user";
import { useEffect, useRef, useState } from "react";
import { FaImages } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function HomePost( 
    { 
        setPosting,
        dataUser,
        setRefreshKey,
    } : 
    { 
        setPosting: React.Dispatch<React.SetStateAction<boolean>>,
        dataUser: typeUser | undefined,
        // onPostSuccess: () => void;
        setRefreshKey: React.Dispatch<React.SetStateAction<number>>,
    } 
) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [content, setContent] = useState<string>('');

    function handleClose() {
        setPosting((prev) => !prev);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    }

    function handleImageClick() {
        fileInputRef.current?.click();
    }

    async function handlePost() {
        if(content === '' && selectedFiles.length === 0) {
            alert('Vui lòng nhập nội dung cho bài viết!!!');
            return;
        }

        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.');
            return;
        }

        try {
            let uploadedImageUrls = [];

            if(selectedFiles.length !== 0) {
                const formData = new FormData();

                formData.append('content', content);
                selectedFiles.forEach(file => {
                    formData.append('images', file);
                });

                console.log(formData);
                

                const uploadRes = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/uploadImg`, {
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

                const uploadData = await uploadRes.json();

                uploadedImageUrls = uploadData.data.map((img: { url: string }) => img.url);
            }

            const user = jwtDecode<payload>(token);

            const posted = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user.user_id,
                    content: content,
                    image_url: uploadedImageUrls
                })
            });


            if(posted.ok) {

                // const completePost = {
                //     ...data,
                    
                //     // 1. Map thông tin User vào đúng cái tên biến dài loằng ngoằng kia
                //     users_posts_user_idTousers: {
                //         user_id: dataUser?.user_id,
                //         display_name: dataUser?.display_name,
                //         avatar_url: dataUser?.avatar_url
                //     },

                //     // 2. Khởi tạo bộ đếm like/comment bằng 0 để không bị lỗi undefined
                //     _count: {
                //         post_likes: 0,
                //         comments: 0
                //     },

                //     // 3. Đảm bảo image_url luôn là mảng (backend trả về null thì mình ép về [])
                //     image_url: data.image_url || [] 
                // };
                // onPostSuccess();
                setRefreshKey(prev => prev += 1);
                
                alert('Đăng bài thành công!!!');
            }
            else {
                alert('Đăng bài thất bại!!!');
            }

            setPosting((prev) => !prev);

        }
        catch (error) {
            alert("Đã xảy ra lỗi.");
        }
    }
    
    useEffect(() => {
        if(selectedFiles.length === 0) {
            setPreviewUrls([]);
            return;
        }

        const objectUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(objectUrls);
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };

    }, [selectedFiles]);
    

    return (
        <div className="home-post">
            <div className="home-post-container">
                <div className="home-post-header">
                    Tạo bài viết
                    <IoMdClose
                        className="icon"
                        onClick={ handleClose }
                    />
                </div>
                <div className="line"></div>
                <div className="home-post-main">
                    <div className="home-post-main-header">
                        <img src={dataUser?.avatar_url || 'https://res.cloudinary.com/dd0yqxowo/image/upload/v1761823049/user-default_jxnvbw.jpg'} />
                        <p>{dataUser?.display_name || 'test'}</p>
                    </div>
                    <div className="home-post-main-area">
                        <textarea 
                            placeholder="Bạn đang nghỉ gì?"
                            value={ content }
                            onChange={ (e) => setContent(e.target.value) }
                        />
                    </div>
                    {
                        selectedFiles.length > 0 ?
                        <div className="home-post-main-preview-img">
                            {
                                previewUrls.map(url => {
                                    return (
                                        <img src={url} />
                                    )
                                })
                            }
                        </div> :
                        ''
                    }
                    <div className="home-post-main-img">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={ handleFileChange }
                        />
                        <FaImages 
                            className="icon"
                            onClick={ handleImageClick }
                        />
                    </div>
                    <div 
                        className="home-post-main-button"
                        onClick={ handlePost }
                    >
                        Đăng bài
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePost
