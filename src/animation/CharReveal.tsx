import { motion } from "framer-motion";

interface CharRevealProps {
    children: string;
    className?: string;
}

const CharReveal = ({ children, className }: CharRevealProps) => {
    const text = children.split("");

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const charVariants = {
        hidden: { y: "100%" },
        visible: {
            y: "0%",
            transition: {
                duration: 0.6,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };

    return (
        <motion.span
            className={className}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
            {text.map((char, index) => (
                <span
                    key={index}
                    style={{
                        display: "inline-block",
                        overflow: "hidden",
                        verticalAlign: "bottom", // Keeps text strictly on the baseline
                        lineHeight: 1.1, // Match heading line-height to prevents clipping
                        paddingBottom: "0.1em", // Safety for descenders
                        marginBottom: "-0.1em" // Compensate for padding
                    }}
                >
                    <motion.span
                        variants={charVariants}
                        style={{ display: "inline-block" }}
                        className={char === "." ? "text-primary" : ""}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
};

export default CharReveal;
