import { useRef, ReactElement } from "react";
import { motion, useInView } from "framer-motion";

interface RevealProps {
  children: ReactElement;
  width?: "fit-content" | "100%";
}

const Reveal = ({ children, width = "fit-content" }: RevealProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {children}
      </motion.div>

      <motion.div
        initial={{ left: 0 }}
        animate={isInView ? { left: "100%" } : { left: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          background: "#00ffa5",
        }}
      />
    </div>
  );
};

export default Reveal;
