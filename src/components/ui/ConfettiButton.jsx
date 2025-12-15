import React, { useEffect, useState, useRef } from "react";
import confetti from 'canvas-confetti';
import './ConfettiButton.css';

const ConfettiButton = ({
    children,
    className = "",
    variant = "gradient", // default, outline, gradient, ghost
    size = "default", // sm, default, lg
    icon,
    iconPosition = "left",
    loading = false,
    confettiOptions = {
        particleCount: 100,
        spread: 70,
    },
    autoConfetti = false,
    triggerOnHover = false,
    onClick,
    ...props
}) => {
    const buttonRef = useRef(null);

    // Auto confetti on mount if needed
    useEffect(() => {
        if (autoConfetti && buttonRef.current) {
            triggerConfetti();
        }
    }, [autoConfetti]);

    const triggerConfetti = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                ...confettiOptions,
                origin: { x, y },
            });
        }
    };

    const handleClick = (e) => {
        triggerConfetti();
        if (onClick) {
            onClick(e);
        }
    };

    const handleMouseEnter = () => {
        if (triggerOnHover) {
            triggerConfetti();
        }
    };

    // Determine classes based on props
    const baseClasses = "confetti-btn";
    const variantClass = `confetti-btn-${variant}`;
    const sizeClass = `confetti-btn-${size}`;
    const loadingClass = loading ? "confetti-btn-loading" : "";

    const combinedClasses = [
        baseClasses,
        variantClass,
        sizeClass,
        loadingClass,
        className
    ].join(" ").trim();

    return (
        <button
            ref={buttonRef}
            className={combinedClasses}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && <span className="confetti-spinner"></span>}

            {!loading && icon && iconPosition === "left" && (
                <span className="confetti-icon left">{icon}</span>
            )}

            {children}

            {!loading && icon && iconPosition === "right" && (
                <span className="confetti-icon right">{icon}</span>
            )}
        </button>
    );
};

export default ConfettiButton;
