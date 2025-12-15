import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext({});

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback(({ title, description, variant = 'default', duration = 5000, action }) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { id, title, description, variant, duration, action };

        setToasts((prev) => [...prev, newToast]);

        return {
            id,
            dismiss: () => removeToast(id),
            update: (props) => updateToast(id, props)
        };
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const updateToast = useCallback((id, props) => {
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...props } : t)));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, removeToast, toasts }}>
            {children}
            {/* Render Toaster here or separate component? Let's render here for simplicity or export a Toaster */}
            {/* Actually, separation is cleaner if user wants to place Toaster elsewhere, but usually it's at root. */}
        </ToastContext.Provider>
    );
};

export const Toaster = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-viewport">
            {toasts.map((t) => (
                <Toast
                    key={t.id}
                    {...t}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};
