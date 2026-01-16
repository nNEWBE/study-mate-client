import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoCalendar,
    IoTime,
    IoBookmark,
    IoBookmarkOutline,
    IoArrowForward,
    IoSearch,
    IoChevronDown,
} from "react-icons/io5";
import { FaUser, FaTag, FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import Reveal from "../animation/Reveal";
import "../styles/style.css";

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [savedPosts, setSavedPosts] = useState<number[]>([]);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [expandedPost, setExpandedPost] = useState<number | null>(null);

    const categories = [
        "All",
        "Study Tips",
        "Productivity",
        "Technology",
        "Career",
        "Wellness",
    ];

    const blogPosts = [
        {
            id: 1,
            title: "10 Effective Study Techniques for Better Grades",
            excerpt:
                "Discover the most effective study methods backed by science. From spaced repetition to active recall, these techniques will transform how you learn.",
            content:
                "Learning effectively is a skill that can be developed. The key is understanding how your brain processes and retains information. Spaced repetition involves reviewing material at increasing intervals, which strengthens long-term memory. Active recall, on the other hand, forces your brain to retrieve information rather than passively reading it.",
            category: "Study Tips",
            author: "Dr. Sarah Mitchell",
            date: "Dec 28, 2024",
            readTime: "8 min read",
            likes: 245,
            comments: 32,
            image:
                "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60",
            featured: true,
        },
        {
            id: 2,
            title: "Building a Productive Morning Routine",
            excerpt:
                "Start your day right with these proven morning habits that boost focus, energy, and academic performance throughout the day.",
            content:
                "The way you start your morning sets the tone for your entire day. Successful students often share common morning habits: waking up early, exercising, eating a nutritious breakfast, and reviewing their goals. These habits prime your mind for learning and help maintain focus during study sessions.",
            category: "Productivity",
            author: "James Chen",
            date: "Dec 25, 2024",
            readTime: "6 min read",
            likes: 189,
            comments: 24,
            image:
                "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60",
            featured: false,
        },
        {
            id: 3,
            title: "AI Tools Every Student Should Know in 2025",
            excerpt:
                "Explore the latest AI-powered tools that can help you research, write, and study more efficiently than ever before.",
            content:
                "Artificial Intelligence is revolutionizing education. From AI writing assistants to smart flashcard apps, these tools can significantly enhance your learning experience. However, it's important to use them ethically and as supplements to your own thinking, not replacements.",
            category: "Technology",
            author: "Alex Rivera",
            date: "Dec 22, 2024",
            readTime: "10 min read",
            likes: 312,
            comments: 56,
            image:
                "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
            featured: true,
        },
        {
            id: 4,
            title: "How to Manage Stress During Exam Season",
            excerpt:
                "Learn proven strategies to stay calm and focused when exam pressure is at its peak. Your mental health matters.",
            content:
                "Exam stress is real, but it doesn't have to control you. Techniques like deep breathing, regular exercise, adequate sleep, and mindful breaks can significantly reduce anxiety. Remember, your worth isn't defined by your grades – it's about your growth and effort.",
            category: "Wellness",
            author: "Dr. Emily Foster",
            date: "Dec 20, 2024",
            readTime: "7 min read",
            likes: 278,
            comments: 45,
            image:
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=60",
            featured: false,
        },
        {
            id: 5,
            title: "Building Your Personal Brand as a Student",
            excerpt:
                "Stand out in the job market by developing your personal brand while still in school. Start creating opportunities now.",
            content:
                "Your personal brand is what people say about you when you're not in the room. As a student, you can start building it through projects, internships, online presence, and networking. A strong personal brand opens doors to opportunities you might not even know exist.",
            category: "Career",
            author: "Michael Park",
            date: "Dec 18, 2024",
            readTime: "9 min read",
            likes: 156,
            comments: 28,
            image:
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60",
            featured: false,
        },
        {
            id: 6,
            title: "The Pomodoro Technique: A Complete Guide",
            excerpt:
                "Master the art of focused work with this time management method that has helped millions of students worldwide.",
            content:
                "The Pomodoro Technique breaks work into 25-minute focused sessions followed by 5-minute breaks. After four sessions, take a longer 15-30 minute break. This method works because it aligns with how our brain naturally focuses and needs rest.",
            category: "Productivity",
            author: "Lisa Thompson",
            date: "Dec 15, 2024",
            readTime: "5 min read",
            likes: 423,
            comments: 67,
            image:
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
            featured: true,
        },
    ];

    const filteredPosts = blogPosts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredPosts = blogPosts.filter((post) => post.featured);

    const toggleSaved = (id: number) => {
        setSavedPosts((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const toggleLiked = (id: number) => {
        setLikedPosts((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const floatingAnimation = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-white dark:bg-secondary"
        >
            {/* Hero Section */}
            <div className="relative overflow-hidden px-5 pb-8 pt-12 lg:px-20">
                {/* Background decorations */}
                <motion.div
                    animate={floatingAnimation}
                    className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        ...floatingAnimation,
                        transition: { ...floatingAnimation.transition, delay: 1 },
                    }}
                    className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
                />

                <div className="relative z-10 mx-auto max-w-7xl">
                    {/* Header */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-12 text-center"
                    >
                        <Reveal>
                            <motion.span
                                className="mb-4 inline-block rounded-full border-2 border-secondary bg-primary/20 px-4 py-1 font-edu text-sm font-bold text-secondary dark:border-primary dark:text-white"
                                whileHover={{ scale: 1.05 }}
                            >
                                Our Blog
                            </motion.span>
                        </Reveal>
                        <Reveal>
                            <h1 className="title mb-4 font-dosis text-secondary dark:text-white">
                                Study <span className="text-primary">Insights</span>
                            </h1>
                        </Reveal>
                        <Reveal>
                            <p className="mx-auto max-w-2xl font-edu text-lg text-secondary/80 dark:text-white/80">
                                Discover tips, strategies, and insights to boost your academic
                                performance and personal growth.
                            </p>
                        </Reveal>
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        {/* Search Bar */}
                        <div className="relative flex-1 sm:max-w-md">
                            <motion.div
                                whileFocus={{ scale: 1.02 }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border-2 border-secondary bg-white py-3 pl-12 pr-4 font-poppins text-secondary outline-none transition-all duration-300 placeholder:text-secondary/50 focus:shadow-[0_0_15px_2px] focus:shadow-primary/50 dark:border-white/30 dark:bg-secondary/50 dark:text-white dark:placeholder:text-white/50"
                                />
                                <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-secondary/50 dark:text-white/50" />
                            </motion.div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <motion.button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`rounded-xl border-2 px-4 py-2 font-edu font-bold transition-all duration-300 ${selectedCategory === category
                                        ? "border-primary bg-primary text-secondary shadow-[0_0_10px_2px] shadow-primary/50"
                                        : "border-secondary bg-transparent text-secondary hover:border-primary hover:bg-primary/10 dark:border-white/30 dark:text-white"
                                        }`}
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Featured Posts Carousel */}
            <div className="w-full overflow-hidden bg-gradient-to-br from-secondary to-secondary/90 px-5 py-12 lg:px-20">
                <div className="mx-auto max-w-7xl">
                    <Reveal>
                        <h2 className="mb-8 font-dosis text-3xl font-bold text-white">
                            Featured <span className="text-primary">Articles</span>
                        </h2>
                    </Reveal>
                    <div className="grid gap-6 md:grid-cols-3">
                        {featuredPosts.map((post, idx) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 20px 40px rgba(0, 255, 165, 0.2)",
                                }}
                                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <motion.img
                                        src={post.image}
                                        alt={post.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
                                    <motion.span
                                        whileHover={{ scale: 1.1 }}
                                        className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 font-edu text-xs font-bold text-secondary"
                                    >
                                        Featured
                                    </motion.span>
                                </div>
                                <div className="p-6">
                                    <span className="mb-2 inline-block rounded-full border border-primary/50 bg-primary/20 px-3 py-1 font-edu text-xs text-primary">
                                        {post.category}
                                    </span>
                                    <h3 className="mb-2 line-clamp-2 font-dosis text-xl font-bold text-white transition-colors duration-300 group-hover:text-primary">
                                        {post.title}
                                    </h3>
                                    <p className="mb-4 line-clamp-2 font-edu text-sm text-white/70">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-white/60">
                                            <FaUser className="text-sm" />
                                            <span className="font-edu text-sm">{post.author}</span>
                                        </div>
                                        <motion.span
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-1 font-edu text-sm text-primary"
                                        >
                                            Read More <IoArrowForward />
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </div>

            {/* All Posts Grid */}
            <div className="px-5 py-16 lg:px-20">
                <div className="mx-auto max-w-7xl">
                    <Reveal>
                        <h2 className="mb-8 font-dosis text-3xl font-bold text-secondary dark:text-white">
                            Latest <span className="text-primary">Articles</span>
                        </h2>
                    </Reveal>

                    <AnimatePresence mode="wait">
                        {filteredPosts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="py-16 text-center"
                            >
                                <p className="font-edu text-xl text-secondary/60 dark:text-white/60">
                                    No articles found matching your search.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {filteredPosts.map((post) => (
                                    <motion.article
                                        key={post.id}
                                        variants={itemVariants}
                                        layout
                                        whileHover={{ y: -5 }}
                                        className="group overflow-hidden rounded-2xl border-2 border-secondary bg-white shadow-[0_0_15px_2px] shadow-primary/30 transition-all duration-300 hover:shadow-[0_0_25px_5px] hover:shadow-primary/50 dark:bg-secondary/50"
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <motion.img
                                                src={post.image}
                                                alt={post.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />

                                            {/* Actions */}
                                            <div className="absolute right-4 top-4 flex gap-2">
                                                <motion.button
                                                    onClick={() => toggleSaved(post.id)}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-white/40"
                                                >
                                                    {savedPosts.includes(post.id) ? (
                                                        <IoBookmark className="text-lg text-primary" />
                                                    ) : (
                                                        <IoBookmarkOutline className="text-lg text-white" />
                                                    )}
                                                </motion.button>
                                            </div>

                                            {/* Category Badge */}
                                            <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/20 px-3 py-1 font-edu text-xs font-bold text-white backdrop-blur-sm">
                                                {post.category}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="mb-3 line-clamp-2 cursor-pointer font-dosis text-xl font-bold text-secondary transition-colors duration-300 group-hover:text-primary dark:text-white">
                                                {post.title}
                                            </h3>

                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    height: expandedPost === post.id ? "auto" : "3rem",
                                                }}
                                                className="mb-4 overflow-hidden"
                                            >
                                                <p className="font-edu text-sm text-secondary/70 dark:text-white/70">
                                                    {expandedPost === post.id ? post.content : post.excerpt}
                                                </p>
                                            </motion.div>

                                            <button
                                                onClick={() =>
                                                    setExpandedPost(
                                                        expandedPost === post.id ? null : post.id
                                                    )
                                                }
                                                className="mb-4 flex items-center gap-1 font-edu text-sm font-bold text-primary"
                                            >
                                                {expandedPost === post.id ? "Show Less" : "Read More"}
                                                <motion.span
                                                    animate={{
                                                        rotate: expandedPost === post.id ? 180 : 0,
                                                    }}
                                                >
                                                    <IoChevronDown />
                                                </motion.span>
                                            </button>

                                            {/* Meta */}
                                            <div className="flex items-center justify-between border-t border-secondary/10 pt-4 dark:border-white/10">
                                                <div className="flex items-center gap-4 text-secondary/60 dark:text-white/60">
                                                    <span className="flex items-center gap-1 font-edu text-xs">
                                                        <IoCalendar /> {post.date}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-edu text-xs">
                                                        <IoTime /> {post.readTime}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <motion.button
                                                        onClick={() => toggleLiked(post.id)}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="flex items-center gap-1 text-secondary/60 dark:text-white/60"
                                                    >
                                                        {likedPosts.includes(post.id) ? (
                                                            <FaHeart className="text-red-500" />
                                                        ) : (
                                                            <FaRegHeart />
                                                        )}
                                                        <span className="font-edu text-xs">
                                                            {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                                                        </span>
                                                    </motion.button>
                                                    <span className="flex items-center gap-1 text-secondary/60 dark:text-white/60">
                                                        <FaComment />
                                                        <span className="font-edu text-xs">
                                                            {post.comments}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Author */}
                                            <div className="mt-4 flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                                                    <FaUser className="text-sm text-primary" />
                                                </div>
                                                <span className="font-dosis font-bold text-secondary dark:text-white">
                                                    {post.author}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Newsletter Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-primary/20 to-primary/5 px-5 py-16 lg:px-20"
            >
                <div className="mx-auto max-w-3xl text-center">
                    <Reveal>
                        <h2 className="mb-4 font-dosis text-3xl font-bold text-secondary dark:text-white">
                            Stay <span className="text-primary">Updated</span>
                        </h2>
                    </Reveal>
                    <Reveal>
                        <p className="mb-8 font-edu text-secondary/70 dark:text-white/70">
                            Subscribe to our newsletter and never miss a new article. Get the
                            latest study tips delivered straight to your inbox.
                        </p>
                    </Reveal>
                    <motion.form
                        className="flex flex-col gap-4 sm:flex-row"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 rounded-xl border-2 border-secondary bg-white px-6 py-4 font-poppins text-secondary outline-none transition-all duration-300 placeholder:text-secondary/50 focus:shadow-[0_0_15px_2px] focus:shadow-primary/50 dark:border-white/30 dark:bg-secondary/50 dark:text-white dark:placeholder:text-white/50"
                        />
                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 25px 5px rgba(0, 255, 165, 0.5)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-xl border-2 border-secondary bg-primary px-8 py-4 font-edu text-lg font-bold text-secondary shadow-[0_0_15px_2px] shadow-primary/50 transition-all duration-300"
                        >
                            Subscribe
                        </motion.button>
                    </motion.form>
                </div>
            </motion.div>

            {/* Tags Cloud */}
            <div className="px-5 py-12 lg:px-20">
                <div className="mx-auto max-w-7xl">
                    <Reveal>
                        <h2 className="mb-8 font-dosis text-2xl font-bold text-secondary dark:text-white">
                            Popular <span className="text-primary">Tags</span>
                        </h2>
                    </Reveal>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex flex-wrap gap-3"
                    >
                        {[
                            "Study Tips",
                            "Productivity",
                            "Time Management",
                            "Note Taking",
                            "Exams",
                            "Research",
                            "Writing",
                            "Focus",
                            "Memory",
                            "Motivation",
                            "Online Learning",
                            "College Life",
                        ].map((tag, idx) => (
                            <motion.span
                                key={tag}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.1,
                                    backgroundColor: "#00ffa5",
                                    color: "#0f172a",
                                }}
                                className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-secondary/30 bg-white px-4 py-2 font-edu text-sm text-secondary transition-all duration-300 dark:border-white/30 dark:bg-secondary/50 dark:text-white"
                            >
                                <FaTag className="text-primary" />
                                {tag}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Blog;
