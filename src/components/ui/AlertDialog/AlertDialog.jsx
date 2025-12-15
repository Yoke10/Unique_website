
import React from "react";
import { cn } from "../../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import "./AlertDialog.css";

// --- Context ---
const AlertDialogContext = React.createContext(undefined);

// --- AlertDialog Root ---
const AlertDialog = ({
    children,
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = React.useCallback(
        (value) => {
            const newValue = typeof value === "function" ? value(open) : value;

            if (!isControlled) {
                setUncontrolledOpen(newValue);
            }
            if (onOpenChange) {
                onOpenChange(newValue);
            }
        },
        [isControlled, onOpenChange, open]
    );

    return (
        <AlertDialogContext.Provider value={{ open, setOpen }}>
            {children}
        </AlertDialogContext.Provider>
    );
};

// --- Trigger ---
const AlertDialogTrigger = React.forwardRef(
    ({ children, asChild = false, onClick, ...props }, ref) => {
        const context = React.useContext(AlertDialogContext);
        if (!context) throw new Error("Trigger outside AlertDialog");
        const { setOpen } = context;

        const handleClick = (e) => {
            setOpen(true);
            if (onClick) onClick(e);
        };

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children, {
                ref,
                onClick: handleClick,
                ...props,
                ...children.props,
            });
        }

        return (
            <button ref={ref} type="button" onClick={handleClick} {...props}>
                {children}
            </button>
        );
    }
);
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// --- Portal & Overlay ---
const AlertDialogPortal = ({ children }) => <>{children}</>;

const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            className={cn("alert-dialog-overlay", className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            {...props}
        />
    );
});
AlertDialogOverlay.displayName = "AlertDialogOverlay";

// --- Content ---
const AlertDialogContent = React.forwardRef(
    ({ className, children, ...props }, ref) => {
        const context = React.useContext(AlertDialogContext);
        if (!context) throw new Error("Content outside AlertDialog");
        const { open, setOpen } = context;
        const contentRef = React.useRef(null);

        // Close on click outside
        React.useEffect(() => {
            if (!open) return;
            const handleClickOutside = (event) => {
                // Checking if click is on Overlay (which is behind content) or explicitly outside
                // Since Overlay covers screen, clicking it usually means "outside content"
                // But here we rely on the overlay's own click handler or just check ref containment
            };
            // We'll let Overlay implementation handle backdrop clicks usually, 
            // but provided code used a global mousedown listener.
            // Let's stick to the provided code logic of mousedown.

            const handleMouseDown = (event) => {
                if (contentRef.current && !contentRef.current.contains(event.target)) {
                    // We won't close on mouse down here to prevent accidental closes when dragging
                    // Instead, we might check on mouse up, but standard is often overlay click.
                    // For strict "click outside" logic:
                    setOpen(false)
                }
            }

            // Actually, standard modal behavior is clicking the overlay closes it.
            // The provided code attached a document listener. We will follow that.
            document.addEventListener("mousedown", handleMouseDown);
            return () => document.removeEventListener("mousedown", handleMouseDown);
        }, [open, setOpen]);


        return (
            <AnimatePresence>
                {open && (
                    <AlertDialogPortal>
                        <AlertDialogOverlay />
                        <motion.div
                            ref={(node) => {
                                if (typeof ref === "function") ref(node);
                                else if (ref) ref.current = node;
                                contentRef.current = node;
                            }}
                            className={cn("alert-dialog-content", className)}
                            initial={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
                            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                            exit={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            {...props}
                        >
                            {children}
                        </motion.div>
                    </AlertDialogPortal>
                )}
            </AnimatePresence>
        );
    }
);
AlertDialogContent.displayName = "AlertDialogContent";

// --- Header, Footer, Title, Description ---
const AlertDialogHeader = ({ className, ...props }) => (
    <div className={cn("alert-dialog-header", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }) => (
    <div className={cn("alert-dialog-footer", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("alert-dialog-title", className)} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = React.forwardRef(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("alert-dialog-description", className)}
            {...props}
        />
    )
);
AlertDialogDescription.displayName = "AlertDialogDescription";

// --- Actions (Buttons) ---
const AlertDialogAction = React.forwardRef(
    ({ className, onClick, ...props }, ref) => {
        const { setOpen } = React.useContext(AlertDialogContext);
        const handleClick = (e) => {
            setOpen(false);
            if (onClick) onClick(e);
        };
        return (
            <button
                ref={ref}
                className={cn("alert-dialog-action", className)}
                onClick={handleClick}
                {...props}
            />
        );
    }
);
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = React.forwardRef(
    ({ className, onClick, ...props }, ref) => {
        const { setOpen } = React.useContext(AlertDialogContext);
        const handleClick = (e) => {
            setOpen(false);
            if (onClick) onClick(e);
        };
        return (
            <button
                ref={ref}
                className={cn("alert-dialog-cancel", className)}
                onClick={handleClick}
                {...props}
            />
        );
    }
);
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
