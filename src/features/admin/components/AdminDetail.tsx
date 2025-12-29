
import { FaTimes } from 'react-icons/fa';
import type { typeViewListData } from '../../../types/user';

function AdminDetail(
    {
        admin,
        setWatching
    } :
    {
        admin: typeViewListData | undefined,
        setWatching: React.Dispatch<React.SetStateAction<boolean>>
    }
) {
    if (!admin) return null;

    // Hàm đóng popup khi bấm nút Close hoặc bấm ra ngoài nền
    const handleClose = () => {
        setWatching(false);
    }

    return (
        <div className="admin-detail-overlay" onClick={handleClose}>
            <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <div className="header-text">
                        <h3>Chi tiết Admin</h3>
                        <p>Thông tin chi tiết về tài khoản quản trị</p>
                    </div>
                    <button className="close-btn" onClick={handleClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="divider"></div>

                <div className="modal-body">
                    <div className="user-intro">
                        <img 
                            src={admin.avatar || "https://via.placeholder.com/150"} 
                            alt={admin.name} 
                            className="avatar-large" 
                        />
                        <div className="user-info">
                            <h4 className="user-name">{admin.name}</h4>
                            <p className="user-email">{admin.email}</p>
                        </div>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <label>Ngày tạo</label>
                            <span>{admin.joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetail;