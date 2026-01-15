import { motion } from "framer-motion";

interface DividerProps {
    className?: string;
    orbSize?: "sm" | "md" | "lg";
    lineWidth?: string;
    animate?: boolean;
}

const Divider = ({
    className = "",
    orbSize = "sm",
    lineWidth = "max-w-32",
    animate = true,
}: DividerProps): JSX.Element => {
    const orbSizes = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-6 h-6",
    };

    const content = (
        <>
            {/* Left gradient line */}
            <div className={`flex-1 h-[2px] w-full ${lineWidth} bg-gradient-to-l from-primary to-transparent rounded-full`} />

            {/* Center orb */}
            <div className={`${orbSizes[orbSize]} mx-3 rounded-full bg-white border-2 border-secondary shadow-[0_0_5px_2px_#00ffa5]`} />

            {/* Right gradient line */}
            <div className={`flex-1 h-[2px] w-full ${lineWidth} bg-gradient-to-r from-primary to-transparent rounded-full`} />
        </>
    );

    if (animate) {
        return (
            <motion.div
                className={`flex items-center justify-center w-full my-6 ${className}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                {content}
            </motion.div>
        );
    }

    return (
        <div className={`flex items-center justify-center w-full my-6 ${className}`}>
            {content}
        </div>
    );
};

export default Divider;
