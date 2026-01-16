import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import TextScramble from "../animation/TextScramble";
import TextReveal from "../animation/TextReveal";
import Reveal from "../animation/Reveal";
import Unhidden from "../animation/Unhidden";
import "../styles/style.css";

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    icon: string;
}

const timelineEvents: TimelineEvent[] = [
    {
        year: "2020",
        title: "The Beginning",
        description:
            "StudyMate was born from a simple idea: making group study seamless. Two college friends started building a platform to help students collaborate on assignments.",
        icon: "🚀",
    },
    {
        year: "2021",
        title: "First 1,000 Users",
        description:
            "We reached our first milestone! Students from 50+ universities joined StudyMate, sharing assignments and helping each other excel academically.",
        icon: "🎯",
    },
    {
        year: "2022",
        title: "Major Platform Upgrade",
        description:
            "Launched Assignment Grading System, Real-time Collaboration, and introduced the Teacher Dashboard with advanced analytics.",
        icon: "⚡",
    },
    {
        year: "2023",
        title: "10,000+ Active Users",
        description:
            "StudyMate became a trusted platform across 200+ institutions. We introduced AI-powered assignment suggestions and smart deadlines.",
        icon: "🌟",
    },
    {
        year: "2024",
        title: "Global Expansion",
        description:
            "Expanded to 15 countries with multi-language support. Launched mobile apps and integrated with popular LMS platforms.",
        icon: "🌍",
    },
    {
        year: "2025",
        title: "The Future is Now",
        description:
            "Continuing to innovate with AI tutoring, gamified learning paths, and building the most comprehensive study platform for students worldwide.",
        icon: "✨",
    },
];

const TimelineCard = ({
    event,
    index,
}: {
    event: TimelineEvent;
    index: number;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "center center"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
    const x = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [index % 2 === 0 ? -100 : 100, 0, 0]
    );
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);

    return (
        <motion.div
            ref={cardRef}
            style={{ opacity, x, scale }}
            className={`flex items-center gap-4 md:gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
        >
            {/* Content Card */}
            <div
                className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
            >
                <div className="group relative rounded-2xl border-2 border-secondary bg-white p-6 shadow-[0px_0px_5px_2px] shadow-primary backdrop-blur-xl transition-all duration-500 hover:shadow-[0px_0px_15px_5px] hover:shadow-primary dark:bg-secondary/50">
                    {/* Year Badge */}
                    <div className="border-rotate mb-4 inline-flex h-10 w-24 items-center justify-center bg-secondary font-edu text-lg font-bold text-primary">
                        {event.year}
                    </div>

                    {/* Icon */}
                    <div className="mb-3 text-4xl">{event.icon}</div>

                    {/* Title */}
                    <h3 className="mb-3 font-dosis text-2xl font-bold text-secondary dark:text-white">
                        {event.title}
                        <span className="text-4xl font-bold text-primary">.</span>
                    </h3>

                    {/* Description */}
                    <p className="font-edu text-base font-medium leading-relaxed text-secondary/80 dark:text-white/80">
                        {event.description}
                    </p>

                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/0 blur-xl transition-all duration-500 group-hover:bg-primary/10" />
                </div>
            </div>

            {/* Timeline Node */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-secondary bg-primary shadow-[0px_0px_10px_3px] shadow-primary md:h-16 md:w-16"
                >
                    <span className="text-xl font-bold text-secondary md:text-2xl">
                        {index + 1}
                    </span>
                </motion.div>
            </div>

            {/* Empty space for alternating layout */}
            <div className="hidden flex-1 md:block" />
        </motion.div>
    );
};

const About = (): JSX.Element => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-white dark:bg-secondary"
        >
            {/* Hero Section */}
            <div className="relative overflow-hidden py-32">
                {/* Background glow effects */}
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

                <div className="relative mx-auto w-[90%] max-w-[90rem]">
                    <div className="flex justify-center">
                        <Reveal>
                            <TextScramble>About StudyMate</TextScramble>
                        </Reveal>
                    </div>

                    <div className="relative mx-auto mt-4 sm:w-3/4 lg:w-[55%]">
                        <Unhidden>
                            <TextReveal className="text-center">
                                We're on a mission to transform how students learn, collaborate,
                                and succeed together. Discover our journey from a simple idea to
                                a platform trusted by thousands.
                            </TextReveal>
                        </Unhidden>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="mx-auto w-[90%] max-w-[90rem] py-16">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {[
                        { number: "10K+", label: "Active Users" },
                        { number: "200+", label: "Universities" },
                        { number: "50K+", label: "Assignments" },
                        { number: "15", label: "Countries" },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group rounded-2xl border-2 border-secondary bg-white p-6 text-center shadow-[0px_0px_5px_2px] shadow-primary transition-all duration-300 hover:shadow-[0px_0px_15px_5px] hover:shadow-primary dark:bg-secondary/50"
                        >
                            <h3 className="font-dosis text-4xl font-bold text-primary md:text-5xl">
                                {stat.number}
                            </h3>
                            <p className="mt-2 font-edu text-lg font-medium text-secondary dark:text-white">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Timeline Section */}
            <div className="py-20">
                <div className="mx-auto w-[90%] max-w-[90rem]">
                    <div className="mb-16 flex justify-center">
                        <Reveal>
                            <TextScramble>Our Journey</TextScramble>
                        </Reveal>
                    </div>

                    <div className="relative mx-auto sm:w-3/4 lg:w-[55%]">
                        <Unhidden>
                            <TextReveal className="text-center">
                                From a college dorm room idea to a global platform, here's how
                                StudyMate evolved over the years.
                            </TextReveal>
                        </Unhidden>
                    </div>

                    {/* Timeline Container */}
                    <div ref={containerRef} className="relative mt-20">
                        {/* Animated Timeline Line */}
                        <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 bg-secondary/20 md:block">
                            <motion.div
                                style={{ height: lineHeight }}
                                className="w-full bg-primary shadow-[0px_0px_10px_3px] shadow-primary"
                            />
                        </div>

                        {/* Mobile Timeline Line */}
                        <div className="absolute left-6 block h-full w-1 bg-secondary/20 md:hidden">
                            <motion.div
                                style={{ height: lineHeight }}
                                className="w-full bg-primary shadow-[0px_0px_10px_3px] shadow-primary"
                            />
                        </div>

                        {/* Timeline Events */}
                        <div className="space-y-16 pl-16 md:space-y-24 md:pl-0">
                            {timelineEvents.map((event, index) => (
                                <TimelineCard key={index} event={event} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-20">
                <div className="mx-auto w-[90%] max-w-[90rem]">
                    <div className="flex justify-center">
                        <Reveal>
                            <TextScramble>Our Mission</TextScramble>
                        </Reveal>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mx-auto mt-12 max-w-4xl rounded-2xl border-2 border-secondary bg-white p-8 shadow-[0px_0px_10px_3px] shadow-primary dark:bg-secondary/50 md:p-12"
                    >
                        <div className="space-y-6 text-center">
                            <p className="font-edu text-xl font-medium leading-relaxed text-secondary dark:text-white md:text-2xl">
                                "To create a world where every student has access to
                                collaborative learning tools that make education more engaging,
                                efficient, and enjoyable."
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-1 w-16 rounded-full bg-primary shadow-[0px_0px_5px_2px] shadow-primary" />
                                <span className="font-dosis text-lg font-bold text-primary">
                                    StudyMate Team
                                </span>
                                <div className="h-1 w-16 rounded-full bg-primary shadow-[0px_0px_5px_2px] shadow-primary" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Team Values Section */}
            <div className="py-20">
                <div className="mx-auto w-[90%] max-w-[90rem]">
                    <div className="mb-16 flex justify-center">
                        <Reveal>
                            <TextScramble>Our Values</TextScramble>
                        </Reveal>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                title: "Collaboration",
                                description:
                                    "We believe learning is better together. Our platform fosters teamwork and peer support.",
                                icon: "🤝",
                            },
                            {
                                title: "Innovation",
                                description:
                                    "We constantly evolve, integrating cutting-edge technology to enhance the learning experience.",
                                icon: "💡",
                            },
                            {
                                title: "Accessibility",
                                description:
                                    "Education should be for everyone. We strive to make our tools accessible to all students.",
                                icon: "🌐",
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="group rounded-2xl border-2 border-secondary bg-white p-8 shadow-[0px_0px_5px_2px] shadow-primary transition-all duration-300 hover:shadow-[0px_0px_15px_5px] hover:shadow-primary dark:bg-secondary/50"
                            >
                                <div className="mb-4 text-5xl">{value.icon}</div>
                                <h3 className="mb-3 font-dosis text-2xl font-bold text-secondary dark:text-white">
                                    {value.title}
                                    <span className="text-4xl font-bold text-primary">.</span>
                                </h3>
                                <p className="font-edu text-base font-medium leading-relaxed text-secondary/80 dark:text-white/80">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mx-auto w-[90%] max-w-4xl rounded-2xl border-2 border-secondary bg-primary/10 p-8 text-center shadow-[0px_0px_15px_5px] shadow-primary md:p-12"
                >
                    <h2 className="font-dosis text-3xl font-bold text-secondary dark:text-white md:text-4xl">
                        Ready to Join Our Journey?
                        <span className="text-primary">.</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl font-edu text-lg font-medium text-secondary/80 dark:text-white/80">
                        Become a part of the StudyMate community and transform the way you
                        learn and collaborate.
                    </p>
                    <div className="mt-8">
                        <a
                            href="/account"
                            className="inline-block rounded-xl border-2 border-secondary bg-primary px-8 py-3 font-edu text-xl font-bold text-secondary shadow-[0px_0px_10px_3px] shadow-primary transition-all duration-300 hover:bg-secondary hover:text-primary hover:shadow-[0px_0px_20px_5px]"
                        >
                            Get Started Today
                        </a>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default About;
