import { motion } from "framer-motion";
import "../styles/style.css";

interface TextRevealProps {
  children: string;
  className?: string;
}

const TextReveal = ({ children, className }: TextRevealProps): JSX.Element => {
  // Split text into words
  const words = children.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: "120%",
      opacity: 0,
      rotate: 5,
      filter: "blur(4px)"
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.2, 0.65, 0.3, 0.9], // Smooth cubic bezier
      },
    },
  };

  return (
    <motion.div
      className={`font-edu sm:text-xl text-lg font-semibold text-center leading-relaxed text-secondary dark:text-white ${className || ""}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
            paddingBottom: "2px", // Space for descenders
            marginBottom: "-2px"
          }}
        >
          <motion.span
            variants={wordVariants}
            style={{ display: "inline-block", marginRight: "0.3em" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
