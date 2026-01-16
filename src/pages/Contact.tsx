import { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
    IoMail,
    IoCall,
    IoLocation,
    IoSend,
    IoCheckmarkCircle,
} from "react-icons/io5";
import {
    FaLinkedin,
    FaGithub,
    FaTwitter,
    FaDiscord,
} from "react-icons/fa";
import Reveal from "../animation/Reveal";
import Button from "../components/ui/Button";
import { useToggle } from "../context/ToggleProvider";
import { useModal } from "../components/ui/Modal";
import "../styles/style.css";

const Contact = () => {
    const { theme } = useToggle();
    const { showModal } = useModal();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            showModal({
                type: "success",
                title: "Message Sent!",
                message: "We'll get back to you as soon as possible.",
                confirmText: "Great!",
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <IoMail className="text-3xl" />,
            title: "Email Us",
            content: "support@studymate.com",
            link: "mailto:support@studymate.com",
        },
        {
            icon: <IoCall className="text-3xl" />,
            title: "Call Us",
            content: "+1 (555) 123-4567",
            link: "tel:+15551234567",
        },
        {
            icon: <IoLocation className="text-3xl" />,
            title: "Visit Us",
            content: "123 Study Lane, Education City",
            link: "#",
        },
    ];

    const socialLinks = [
        { icon: <FaLinkedin />, name: "LinkedIn", link: "#" },
        { icon: <FaGithub />, name: "GitHub", link: "#" },
        { icon: <FaTwitter />, name: "Twitter", link: "#" },
        { icon: <FaDiscord />, name: "Discord", link: "#" },
    ];

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
            transition: { duration: 0.6, ease: "easeOut" },
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
            <div className="relative overflow-hidden px-5 pb-16 pt-12 lg:px-20">
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
                    className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
                />

                <div className="relative z-10 mx-auto max-w-7xl">
                    {/* Header */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-16 text-center"
                    >
                        <Reveal>
                            <motion.span
                                className="mb-4 inline-block rounded-full border-2 border-secondary bg-primary/20 px-4 py-1 font-edu text-sm font-bold text-secondary dark:border-primary dark:text-white"
                                whileHover={{ scale: 1.05 }}
                            >
                                Get In Touch
                            </motion.span>
                        </Reveal>
                        <Reveal>
                            <h1 className="title mb-4 font-dosis text-secondary dark:text-white">
                                Contact <span className="text-primary">Us</span>
                            </h1>
                        </Reveal>
                        <Reveal>
                            <p className="mx-auto max-w-2xl font-edu text-lg text-secondary/80 dark:text-white/80">
                                Have questions or feedback? We'd love to hear from you. Our team
                                is always here to help you succeed in your academic journey.
                            </p>
                        </Reveal>
                    </motion.div>

                    {/* Contact Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-16 grid gap-6 md:grid-cols-3"
                    >
                        {contactInfo.map((info, index) => (
                            <motion.a
                                key={index}
                                href={info.link}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 0 30px 5px rgba(0, 255, 165, 0.3)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-white p-8 shadow-[0_0_15px_2px] shadow-primary/50 transition-all duration-300 dark:bg-secondary/50"
                            >
                                <motion.div
                                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 transition-transform duration-500 group-hover:scale-150"
                                />
                                <div className="relative z-10">
                                    <motion.div
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                        className="mb-4 inline-flex rounded-xl border-2 border-secondary bg-primary p-4 text-secondary shadow-[0_0_10px_2px] shadow-primary"
                                    >
                                        {info.icon}
                                    </motion.div>
                                    <h3 className="mb-2 font-dosis text-xl font-bold text-secondary dark:text-white">
                                        {info.title}
                                    </h3>
                                    <p className="font-edu text-secondary/70 dark:text-white/70">
                                        {info.content}
                                    </p>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Contact Form */}
                        <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className="rounded-3xl border-2 border-secondary bg-white p-8 shadow-[0_0_20px_3px] shadow-primary/50 dark:bg-secondary/50 lg:p-12"
                        >
                            <Reveal>
                                <h2 className="mb-8 font-dosis text-3xl font-bold text-secondary dark:text-white">
                                    Send us a <span className="text-primary">Message</span>
                                </h2>
                            </Reveal>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <label className="mb-2 block font-edu font-bold text-secondary dark:text-white">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border-2 border-primary bg-primary/10 px-4 py-3 font-poppins text-secondary outline-none transition-all duration-300 placeholder:text-secondary/50 focus:shadow-[0_0_15px_2px] focus:shadow-primary/50 dark:border-white/30 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
                                        placeholder="John Doe"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="mb-2 block font-edu font-bold text-secondary dark:text-white">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border-2 border-primary bg-primary/10 px-4 py-3 font-poppins text-secondary outline-none transition-all duration-300 placeholder:text-secondary/50 focus:shadow-[0_0_15px_2px] focus:shadow-primary/50 dark:border-white/30 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
                                        placeholder="john@example.com"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <label className="mb-2 block font-edu font-bold text-secondary dark:text-white">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border-2 border-primary bg-primary/10 px-4 py-3 font-poppins text-secondary outline-none transition-all duration-300 placeholder:text-secondary/50 focus:shadow-[0_0_15px_2px] focus:shadow-primary/50 dark:border-white/30 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
                                        placeholder="How can we help?"
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <label className="mb-2 block font-edu font-bold text-secondary dark:text-white">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full resize-none rounded-xl border-2 border-primary bg-primary/10 px-4 py-3 font-poppins text-secondary outline-none transition-all duration-300 placeholder:text-secondary/50 focus:shadow-[0_0_15px_2px] focus:shadow-primary/50 dark:border-white/30 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50"
                                        placeholder="Tell us about your inquiry..."
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="pt-2"
                                >
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative w-full overflow-hidden rounded-xl border-2 border-secondary bg-primary px-8 py-4 font-edu text-xl font-bold text-secondary shadow-[0_0_15px_2px] shadow-primary/50 transition-all duration-300 hover:shadow-[0_0_25px_5px] hover:shadow-primary/70 disabled:opacity-50"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                        className="h-6 w-6 rounded-full border-2 border-secondary border-t-transparent"
                                                    />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <IoSend className="transition-transform duration-300 group-hover:translate-x-2" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </motion.div>
                            </form>
                        </motion.div>

                        {/* Info Section */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col justify-between"
                        >
                            {/* FAQ Quick Links */}
                            <motion.div
                                variants={itemVariants}
                                className="mb-8 rounded-3xl border-2 border-secondary bg-white p-8 shadow-[0_0_20px_3px] shadow-primary/50 dark:bg-secondary/50"
                            >
                                <h2 className="mb-6 font-dosis text-2xl font-bold text-secondary dark:text-white">
                                    Frequently Asked <span className="text-primary">Questions</span>
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        {
                                            q: "How do I create an assignment?",
                                            a: "Simply log in and click on 'Create' in the navigation menu.",
                                        },
                                        {
                                            q: "Can I collaborate with classmates?",
                                            a: "Yes! Share your assignments and work together seamlessly.",
                                        },
                                        {
                                            q: "Is there a mobile app?",
                                            a: "Our web app is fully responsive and works on all devices.",
                                        },
                                    ].map((faq, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ x: 5 }}
                                            className="rounded-xl border-2 border-secondary/20 bg-primary/5 p-4 transition-colors duration-300 hover:border-primary hover:bg-primary/10 dark:border-white/10 dark:bg-white/5"
                                        >
                                            <h4 className="mb-1 font-dosis font-bold text-secondary dark:text-white">
                                                {faq.q}
                                            </h4>
                                            <p className="font-edu text-sm text-secondary/70 dark:text-white/70">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Social Links */}
                            <motion.div
                                variants={itemVariants}
                                className="rounded-3xl border-2 border-secondary bg-white p-8 shadow-[0_0_20px_3px] shadow-primary/50 dark:bg-secondary/50"
                            >
                                <h2 className="mb-6 font-dosis text-2xl font-bold text-secondary dark:text-white">
                                    Connect With <span className="text-primary">Us</span>
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                    {socialLinks.map((social, idx) => (
                                        <motion.a
                                            key={idx}
                                            href={social.link}
                                            whileHover={{
                                                scale: 1.1,
                                                boxShadow: "0 0 20px 3px rgba(0, 255, 165, 0.5)",
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-2 rounded-xl border-2 border-secondary bg-primary/10 px-4 py-3 font-edu font-bold text-secondary transition-all duration-300 hover:bg-primary dark:border-white/30 dark:text-white"
                                        >
                                            <span className="text-xl">{social.icon}</span>
                                            {social.name}
                                        </motion.a>
                                    ))}
                                </div>

                                {/* Response Time */}
                                <motion.div
                                    className="mt-8 flex items-center gap-3 rounded-xl border-2 border-primary/50 bg-primary/10 p-4"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <IoCheckmarkCircle className="text-3xl text-primary" />
                                    <div>
                                        <p className="font-dosis font-bold text-secondary dark:text-white">
                                            Quick Response Time
                                        </p>
                                        <p className="font-edu text-sm text-secondary/70 dark:text-white/70">
                                            We typically respond within 24 hours
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Map Section Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden"
            >
                <div className="h-80 w-full bg-gradient-to-br from-secondary to-secondary/80">
                    <div className="flex h-full items-center justify-center">
                        <motion.div
                            animate={floatingAnimation}
                            className="text-center"
                        >
                            <IoLocation className="mx-auto mb-4 text-6xl text-primary" />
                            <h3 className="mb-2 font-dosis text-2xl font-bold text-white">
                                Visit Our Office
                            </h3>
                            <p className="font-edu text-white/70">
                                123 Study Lane, Education City, EC 12345
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Contact;
