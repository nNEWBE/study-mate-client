
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import { IoClose, IoMenu } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

    return (
        <div className="flex bg-gray-50 dark:bg-[#111827] min-h-screen">
            {/* Sidebar Desktop */}
            <Sidebar collapsed={sidebarCollapsed} onToggle={toggleCollapse} />

            {/* Sidebar Mobile Drawer */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 md:hidden bg-black/50"
                            onClick={toggleSidebar}
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-secondary z-50 md:hidden shadow-2xl"
                        >
                            <div className="p-4 flex justify-end border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg text-2xl text-secondary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <IoClose />
                                </button>
                            </div>
                            <div className="h-full overflow-y-auto">
                                {/* <Sidebar collapsed={false} onToggle={() => { }} className="w-full h-full flex flex-col" showToggle={false} /> */}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.div
                animate={{ marginLeft: 0 }}
                className="flex-1 flex flex-col min-w-0"
            >
                <DashboardNavbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </motion.div>
        </div>
    );
};

export default DashboardLayout;
