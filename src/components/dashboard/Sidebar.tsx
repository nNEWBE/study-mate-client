
import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdAssignment,
    MdAdminPanelSettings,
    MdHome,
    MdLogout,
    MdPerson,
    MdSettings,
    MdAnalytics,
    MdChevronRight,
    MdOutlineDashboard,
    MdOutlineAnalytics,
    MdOutlineAssignment,
    MdOutlinePerson,
    MdOutlineSettings,
    MdOutlineAdminPanelSettings,
    MdOutlineHome
} from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import Lottie from "lottie-react";
import logo1 from "../../../public/Logo_01.json";
import "../../styles/style.css";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    className?: string;
    showToggle?: boolean;
}

const Sidebar = ({ collapsed, onToggle, className = "hidden md:flex flex-col sticky top-0 h-screen", showToggle = true }: SidebarProps) => {
    const { logoutUser } = useAuth();

    const mainLinks = [
        { name: "Overview", to: "/dashboard", icon: <MdOutlineDashboard />, activeIcon: <MdDashboard /> },
        { name: "Analytics", to: "/dashboard/analytics", icon: <MdOutlineAnalytics />, activeIcon: <MdAnalytics /> },
        { name: "My Submissions", to: "/dashboard/submissions", icon: <MdOutlineAssignment />, activeIcon: <MdAssignment /> },
    ];

    const accountLinks = [
        { name: "Profile", to: "/dashboard/profile", icon: <MdOutlinePerson />, activeIcon: <MdPerson /> },
        { name: "Settings", to: "/dashboard/settings", icon: <MdOutlineSettings />, activeIcon: <MdSettings /> },
        { name: "Role Request", to: "/dashboard/role-request", icon: <MdOutlineAdminPanelSettings />, activeIcon: <MdAdminPanelSettings /> },
    ];

    const NavItem = ({ link, end = false }: { link: { name: string; to: string; icon: JSX.Element; activeIcon: JSX.Element }; end?: boolean }) => (
        <NavLink
            to={link.to}
            end={end}
            className={({ isActive }) =>
                `group relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${collapsed ? 'justify-center' : ''
                } ${isActive
                    ? ""
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-800/40"
                }`
            }
            title={collapsed ? link.name : undefined}
        >
            {({ isActive }) => (
                <>
                    {/* Premium Active Background */}
                    {isActive && (
                        <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/15 dark:via-primary/8 dark:to-transparent rounded-xl border border-primary/20 dark:border-primary/30"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                    )}



                    {/* Icon Container with Active/Inactive Icons */}
                    <span className={`relative z-10 text-xl flex-shrink-0 transition-all duration-300 ${isActive
                        ? 'text-primary'
                        : 'group-hover:scale-110 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                        }`}>
                        {isActive ? link.activeIcon : link.icon}
                    </span>

                    {/* Text Label */}
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className={`relative z-10 whitespace-nowrap tracking-wide ${isActive
                                    ? 'font-bold text-primary'
                                    : 'font-medium'
                                    }`}
                            >
                                {link.name}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Active Arrow Indicator */}
                    {isActive && !collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-auto relative z-10"
                        >
                            <MdChevronRight className="text-primary text-lg" />
                        </motion.div>
                    )}
                </>
            )}
        </NavLink>
    );

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`relative bg-gradient-to-b from-white via-white to-gray-50/50 dark:from-secondary dark:via-secondary dark:to-gray-900/50 border-r border-gray-200/80 dark:border-gray-800/80 backdrop-blur-sm ${className}`}
        >
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
            />

            {/* Toggle Button - Modern Pill Design */}
            {showToggle && (
                <motion.button
                    onClick={onToggle}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute -right-4 top-28 w-8 h-8 bg-gradient-to-br from-primary to-emerald-500 rounded-xl flex items-center justify-center text-secondary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow z-50 border-2 border-white dark:border-gray-800"
                >
                    <motion.span
                        initial={false}
                        animate={{ rotate: collapsed ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MdChevronRight className="text-lg" />
                    </motion.span>
                </motion.button>
            )}

            {/* Logo Area - Enhanced */}
            <div className="h-24 flex items-center justify-center border-b border-gray-200/60 dark:border-gray-800/60 overflow-hidden bg-gradient-to-r from-transparent via-gray-50/30 to-transparent dark:via-gray-800/20">
                <NavLink to="/" className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 group">
                    <motion.div
                        className={`transition-all duration-300 ${collapsed ? 'w-11' : 'w-14'}`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                        <Lottie animationData={logo1} loop={true} />
                    </motion.div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.25 }}
                                className="font-dosis text-2xl font-bold bg-gradient-to-r from-secondary via-gray-700 to-secondary dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent whitespace-nowrap"
                            >
                                StudyMate
                            </motion.span>
                        )}
                    </AnimatePresence>
                </NavLink>
            </div>

            {/* Main Nav Links */}
            <div className="flex-1 py-6 px-3 space-y-5 overflow-hidden">
                {/* Back to Home - Styled */}
                <NavLink
                    to="/"
                    className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/40 dark:hover:from-gray-800/60 dark:hover:to-gray-800/30 transition-all duration-300 font-medium ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? "Back to Home" : undefined}
                >
                    <MdHome className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="whitespace-nowrap font-semibold tracking-wide"
                            >
                                Back to Home
                            </motion.span>
                        )}
                    </AnimatePresence>
                </NavLink>

                {/* Divider - Modern Gradient */}
                <div className="mx-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                </div>

                {/* Main Section */}
                <div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2 px-4 mb-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-emerald-400 shadow-sm shadow-primary/30" />
                                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                                    Dashboard
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {collapsed && <div className="h-4"></div>}
                    <div className="space-y-1.5">
                        {mainLinks.map((link) => (
                            <NavItem key={link.to} link={link} end={link.to === "/dashboard"} />
                        ))}
                    </div>
                </div>

                {/* Account Section */}
                <div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2 px-4 mb-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-400 shadow-sm shadow-violet-500/30" />
                                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                                    Account
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {collapsed && <div className="h-4"></div>}
                    <div className="space-y-1.5">
                        {accountLinks.map((link) => (
                            <NavItem key={link.to} link={link} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions - Enhanced */}
            <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/30">
                <motion.button
                    onClick={logoutUser}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50/50 dark:hover:from-red-900/20 dark:hover:to-red-900/10 transition-all duration-300 font-semibold ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? "Logout" : undefined}
                >
                    <MdLogout className="text-xl flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="whitespace-nowrap tracking-wide"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
