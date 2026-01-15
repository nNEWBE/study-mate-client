
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import { IoClose } from "react-icons/io5";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex bg-gray-50 dark:bg-[#111827] min-h-screen">
            {/* Sidebar Desktop */}
            <Sidebar />

            {/* Sidebar Mobile Drawer */}
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/50" onClick={toggleSidebar}></div>
                <div className={`absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-secondary transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 flex justify-end">
                        <button onClick={toggleSidebar} className="text-2xl text-secondary dark:text-white">
                            <IoClose />
                        </button>
                    </div>
                    <div className="h-full overflow-y-auto">
                        <Sidebar />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardNavbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
