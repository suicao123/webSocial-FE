import React from 'react';
import './LockModal.scss'; 
import type { LockModalProps } from '../../../types/user';


const LockModal: React.FC<LockModalProps> = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-icon">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                
                <h3 className="modal-title">Tài Khoản Bị Khóa</h3>
                
                <p className="modal-message">{message}</p>
                
                <button onClick={onClose} className="modal-btn">
                    Tôi Đã Hiểu
                </button>
            </div>
        </div>
    );
};

export default LockModal;