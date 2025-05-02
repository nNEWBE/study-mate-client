import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
const BackDrop = ({ children, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed left-0 top-0 z-[60] flex h-screen w-full items-center justify-center bg-black bg-opacity-50"
    >
      {children}
    </motion.div>
  );
};

export default BackDrop;
