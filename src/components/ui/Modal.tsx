import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode, createContext, useContext, useState, useCallback, useRef } from "react";
import BackDrop from "./BackDrop";
import ModalButton from "./ModalButton";
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
    FaInfoCircle,
    FaQuestionCircle
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export type ModalType = "success" | "warning" | "error" | "info" | "confirm";

interface ModalConfig {
    icon: ReactNode;
    iconBg: string;
    shadowColor: string; // Tailwind class for the shadow color
    accentColor: string; // Hex code for inline styles
    hoverBg: string; // Tailwind class for close button hover
}

interface ModalOptions {
    type: ModalType;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    children?: ReactNode;
}

interface ModalContextValue {
    showModal: (options: ModalOptions) => void;
    hideModal: () => void;
    isOpen: boolean;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const useModal = (): ModalContextValue => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

const modalConfigs: Record<ModalType, ModalConfig> = {
    success: {
        icon: <FaCheckCircle className="text-4xl md:text-5xl" />,
        iconBg: "bg-primary",
        shadowColor: "shadow-primary",
        accentColor: "#00ffa5",
        hoverBg: "hover:bg-primary",
    },
    warning: {
        icon: <FaExclamationTriangle className="text-4xl md:text-5xl" />,
        iconBg: "bg-[#8B4513]",
        shadowColor: "shadow-[#8B4513]",
        accentColor: "#8B4513",
        hoverBg: "hover:bg-[#8B4513]",
    },
    error: {
        icon: <FaTimesCircle className="text-4xl md:text-5xl" />,
        iconBg: "bg-red-600",
        shadowColor: "shadow-red-600",
        accentColor: "#dc2626",
        hoverBg: "hover:bg-red-600",
    },
    info: {
        icon: <FaInfoCircle className="text-4xl md:text-5xl" />,
        iconBg: "bg-slate-500",
        shadowColor: "shadow-slate-500",
        accentColor: "#64748b",
        hoverBg: "hover:bg-slate-500",
    },
    confirm: {
        icon: <FaQuestionCircle className="text-4xl md:text-5xl" />,
        iconBg: "bg-blue-600",
        shadowColor: "shadow-blue-600",
        accentColor: "#2563eb",
        hoverBg: "hover:bg-blue-600",
    },
};

const defaultTitles: Record<ModalType, string> = {
    success: "Success!",
    warning: "Warning!",
    error: "Error!",
    info: "Information",
    confirm: "Confirm Action",
};

const defaultMessages: Record<ModalType, string> = {
    success: "Your action was completed successfully.",
    warning: "Please proceed with caution.",
    error: "Something went wrong. Please try again.",
    info: "Here's some important information for you.",
    confirm: "Are you sure you want to proceed with this action?",
};

interface ModalContentProps {
    options: ModalOptions;
    onClose: () => void;
}

const ModalContent = ({ options, onClose }: ModalContentProps): JSX.Element => {
    const {
        type,
        title,
        message,
        confirmText = "Confirm",
        cancelText = "Cancel",
        showCancel = false,
        onConfirm,
        onCancel,
        children,
    } = options;

    const config = modalConfigs[type];
    const displayTitle = title ?? defaultTitles[type];
    const displayMessage = message ?? defaultMessages[type];

    const modalVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: "-100vh",
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: "100vh",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    };

    const iconContainerVariants: Variants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.2,
            },
        },
    };

    const contentVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: 0.3,
            },
        },
    };

    const handleConfirm = () => {
        onConfirm?.();
        onClose();
    };

    const handleCancel = () => {
        onCancel?.();
        onClose();
    };

    const isConfirmType = type === "confirm" || showCancel;

    return (
        <BackDrop onClick={onClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className={`
          relative w-[90%] max-w-md
          bg-white dark:bg-secondary
          rounded-3xl
          border-2 border-secondary dark:border-white dark:border-opacity-30
          shadow-[0_0_5px_2px] ${config.shadowColor}
          overflow-hidden
          font-poppins
        `}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.3}
                data-modal-color={config.accentColor}
            >

                {/* Decorative corner accents */}
                <div
                    className="absolute top-0 right-0 w-20 h-20 opacity-10"
                    style={{
                        background: `radial-gradient(circle at top right, ${config.accentColor}, transparent 70%)`,
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-20 h-20 opacity-10"
                    style={{
                        background: `radial-gradient(circle at bottom left, ${config.accentColor}, transparent 70%)`,
                    }}
                />

                {/* Close button */}
                <motion.button
                    onClick={onClose}
                    className={`
            absolute top-6 right-4 z-20 
            p-2 rounded-xl
            bg-white dark:bg-secondary
            border-2 border-secondary dark:border-white dark:border-opacity-30
            text-secondary dark:text-white
            shadow-[0_0_5px_2px] ${config.shadowColor}
            ${config.hoverBg}  dark:hover:text-white
            transition-all duration-300
          `}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <IoClose className="text-xl" />
                </motion.button>

                {/* Content container */}
                <div className="relative z-10 px-6 py-8 md:px-8 md:py-10">
                    {/* Icon with glow effect */}
                    <div className="flex justify-center mb-6" data-cursor="none">
                        <div className="relative">
                            {/* Pulse ring */}
                            <motion.div
                                className={`absolute inset-0 ${config.iconBg} rounded-full blur-xl opacity-40`}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.4, 0.6, 0.4],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Icon container - matching website style */}
                            <motion.div
                                className={`
                  relative w-20 h-20 md:w-24 md:h-24
                  ${config.iconBg}
                  rounded-full
                  flex items-center justify-center
                  text-white
                  border-2 border-secondary dark:border-white dark:border-opacity-30
                  shadow-[0_0_10px_3px] ${config.shadowColor}
                `}
                                variants={iconContainerVariants}
                            >
                                <motion.span
                                    animate={{
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {config.icon}
                                </motion.span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Title - styled like website headers */}
                    <motion.h2
                        className="
              text-2xl md:text-3xl font-bold text-center mb-3
              text-secondary dark:text-white
              font-dosis tracking-wide
            "
                        variants={contentVariants}
                    >
                        {displayTitle}
                    </motion.h2>

                    {/* Decorative divider */}
                    <motion.div
                        className="flex items-center justify-center mb-4"
                        variants={contentVariants}
                    >
                        <div className="flex-1 h-[2px] bg-secondary dark:bg-white dark:bg-opacity-30 max-w-16" />
                        <div
                            className="mx-3 w-3 h-3 rounded-full border-2 border-secondary dark:border-white dark:border-opacity-30"
                            style={{ backgroundColor: config.accentColor }}
                        />
                        <div className="flex-1 h-[2px] bg-secondary dark:bg-white dark:bg-opacity-30 max-w-16" />
                    </motion.div>

                    {/* Message */}
                    <motion.p
                        className="
              text-center text-secondary dark:text-gray-300 mb-6
              leading-relaxed font-edu text-lg
            "
                        variants={contentVariants}
                    >
                        {displayMessage}
                    </motion.p>

                    {/* Custom children content */}
                    {children && (
                        <motion.div
                            className="mb-6"
                            variants={contentVariants}
                        >
                            {children}
                        </motion.div>
                    )}

                    {/* Action buttons */}
                    <motion.div
                        className="flex gap-3 justify-center flex-wrap"
                        variants={contentVariants}
                    >
                        {isConfirmType ? (
                            <>
                                <ModalButton
                                    variant="cancel"
                                    onClick={handleCancel}
                                >
                                    {cancelText}
                                </ModalButton>
                                <ModalButton
                                    variant="confirm"
                                    onClick={handleConfirm}
                                >
                                    {confirmText}
                                </ModalButton>
                            </>
                        ) : (
                            <ModalButton
                                variant={type}
                                onClick={onClose}
                            >
                                {type === "error" ? "Try Again" : confirmText || "Got it!"}
                            </ModalButton>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </BackDrop>
    );
};

// Modal Provider Component
interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);
    const closeTimeoutRef = useRef<any>(null);

    const showModal = useCallback((options: ModalOptions) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setModalOptions(options);
        setIsOpen(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsOpen(false);
        // Clear options after animation completes
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
            setModalOptions(null);
            closeTimeoutRef.current = null;
        }, 300);
    }, []);

    return (
        <ModalContext.Provider value={{ showModal, hideModal, isOpen }}>
            {children}
            <AnimatePresence mode="wait">
                {isOpen && modalOptions && (
                    <ModalContent options={modalOptions} onClose={hideModal} />
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    );
};

// Direct Modal Component for standalone use
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ModalType;
    title?: string;
    message?: string;
    children?: ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
}

const Modal = ({
    isOpen,
    onClose,
    type,
    title,
    message,
    children,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    showCancel = false,
}: ModalProps): JSX.Element => {
    const options: ModalOptions = {
        type,
        title,
        message,
        confirmText,
        cancelText,
        showCancel,
        onConfirm,
        onCancel,
        children,
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && <ModalContent options={options} onClose={onClose} />}
        </AnimatePresence>
    );
};

export default Modal;
