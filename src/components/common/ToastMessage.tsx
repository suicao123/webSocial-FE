import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './ToastMessage.scss';

interface ToastMessageProps {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ isOpen, message, type, onClose }) => {
    
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="toast-container">
            <div className={`toast ${type}`}>
                {type === 'success' ? (
                    <FaCheckCircle className="toast-icon success" />
                ) : (
                    <FaExclamationCircle className="toast-icon error" />
                )}
                
                <div className="toast-content">{message}</div>
                
                <div className={`progress-bar ${type}`}></div>
            </div>
        </div>
    );
};

export default ToastMessage;