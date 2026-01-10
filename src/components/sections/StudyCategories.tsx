import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Reveal from "../../animation/Reveal";
import TextScramble from "../../animation/TextScramble";
import Unhidden from "../../animation/Unhidden";
import TextReveal from "../../animation/TextReveal";
import {
    FaReact,
    FaServer,
    FaDocker,
    FaShieldAlt,
    FaRobot,
    FaMobileAlt,
    FaDatabase,
    FaCloud,
} from "react-icons/fa";

interface Category {
    id: number;
    icon: React.ReactNode;
    title: string;
    count: number;
    color: string;
    borderColor: string;
}

const categories: Category[] = [
    {
        id: 1,
        icon: <FaReact className="text-4xl" />,
        title: "Frontend",
        count: 89,
        color: "from-cyan-500 to-blue-400",
        borderColor: "#06b6d4",
    },
    {
        id: 2,
        icon: <FaServer className="text-4xl" />,
        title: "Backend",
        count: 76,
        color: "from-green-500 to-emerald-400",
        borderColor: "#00ffa5",
    },
    {
        id: 3,
        icon: <FaDocker className="text-4xl" />,
        title: "DevOps",
        count: 54,
        color: "from-blue-500 to-indigo-400",
        borderColor: "#3b82f6",
    },
    {
        id: 4,
        icon: <FaShieldAlt className="text-4xl" />,
        title: "Cyber Security",
        count: 67,
        color: "from-red-500 to-orange-400",
        borderColor: "#ef4444",
    },
    {
        id: 5,
        icon: <FaRobot className="text-4xl" />,
        title: "AI & ML",
        count: 92,
        color: "from-purple-500 to-violet-400",
        borderColor: "#a855f7",
    },
    {
        id: 6,
        icon: <FaMobileAlt className="text-4xl" />,
        title: "Mobile Dev",
        count: 48,
        color: "from-pink-500 to-rose-400",
        borderColor: "#ec4899",
    },
    {
        id: 7,
        icon: <FaDatabase className="text-4xl" />,
        title: "Database",
        count: 63,
        color: "from-amber-500 to-yellow-400",
        borderColor: "#f59e0b",
    },
    {
        id: 8,
        icon: <FaCloud className="text-4xl" />,
        title: "Cloud",
        count: 71,
        color: "from-teal-500 to-cyan-400",
        borderColor: "#14b8a6",
    },
];

const StudyCategories = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="w-full bg-white py-24 dark:bg-secondary" id="Categories">
            <div className="mx-auto w-[90%] max-w-7xl">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="flex justify-center">
                        <Reveal>
                            <TextScramble>Tech Categories</TextScramble>
                        </Reveal>
                    </div>
                    <div className="relative mx-auto sm:w-3/4 lg:w-[50%]">
                        <Unhidden>
                            <TextReveal>
                                Master in-demand tech skills with assignments across
                                software development, DevOps, AI, and more.
                            </TextReveal>
                        </Unhidden>
                    </div>
                </div>

                {/* Categories Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
                >
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group cursor-pointer"
                            data-cursor="category"
                        >
                            <div className="relative overflow-hidden rounded-2xl border-2 border-secondary shadow-primary shadow-[0px_0px_5px_2px] bg-white dark:bg-secondary p-6 text-center transition-all duration-300">
                                <div
                                    className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-500 ease-in-out group-hover:rotate-[-25deg]"
                                    data-cursor="none"
                                    style={{
                                        borderColor: category.borderColor,
                                        backgroundColor: `${category.borderColor}20`,
                                        color: category.borderColor,
                                        boxShadow: `0 0 0 0 ${category.borderColor}`,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 20px 3px ${category.borderColor}80`;
                                        e.currentTarget.style.backgroundColor = category.borderColor;
                                        e.currentTarget.style.color = '#0f172a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = `0 0 0 0 ${category.borderColor}`;
                                        e.currentTarget.style.backgroundColor = `${category.borderColor}20`;
                                        e.currentTarget.style.color = category.borderColor;
                                    }}
                                >
                                    {category.icon}
                                </div>

                                <h3 className="relative mb-2 w-full truncate font-dosis text-lg font-bold text-secondary dark:text-white">
                                    {category.title}
                                </h3>

                                <div className="relative inline-flex text-secondary dark:text-primary items-center gap-1 rounded-full dark:bg-primary/10 bg-primary/30 px-3 py-1 font-edu text-xs font-semibold">
                                    <span>{category.count}</span>
                                    <span >assignments</span>
                                </div>

                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-primary to-primary/50"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
};

export default StudyCategories;
