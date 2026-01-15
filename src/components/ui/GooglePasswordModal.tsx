import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { MdError } from "react-icons/md";
import Button from "./Button";

interface GooglePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (password: string) => void;
    isLoading: boolean;
    userInfo: {
        name: string;
        email: string;
        photoURL: string;
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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

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

        onSubmit(password);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative mx-4 w-full max-w-md rounded-2xl border-2 border-primary bg-white p-6 shadow-[0_0_20px_5px] shadow-primary/30 dark:bg-secondary"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-2xl text-secondary transition-colors hover:text-primary dark:text-white"
                    >
                        <FiX />
                    </button>

                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h2 className="font-dosis text-2xl font-bold text-secondary dark:text-white">
                            Complete Your<span className="text-primary"> Registration</span>
                        </h2>
                        <p className="mt-2 font-edu text-sm text-secondary/70 dark:text-white/70">
                            Create a password to secure your account
                        </p>
                    </div>

                    {/* User Info */}
                    {userInfo && (
                        <div className="mb-6 flex items-center gap-4 rounded-xl border-2 border-primary/30 bg-primary/10 p-4">
                            <img
                                src={userInfo.photoURL}
                                alt={userInfo.name}
                                className="h-14 w-14 rounded-full border-2 border-primary object-cover"
                            />
                            <div>
                                <p className="font-dosis font-bold text-secondary dark:text-white">
                                    {userInfo.name}
                                </p>
                                <p className="font-edu text-sm text-secondary/70 dark:text-white/70">
                                    {userInfo.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create Password"
                                className="w-full rounded-xl border-2 border-primary bg-primary/10 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary/50 outline-none focus:shadow-[0_0_10px_2px] focus:shadow-primary/30 dark:bg-white/10 dark:text-white dark:placeholder-white/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3 text-2xl text-secondary dark:text-white"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full rounded-xl border-2 border-primary bg-primary/10 px-4 py-3 pr-12 font-semibold text-secondary placeholder-secondary/50 outline-none focus:shadow-[0_0_10px_2px] focus:shadow-primary/30 dark:bg-white/10 dark:text-white dark:placeholder-white/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-3 text-2xl text-secondary dark:text-white"
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-1 text-sm text-red-500">
                                <MdError />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                str={isLoading ? "Creating Account..." : "Complete Registration"}
                                shadow={true}
                                disabled={isLoading}
                            />
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GooglePasswordModal;
