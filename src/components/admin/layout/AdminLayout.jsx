import React from 'react';
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = ({
    children,
    activeSection,
    onNavigate,
    user,
    onLogout,
    storageUsage,
    onClearData
}) => {
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <div className="mobile-header">
                <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <span className="mobile-title">Admin Panel</span>
            </div>

            <Sidebar
                activeSection={activeSection}
                onNavigate={(id) => { onNavigate(id); setSidebarOpen(false); }}
                user={user}
                onLogout={onLogout}
                storageUsage={storageUsage}
                onClearData={onClearData}
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Overlay for mobile */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

            <main className="admin-main-content">
                <div className="content-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
