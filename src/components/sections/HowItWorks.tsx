import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Reveal from "../../animation/Reveal";
import TextScramble from "../../animation/TextScramble";
import Unhidden from "../../animation/Unhidden";
import TextReveal from "../../animation/TextReveal";
import { FaUserPlus, FaBookOpen, FaTasks, FaCheckCircle } from "react-icons/fa";

interface Step {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const steps: Step[] = [
    {
        id: 1,
        icon: <FaUserPlus className="text-4xl" />,
        title: "Sign Up",
        description:
            "Create your account in seconds and join our learning community",
    },
    {
        id: 2,
        icon: <FaBookOpen className="text-4xl" />,
        title: "Explore",
        description:
            "Browse through various assignments and study materials",
    },
    {
        id: 3,
        icon: <FaTasks className="text-4xl" />,
        title: "Complete",
        description:
            "Work on assignments and submit them before deadlines",
    },
    {
        id: 4,
        icon: <FaCheckCircle className="text-4xl" />,
        title: "Get Feedback",
        description:
            "Receive grades and feedback to improve your skills",
    },
];

const HowItWorks = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const dashedContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.5,
            },
        },
    };

    const dashedSegmentVariants = {
        hidden: { opacity: 0, scaleX: 0 },
        visible: {
            opacity: 1,
            scaleX: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="w-full bg-white pt-32 dark:bg-secondary" id="HowItWorks">
            <div className="mx-auto w-[90%] max-w-7xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="flex justify-center">
                        <Reveal>
                            <TextScramble>How It Works</TextScramble>
                        </Reveal>
                    </div>
                    <div className="relative mx-auto sm:w-3/4 lg:w-[45%]">
                        <Unhidden>
                            <TextReveal>
                                Get started with Study Mate in just a few simple steps and
                                transform your learning experience.
                            </TextReveal>
                        </Unhidden>
                    </div>
                </div>

                {/* Steps */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="relative"
                >
                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                variants={itemVariants}
                                className="group relative flex flex-col items-center text-center"
                            >
                                {/* Desktop Connection Line (Segmented) */}
                                {index < steps.length - 1 && (
                                    <div className="absolute left-[calc(50%+4.5rem)] top-12 hidden h-1 w-[calc(100%-7rem)] -translate-y-1/2 items-center lg:flex">

                                        {/* Start Circle */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={inView ? { scale: 1 } : { scale: 0 }}
                                            transition={{ duration: 0.3, delay: 0.5 + (index * 0.3) }}
                                            className="absolute -left-1 z-10 h-3 w-3 rounded-full border-2 border-secondary bg-white dark:border-primary dark:bg-secondary shadow-[0_0_10px_2px] shadow-primary"
                                        />

                                        {/* The Line Segment */}
                                        <div className="relative h-[2px] w-full bg-gray-200 dark:bg-gray-700">
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                                                transition={{ duration: 0.8, delay: 0.5 + (index * 0.3) + 0.2, ease: "easeInOut" }}
                                                className="absolute inset-0 origin-left shadow-[0_0_10px_2px] shadow-primary bg-secondary dark:bg-primary"
                                            />
                                        </div>

                                        {/* End Circle */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={inView ? { scale: 1 } : { scale: 0 }}
                                            transition={{ duration: 0.3, delay: 0.5 + (index * 0.3) + 1 }} // Appears after line fills
                                            className="absolute -right-1 z-10 h-3 w-3 rounded-full border-2 border-secondary bg-white dark:border-primary shadow-[0_0_10px_2px] shadow-primary dark:bg-secondary"
                                        />
                                    </div>
                                )}
                                {/* Step Number Circle */}
                                <div className="relative mb-10">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative cursor-pointer z-10 flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-secondary dark:border-primary bg-white text-primary shadow-[0_0_20px_3px] shadow-primary/50 transition-all duration-300 group-hover:bg-primary
                                     group-hover:text-secondary dark:bg-secondary dark:group-hover:bg-primary"
                                    >
                                        {step.icon}
                                    </motion.div>

                                    {/* Animated Ring */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: index * 0.3,
                                        }}
                                        className="absolute inset-0 rounded-full border-2 border-primary"
                                    />

                                    {/* Step Number Badge */}
                                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-secondary bg-primary font-dosis text-lg font-bold text-secondary shadow-lg">
                                        {step.id}
                                    </div>
                                </div>

                                {/* Content Card */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="w-full rounded-2xl border-2 border-secondary shadow-[0px_0px_5px_2px] shadow-primary bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-secondary/50"
                                >
                                    <h3 className="mb-3 font-dosis text-2xl font-bold text-secondary dark:text-white">
                                        {step.title}
                                        <span className="text-primary">.</span>
                                    </h3>
                                    <p className="font-edu text-sm text-secondary dark:text-white">
                                        {step.description}
                                    </p>
                                </motion.div>

                                {/* Mobile Connection Line */}
                                {index < steps.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={inView ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.2 + 0.5 }}
                                        className="mt-6 flex flex-col items-center lg:hidden"
                                    >
                                        <div className="relative h-10 w-[2px]">
                                            {/* Dashed Line */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-between">
                                                <div className="h-2 w-[2px] rounded-full bg-secondary dark:bg-primary" />
                                                <div className="h-2 w-[2px] rounded-full bg-secondary dark:bg-primary" />
                                                <div className="h-2 w-[2px] rounded-full bg-secondary dark:bg-primary" />
                                            </div>
                                            {/* Animated Glow */}
                                            <motion.div
                                                animate={{ top: ["0%", "100%", "0%"] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary/50 blur-sm"
                                            />
                                        </div>
                                        {/* Arrow */}
                                        <motion.div
                                            animate={{ y: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="mt-2"
                                        >
                                            <div className="relative">
                                                {/* Glow Effect */}
                                                <div className="absolute inset-0 blur-sm">
                                                    <svg
                                                        width="16"
                                                        height="10"
                                                        viewBox="0 0 16 10"
                                                        className="text-primary"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M8 10L0 2l2-2 6 6 6-6 2 2-8 8z" />
                                                    </svg>
                                                </div>
                                                {/* Arrow Icon */}
                                                <svg
                                                    width="16"
                                                    height="10"
                                                    viewBox="0 0 16 10"
                                                    className="relative text-secondary dark:text-primary"
                                                    fill="currentColor"
                                                >
                                                    <path d="M8 10L0 2l2-2 6 6 6-6 2 2-8 8z" />
                                                </svg>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-3 rounded-full border-2 border-primary bg-primary/10 px-6 py-3 font-edu text-sm font-semibold text-secondary backdrop-blur-sm dark:bg-primary/20 dark:text-white">
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_2px] shadow-primary"
                        />
                        <span className="sm:hidden">Join with us</span>
                        <span className="hidden sm:inline">Join thousands of students already learning with us</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HowItWorks;
