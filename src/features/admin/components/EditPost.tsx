import { useEffect, useRef, useState } from "react";
import type { typeUser } from "../../../types/user"
import { IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { FaImages } from "react-icons/fa";
import type { typePost } from "../../../types/post";

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

function EditPost(
    { 
        setEditing,
        dataUser,
        setRefreshKey,
        dataPost
    } : 
    { 
        setEditing: React.Dispatch<React.SetStateAction<boolean>>,
        dataUser: typeUser | undefined,
        // onPostSuccess: () => void;
        setRefreshKey: React.Dispatch<React.SetStateAction<number>>,
        dataPost: typePost | undefined
    } 
) {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[] | undefined>(dataPost?.image_url);
    const [content, setContent] = useState<string | undefined | null>(dataPost?.content);
    const [oldImages, setOldImages] = useState<string[]>(dataPost?.image_url || []);

    function handleClose() {
        setEditing((prev) => !prev);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleImageClick() {
        fileInputRef.current?.click();
    }

    useEffect(() => {
        if (selectedFiles.length === 0) {
            setPreviewUrls([]);
            return;
        }

        // Tạo object URL cho các file mới
        const objectUrls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(objectUrls);

        // Cleanup để tránh tràn bộ nhớ
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };

    }, [selectedFiles]);

    function handleRemoveImage(type: 'OLD' | 'NEW', index: number) {
        if (type === 'OLD') {
            setOldImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        }
    }

    async function handleEdit() {
        const token = localStorage.getItem('authToken');
        try {
            let finalImageUrls: string[] = [...oldImages];
            if (selectedFiles.length > 0) {
                const uploadFormData = new FormData();
                
                selectedFiles.forEach(file => {
                    uploadFormData.append('images', file); 
                });

                const uploadResponse = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/uploadImg`, { 
                    method: 'POST',
                    headers: {
                        'authorization': `Bearer ${token}`
                    },
                    body: uploadFormData
                });

                if (!uploadResponse.ok) {
                    throw new Error("Lỗi khi upload ảnh mới");
                }

                const uploadResult = await uploadResponse.json();
                
                if (uploadResult.data && Array.isArray(uploadResult.data)) {
                    const newUrls = uploadResult.data.map((item: any) => item.url);
                    
                    finalImageUrls = [...finalImageUrls, ...newUrls];
                }
            }

            const updateResponse = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/posts/updatePost/${dataPost?.post_id}`, {
                method: 'PUT',
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    image_url: finalImageUrls
                })
            });

            if (updateResponse.ok) {
                alert("Cập nhật bài viết thành công!");
                setEditing(false); // Đóng popup
                setRefreshKey(prev => prev + 1); // Refresh lại list bài viết
            } else {
                const errorData = await updateResponse.json();
                alert(`Cập nhật thất bại: ${errorData.message}`);
            }

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra trong quá trình xử lý");
        }
    }

    return (
        <div className="home-post">
            <div className="home-post-container">
                <div className="home-post-header">
                    Sửa bài viết
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
                            value={ content??'' }
                            onChange={ (e) => setContent(e.target.value) }
                        />
                    </div>

                    { (oldImages.length > 0 || (previewUrls?.length ?? 0) > 0) && (
                        <div className="home-post-main-preview-img">
                            
                            {oldImages.map((url, index) => (
                                <div key={`old-${index}`} className="preview-item">
                                    <img src={url} />
                                    <IoMdCloseCircle
                                        className="icon" 
                                        onClick={() => handleRemoveImage('OLD', index)}
                                    />
                                </div>
                            ))}

                            {previewUrls?.map((url, index) => (
                                <div key={`new-${index}`} className="preview-item">
                                    <img src={url} />
                                    <IoMdCloseCircle
                                        className="icon" 
                                        onClick={() => handleRemoveImage('NEW', index)}
                                    />
                                </div>
                            ))}
                            
                        </div>
                    )}

                    {/* {
                        previewUrls?.length??0 > 0 ?
                        <div className="home-post-main-preview-img">
                            {
                                previewUrls?.map((url, index) => {
                                    return (
                                        <div className="preview-item">
                                            <img src={url} />
                                            <IoMdCloseCircle
                                                className="icon" 
                                                onClick={() => handleRemoveImage(index)}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div> :
                        ''
                    } */}
                    {/* <div className="home-post-main-preview-img">
                        {
                            previewUrls?.map((url, index) => {
                                return (
                                    <div className="preview-item">
                                        <img src={url} />
                                        <IoMdCloseCircle
                                            className="icon" 
                                            onClick={() => handleRemoveImage(index)}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div> */}
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
                        onClick={ handleEdit }
                    >
                        Lưu
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditPost
