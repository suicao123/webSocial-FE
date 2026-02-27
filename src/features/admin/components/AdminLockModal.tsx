import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import './AdminLockModal.scss';
import ToastMessage from '../../../components/common/ToastMessage';

const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || 'http';
const HOST = import.meta.env.VITE_API_HOST || 'localhost';
const PORT = import.meta.env.VITE_API_PORT || '8080';

interface AdminLockModalProps {
    isOpen: boolean;
    userId: number | null;
    onClose: () => void;
    onSuccess: () => void;
    toast: any;
    setToast: any;
}

const AdminLockModal: React.FC<AdminLockModalProps> = ({ isOpen, userId, onClose, onSuccess, toast, setToast }) => {
    const [duration, setDuration] = useState<string>('1_week');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!isOpen || !userId) return null;

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${PROTOCOL}://${HOST}:${PORT}/api/v1/users/lockUser/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ duration })
            });

            const data = await response.json();

            if (response.ok) {
                // alert("Đã khóa tài khoản thành công!");
                setToast({ isOpen: true, message: data.message || "Đã khóa thành công!!!", type: 'success' });
                onSuccess();
                onClose();
            } else {
                // alert(data.message || "Lỗi khi khóa tài khoản");
                setToast({ isOpen: true, message: data.message || "Đã khóa Thất bại!!!", type: 'success' });
            }
        } catch (error) {
            console.error("Lỗi khóa:", error);
            alert("Lỗi kết nối server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="lock-modal-overlay">
            <ToastMessage
                isOpen={toast.isOpen}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, isOpen: false })}
            />
            <div className="lock-modal-content">
                <div className="modal-body">
                    <div className="icon-warning">
                        <FaLock />
                    </div>
                    
                    <h3>Khóa Tài Khoản</h3>
                    <p>Người dùng này sẽ không thể đăng nhập trong thời gian bị phạt.</p>

                    <div className="select-group">
                        <label>Chọn thời gian khóa:</label>
                        <select 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="1_week">Khóa 1 tuần</option>
                            <option value="1_month">Khóa 1 tháng</option>
                            <option value="3_months">Khóa 3 tháng</option>
                            <option value="6_months">Khóa 6 tháng</option>
                            <option value="9_months">Khóa 9 tháng</option>
                            <option value="1_year">Khóa 1 năm</option>
                            <option value="permanent">Khóa vĩnh viễn</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button 
                            className="btn-cancel" 
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            className="btn-confirm" 
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận khóa'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLockModal;