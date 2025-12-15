import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react'; // Icons
import './Toast.css';

const Toast = ({
    id,
    variant = "default",
    title,
    description,
    duration = 5000,
    onClose,
    action
}) => {
    const [progress, setProgress] = useState(100);
    const [isClosing, setIsClosing] = useState(false);
    const startTimeRef = useRef(Date.now());
    const remainingRef = useRef(duration);
    const timerRef = useRef(null);
    const progressIntervalRef = useRef(null);

    const pauseTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        remainingRef.current -= Date.now() - startTimeRef.current;
    };

    const startTimer = () => {
        if (remainingRef.current <= 0) return;

        startTimeRef.current = Date.now();

        // Timer to close
        timerRef.current = setTimeout(() => {
            handleClose();
        }, remainingRef.current);

        // Interval for progress bar
        const totalDuration = duration;
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const currentRemaining = remainingRef.current - elapsed;
            const percentage = (currentRemaining / totalDuration) * 100;

            setProgress(Math.max(0, percentage));

            if (currentRemaining <= 0) {
                clearInterval(progressIntervalRef.current);
            }
        }, 16); // ~60fps
    };

    useEffect(() => {
        startTimer();
        return () => {
            pauseTimer();
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        // Wait for animation to finish before actual remove
        setTimeout(() => {
            onClose(id);
        }, 150);
    };

    const getIcon = () => {
        switch (variant) {
            case 'success': return <CheckCircle size={20} />;
            case 'destructive': return <AlertOctagon size={20} />;
            case 'warning': return <AlertTriangle size={20} />;
            case 'info': return <Info size={20} />;
            default: return null;
        }
    };

    return (
        <div
            className={`toast toast-${variant}`}
            data-state={isClosing ? 'closed' : 'open'}
            onMouseEnter={pauseTimer}
            onMouseLeave={startTimer}
            role="alert"
        >
            <div className="toast-content" style={{ display: 'flex', gap: '12px' }}>
                {variant !== 'default' && <div style={{ marginTop: '2px' }}>{getIcon()}</div>}

                <div style={{ flex: 1 }}>
                    {title && <div className="toast-title">{title}</div>}
                    {description && <div className="toast-description">{description}</div>}
                    {action && <div className="toast-action" style={{ marginTop: '8px' }}>{action}</div>}
                </div>
            </div>

            <button
                onClick={handleClose}
                className="toast-close"
                aria-label="Close"
            >
                <X size={16} />
            </button>

            <div className="toast-progress-bar">
                <div
                    className="toast-progress-indicator"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default Toast;
