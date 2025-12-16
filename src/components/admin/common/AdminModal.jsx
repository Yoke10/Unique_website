import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import '../layout/AdminLayout.css'; // Ensure we have access to admin vars

const AdminModal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            return;
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        full: 'max-w-6xl'
    };

    return (
        <div className="admin-modal-overlay">
            <div className={`admin-modal-container ${sizeClasses[size] || sizeClasses.medium}`}>
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">{title}</h3>
                    <button onClick={onClose} className="admin-modal-close">
                        <X size={20} />
                    </button>
                </div>
                <div className="admin-modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminModal;
