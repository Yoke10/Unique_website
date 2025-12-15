import React, { useEffect, useRef, useState } from 'react';
import './GlowingCards.css';

// Simple utility to merge class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

export const GlowingCard = ({
    children,
    className,
    glowColor = "#3b82f6",
    hoverEffect = true,
    ...props
}) => {
    return (
        <div
            className={cn(
                "glowing-card",
                className
            )}
            style={{
                '--glow-color': glowColor,
            }}
            {...props}
        >
            {children}
        </div>
    );
};

export const GlowingCards = ({
    children,
    className,
    enableGlow = true,
    glowRadius = 25,
    glowOpacity = 1,
    animationDuration = 400,
    enableHover = true,
    gap = "2.5rem",
    maxWidth = "75rem",
    padding = "3rem 1.5rem",
    backgroundColor,
    borderRadius = "1rem",
    responsive = true,
    customTheme,
}) => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const overlay = overlayRef.current;

        if (!container || !overlay || !enableGlow) return;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setMousePosition({ x, y });
            setShowOverlay(true);

            overlay.style.setProperty('--x', x + 'px');
            overlay.style.setProperty('--y', y + 'px');
            overlay.style.setProperty('--opacity', glowOpacity.toString());
        };

        const handleMouseLeave = () => {
            setShowOverlay(false);
            overlay.style.setProperty('--opacity', '0');
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [enableGlow, glowOpacity]);

    const containerStyle = {
        '--gap': gap,
        '--max-width': maxWidth,
        '--padding': padding,
        '--border-radius': borderRadius,
        '--animation-duration': animationDuration + 'ms',
        '--glow-radius': glowRadius + 'rem',
        '--glow-opacity': glowOpacity,
        backgroundColor: backgroundColor || undefined,
        ...customTheme,
    };

    return (
        <div
            className={cn("glowing-cards-main", className)}
            style={containerStyle}
        >
            <div
                ref={containerRef}
                className="glowing-cards-inner"
                style={{ padding: "var(--padding)" }}
            >
                <div
                    className={cn(
                        "glowing-cards-grid",
                        responsive && "responsive"
                    )}
                >
                    {children}
                </div>

                {enableGlow && (
                    <div
                        ref={overlayRef}
                        className="glowing-cards-overlay"
                        style={{
                            WebkitMask:
                                "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
                            mask:
                                "radial-gradient(var(--glow-radius) var(--glow-radius) at var(--x, 0) var(--y, 0), #000 1%, transparent 50%)",
                            opacity: showOverlay ? 'var(--opacity)' : '0',
                        }}
                    >
                        <div
                            className={cn(
                                "glowing-cards-grid",
                                responsive && "responsive"
                            )}
                            style={{ padding: "var(--padding)" }}
                        >
                            {React.Children.map(children, (child) => {
                                if (React.isValidElement(child) && child.type === GlowingCard) {
                                    const cardGlowColor = child.props.glowColor || "#3b82f6";
                                    return React.cloneElement(child, {
                                        className: cn(
                                            child.props.className,
                                            // We don't have Tailwind, so we trust standard CSS or inline styles below to handle the look
                                        ),
                                        style: {
                                            ...child.props.style,
                                            backgroundColor: cardGlowColor + "15", // Hex alpha 15 ~ 8% opacity? No, 15 is hex 21/255 -> 8%.
                                            borderColor: cardGlowColor,
                                            boxShadow: "0 0 0 1px inset " + cardGlowColor,
                                        },
                                        // Disable hover effect on the clone
                                        hoverEffect: false
                                    });
                                }
                                return child;
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlowingCards;
