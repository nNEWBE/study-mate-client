import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Loader = (): JSX.Element => {
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowIcon((prev) => !prev);
    }, 3000); // Toggle between text and icon every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Study-related icons as SVG paths
  const studyIcons = [
    <svg key="pencil" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>,
    <svg key="cap" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>,
    <svg key="bulb" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>,
    <svg key="star" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>,
    <svg key="clock" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>,
    <svg key="bookmark" className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>,
  ];

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-secondary dark:via-secondary dark:to-secondary transition-colors duration-500">
      <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">

        {/* Outer rotating ring with gradient */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent, #00ffa5 40%, transparent 60%)",
            padding: "2px",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-secondary" />
        </motion.div>

        {/* Second ring - dashed, counter rotate */}
        <motion.div
          className="absolute w-[85%] h-[85%] rounded-full border-2 border-dashed border-secondary dark:border-primary shadow-[0_0_12px_rgba(0,255,165,0.6)] dark:shadow-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Third ring - solid */}
        <motion.div
          className="absolute w-[70%] h-[70%] rounded-full border-2 border-secondary dark:border-primary shadow-[0_0_12px_rgba(0,255,165,0.6)] dark:shadow-none"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbiting study icons */}
        {studyIcons.map((icon, index) => {
          const angle = (index * 360) / studyIcons.length;
          const radius = 42;

          return (
            <motion.div
              key={index}
              className="absolute w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute"
                style={{
                  top: `${50 - radius * Math.cos((angle * Math.PI) / 180)}%`,
                  left: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  rotate: -360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }
                }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg dark:bg-gradient-to-br bg-white dark:bg-transparent dark:from-primary/20 dark:to-primary/5 backdrop-blur-sm border border-secondary dark:border-primary/30 shadow-primary shadow-[0_0_8px_2px] dark:shadow-none flex items-center justify-center text-secondary dark:text-primary">
                  {icon}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Center content - Text transformation logic */}
        <motion.div
          className="relative z-10 flex items-center justify-center"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full dark:bg-primary/20 bg-white blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute w-[4.2rem] h-[4.2rem] sm:w-[5.5rem] sm:h-[5.5rem] rounded-xl border border-white dark:border-primary/20 "
            style={{ transform: "rotate(45deg)" }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-xl dark:bg-gradient-to-br bg-white dark:bg-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-md border-2 border-secondary dark:border-primary/25 shadow-[0_0_5px_2px] shadow-primary dark:shadow-primary/10"
            style={{ transform: "rotate(45deg)" }}
            animate={{
              rotate: [45, 45],
              scale: [1, 1.02, 1]
            }}
            transition={{
              rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          <AnimatePresence mode="wait">
            {!showIcon ? (
              <motion.div
                key="text"
                className="relative z-20 flex gap-1 font-bold font-anta text-2xl sm:text-3xl text-secondary dark:text-primary select-none "
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {["S", "M"].map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    variants={{
                      hidden: { opacity: 0, filter: "blur(15px)", x: 20 },
                      visible: {
                        opacity: 1,
                        filter: "blur(0px)",
                        x: 0,
                        transition: { duration: 0.6, ease: "easeOut", delay: i * 0.3 }
                      },
                      exit: {
                        opacity: 0,
                        filter: "blur(15px)",
                        scale: 0.9,
                        transition: { duration: 0.3 }
                      }
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="icon-container"
                className="relative z-20 flex items-center justify-center"
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-secondary dark:border-primary shadow-[0_0_10px_rgba(0,255,165,0.6)] dark:shadow-none"
                  initial={{ scale: 0, opacity: 1, borderWidth: "4px" }}
                  animate={{ scale: 2, opacity: 0, borderWidth: "0px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />

                <motion.svg
                  key="icon"
                  className="w-9 h-9 sm:w-10 sm:h-10 text-secondary dark:text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1
                  }}
                >
                  <motion.path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    initial={{ pathLength: 0, fill: "rgba(0, 255, 165, 0)" }}
                    animate={{ pathLength: 1, fill: "rgba(0, 255, 165, 0)" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />

                  <motion.polyline
                    points="14 2 14 8 20 8"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  />

                  <motion.line
                    x1="16" y1="13" x2="8" y2="13"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.4 }}
                  />
                  <motion.line
                    x1="16" y1="17" x2="8" y2="17"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  />

                  {/* Professional Certified Badge/Seal - Spin and Scale */}
                  <motion.g
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.4, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <circle cx="17" cy="18.5" r="4.5" className="fill-white dark:fill-secondary dark:stroke-primary stroke-secondary" strokeWidth="1.5" />
                    <path d="M15 18.5l1.5 1.5 3-3" strokeWidth="1.5" className="stroke-primary" />
                  </motion.g>
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
