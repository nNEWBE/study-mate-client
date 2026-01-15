import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { MdError } from "react-icons/md";
import ModalButton from "./ModalButton";
import BackDrop from "./BackDrop";

interface GooglePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string, email?: string) => void;
    isLoading: boolean;
    userInfo: {
        name: string;
        email: string | null;
        photoURL: string;
        provider?: 'google' | 'github';
    } | null;
}

const GooglePasswordModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
    userInfo,
}: GooglePasswordModalProps) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isEmailRequired, setIsEmailRequired] = useState(false);

    // Initialize email state when modal opens
    if (isOpen && !userInfo?.email && !isEmailRequired) {
        setIsEmailRequired(true);
    }
    if (isOpen && userInfo?.email && isEmailRequired) {
        setIsEmailRequired(false);
    }

    const validateAndSubmit = () => {
        setError("");

        if (isEmailRequired) {
            if (!email) {
                setError("Email is required");
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError("Please enter a valid email address");
                return;
            }
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
            setError("Password must contain uppercase and lowercase letters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        onSubmit(password, isEmailRequired ? email : undefined);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateAndSubmit();
    };

    const handleClose = () => {
        if (!isLoading) {
            setPassword("");
            setConfirmPassword("");
            setEmail("");
            setError("");
            onClose();
        }
    };

    const modalVariants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 50,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: {
                duration: 0.2,
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

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <BackDrop onClick={handleClose}>
                    {/* Modal Content */}
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className={`
                            relative w-[90%] max-w-md
                            bg-white dark:bg-secondary
                            rounded-3xl
                            border-2 border-secondary dark:border-white dark:border-opacity-30
                            shadow-[0_0_5px_2px] shadow-primary
                            overflow-hidden
                        `}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.3}
                        data-modal-color="#00ffa5"
                    >
                        {/* Decorative corner accents */}
                        <div
                            className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at top right, #00ffa5, transparent 70%)`,
                            }}
                        />
                        <div
                            className="absolute bottom-0 left-0 w-32 h-32 opacity-10 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at bottom left, #00ffa5, transparent 70%)`,
                            }}
                        />

                        {/* Close button */}
                        <motion.button
                            onClick={handleClose}
                            disabled={isLoading}
                            className={`
                                absolute top-3 right-3 z-20 
                                p-1.5 rounded-xl
                                bg-white dark:bg-secondary
                                border-2 border-secondary dark:border-white dark:border-opacity-30
                                text-secondary dark:text-white
                                shadow-md
                                hover:bg-primary/20 dark:hover:text-white
                                transition-all duration-300
                                ${isLoading ? "cursor-not-allowed opacity-40" : ""}
                            `}
                            whileHover={isLoading ? {} : { scale: 1.1, rotate: 90 }}
                            whileTap={isLoading ? {} : { scale: 0.9 }}
                        >
                            <IoClose className="text-xl" />
                        </motion.button>

                        {/* Content container - Reduced padding for height */}
                        <div className="relative z-10 px-6 py-6 md:px-8 md:py-6">
                            {/* Icon with glow effect - Reduced margin */}
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    {/* Pulse ring */}
                                    <motion.div
                                        className="absolute inset-0 bg-primary rounded-full blur-xl opacity-40"
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

                                    {/* Icon container - Reduced size */}
                                    <motion.div
                                        className={`
                                            relative w-16 h-16 md:w-20 md:h-20
                                            bg-primary
                                            rounded-full
                                            flex items-center justify-center
                                            text-white
                                            border-2 border-secondary dark:border-white dark:border-opacity-30
                                            shadow-[0_0_15px_5px] shadow-primary/40
                                        `}
                                        variants={iconContainerVariants}
                                    >
                                        {userInfo?.provider === 'github' ? (
                                            <FaGithub className="text-2xl md:text-3xl text-secondary" />
                                        ) : (
                                            <FaGoogle className="text-2xl md:text-3xl text-secondary" />
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Title and description - Reduced margins */}
                            <motion.div
                                className="text-center mb-4"
                                variants={contentVariants}
                            >
                                <h2 className="font-dosis text-2xl md:text-3xl font-bold text-secondary dark:text-white mb-1">
                                    Complete <span className="text-primary">Registration</span>
                                </h2>
                                <p className="font-edu text-sm text-secondary/90 dark:text-white/70 font-semibold">
                                    Create a password to secure your account
                                </p>
                            </motion.div>

                            {/* User Info Card - Reduced padding/margin */}
                            {userInfo && !isEmailRequired && (
                                <motion.div
                                    className="mb-4 flex items-center gap-3 rounded-xl border-2 border-primary/30 bg-primary/10 p-3 shadow-[0_0_10px_0px] shadow-primary/10 relative overflow-hidden group"
                                    variants={contentVariants}
                                >
                                    <div className="relative">
                                        <img
                                            src={userInfo.photoURL}
                                            alt={userInfo.name}
                                            className="h-10 w-10 rounded-full border-2 border-primary object-cover shadow-[0_0_5px_2px] shadow-primary/30"
                                        />
                                        {/* Online indicator */}
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-primary dark:border-secondary" />
                                    </div>
                                    <div className="flex-1 min-w-0 z-10">
                                        <p className="font-dosis font-bold text-secondary dark:text-white truncate text-base">
                                            {userInfo.name}
                                        </p>
                                        <p className="font-edu text-xs text-secondary/80 dark:text-white/70 truncate font-semibold">
                                            {userInfo.email}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* User Info with Missing Email Header */}
                            {userInfo && isEmailRequired && (
                                <motion.div
                                    className="mb-4 flex items-center gap-3 justify-center text-center"
                                    variants={contentVariants}
                                >
                                    <div className="relative">
                                        <img
                                            src={userInfo.photoURL}
                                            alt={userInfo.name}
                                            className="h-16 w-16 rounded-full border-4 border-primary object-cover shadow-[0_0_10px_2px] shadow-primary/30 mb-2"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-dosis font-bold text-secondary dark:text-white text-lg">
                                            Hi, {userInfo.name}
                                        </p>
                                        <p className="font-edu text-xs text-secondary/70 dark:text-white/60">
                                            Please complete your profile
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Form - Compact spacing */}
                            <motion.form
                                onSubmit={handleSubmit}
                                className="space-y-3"
                                variants={contentVariants}
                            >
                                {isEmailRequired && (
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            disabled={isLoading}
                                            className={`
                                                w-full rounded-xl 
                                                border-2 border-primary bg-primary bg-opacity-25 
                                                px-4 py-2.5 
                                                font-semibold text-secondary 
                                                placeholder-secondary/70 
                                                outline-none 
                                                disabled:opacity-60 
                                                dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white/70
                                                focus:shadow-[0_0_15px_-3px] focus:shadow-primary/30
                                                transition-all duration-300
                                            `}
                                        />
                                    </div>
                                )}
                                {/* Password Field */}
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create Password"
                                        disabled={isLoading}
                                        className={`
                                            w-full rounded-xl 
                                            border-2 border-primary bg-primary bg-opacity-25 
                                            px-4 py-2.5 pr-12 
                                            font-semibold text-secondary 
                                            placeholder-secondary/70 
                                            outline-none 
                                            disabled:opacity-60 
                                            dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white/70
                                            focus:shadow-[0_0_15px_-3px] focus:shadow-primary/30
                                            transition-all duration-300
                                        `}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className={`absolute right-4 top-3 text-xl text-secondary dark:text-white hover:text-primary transition-colors ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="relative group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm Password"
                                        disabled={isLoading}
                                        className={`
                                            w-full rounded-xl 
                                            border-2 border-primary bg-primary bg-opacity-25 
                                            px-4 py-2.5 pr-12 
                                            font-semibold text-secondary 
                                            placeholder-secondary/70 
                                            outline-none 
                                            disabled:opacity-60 
                                            dark:border-white dark:border-opacity-[0.3] dark:bg-[rgba(255,255,255,.2)] dark:text-white dark:placeholder-white/70
                                            focus:shadow-[0_0_15px_-3px] focus:shadow-primary/30
                                            transition-all duration-300
                                        `}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                        className={`absolute right-4 top-3 text-xl text-secondary dark:text-white hover:text-primary transition-colors ${isLoading ? "cursor-not-allowed opacity-60" : ""}`}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 mt-1">
                                                <MdError className="text-base flex-shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Buttons */}
                                <div className="pt-1.5 flex flex-col sm:flex-row gap-3">
                                    <ModalButton
                                        variant="cancel"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </ModalButton>
                                    <ModalButton
                                        variant="success"
                                        onClick={validateAndSubmit}
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        Register
                                    </ModalButton>
                                </div>

                                {/* Hidden submit button to enable Enter key submission */}
                                <button type="submit" className="hidden" />
                            </motion.form>

                            {/* Footer note */}
                            <motion.p
                                className="mt-4 text-center text-[10px] text-secondary/60 dark:text-white/60 font-edu italic"
                                variants={contentVariants}
                            >
                                A password is required to secure your StudyMate account
                            </motion.p>
                        </div>
                    </motion.div>
                </BackDrop>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default GooglePasswordModal;
