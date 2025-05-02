import { motion } from "framer-motion";

const PageTransition = () => {
  return (
    <>
      <motion.div
        className="slide-in"
        intial={{ scaleY: 0 }}
        anumate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="slide-in"
        intial={{ scaleY: 1 }}
        anumate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
};

export default PageTransition;
