import "../../styles/style.css";
import { useState, useRef, MouseEvent, CSSProperties, ReactNode } from "react";
import { FaCheck, FaTimes, FaExclamation, FaInfo, FaQuestion, FaArrowRight } from "react-icons/fa";

export type ButtonVariant = "success" | "warning" | "error" | "info" | "confirm" | "cancel" | "default";

interface ModalButtonProps {
    variant?: ButtonVariant;
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    icon?: ReactNode;
    showDefaultIcon?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}

interface CustomCSSProperties extends CSSProperties {
    "--x"?: string;
    "--y"?: string;
    "--char-index"?: number;
    "--primary"?: string; // Override primary color for this button
}

interface VariantStyle {
    iconBg: string; // Tailwind class for icon background
    shadowColor: string; // Tailwind class for shadow
    fillColor: string; // Hex color for the hover fill effect
    icon: ReactNode;
}

const variantStyles: Record<ButtonVariant, VariantStyle> = {
    success: {
        iconBg: "bg-primary",
        shadowColor: "shadow-primary",
        fillColor: "#00ffa5",
        icon: <FaCheck className="text-xs" />,
    },
    warning: {
        iconBg: "bg-[#8B4513]",
        shadowColor: "shadow-[#8B4513]",
        fillColor: "#8B4513",
        icon: <FaExclamation className="text-xs" />,
    },
    error: {
        iconBg: "bg-red-600",
        shadowColor: "shadow-red-600",
        fillColor: "#dc2626",
        icon: <FaTimes className="text-xs" />,
    },
    info: {
        iconBg: "bg-slate-500",
        shadowColor: "shadow-slate-500",
        fillColor: "#64748b",
        icon: <FaInfo className="text-xs" />,
    },
    confirm: {
        iconBg: "bg-blue-600",
        shadowColor: "shadow-blue-600",
        fillColor: "#2563eb",
        icon: <FaQuestion className="text-xs" />,
    },
    cancel: {
        iconBg: "bg-gray-500",
        shadowColor: "shadow-gray-500",
        fillColor: "#6b7280",
        icon: <FaTimes className="text-xs" />,
    },
    default: {
        iconBg: "bg-primary",
        shadowColor: "shadow-primary",
        fillColor: "#00ffa5",
        icon: <FaArrowRight className="text-xs" />,
    },
};

const ModalButton = ({
    variant = "default",
    children,
    onClick,
    icon,
    showDefaultIcon = true,
    disabled = false,
    fullWidth = false,
    className = "",
}: ModalButtonProps): JSX.Element => {
    const styles = variantStyles[variant];
    const displayIcon = icon ?? (showDefaultIcon ? styles.icon : null);
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleMouse = (e: MouseEvent<HTMLButtonElement>): void => {
        const btn = btnRef.current;
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setX(e.clientX - rect.left);
            setY(e.clientY - rect.top);
        }
    };

    const buttonStyle: CustomCSSProperties = {
        "--x": `${x}px`,
        "--y": `${y}px`,
        "--primary": styles.fillColor, // Override the Css variable for the fill effect
    };

    // Convert children to string for char animation
    const text = typeof children === "string" ? children : "";
    const arr = text.split("");

    return (
        <button
            type="button"
            ref={btnRef}
            onClick={onClick}
            onMouseMove={handleMouse}
            disabled={disabled}
            style={buttonStyle}
            className={`
        button
        relative
        border-2 border-secondary
        bg-white
        shadow-[0_0_5px_2px] ${styles.shadowColor}
        ${fullWidth ? "w-full" : ""}
        h-full rounded-xl
        px-5 py-2
        font-poppins sm:text-lg font-bold
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
        ${className}
      `}
        >
            {/* Icon badge - inline with text */}
            {displayIcon && (
                <span
                    className={`
            relative z-10
            inline-flex items-center justify-center
            w-5 h-5 rounded-full
            ${styles.iconBg}
            text-white
            shadow-md
            mr-2
            align-middle
          `}
                >
                    {displayIcon}
                </span>
            )}

            {/* Button text with character animation - with extra overflow clipping */}
            <span className="inline-block align-middle">
                {arr.length > 0 ? (
                    arr.map((letter, index) => {
                        if (letter === " ") {
                            return " ";
                        }
                        const charStyle: CustomCSSProperties = { "--char-index": index };
                        return (
                            <span
                                key={index}
                                className="char"
                                data-char={letter}
                                style={charStyle}
                            >
                                {letter}
                            </span>
                        );
                    })
                ) : (
                    children
                )}
            </span>
        </button>
    );
};

export default ModalButton;
