
import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdAssignment,
    MdAdminPanelSettings,
    MdHome,
    MdLogout
} from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import logo1 from "../../../public/Logo_01.json";
import logo2 from "../../../public/Logo_02.json";
import LottieFiles from "../ui/LottieFiles";
import "../../styles/style.css";

const Sidebar = () => {
    const { logoutUser } = useAuth();

    const links = [
        { name: "Overview", to: "/dashboard", icon: <MdDashboard /> },
        { name: "My Submissions", to: "/dashboard/submissions", icon: <MdAssignment /> },
        { name: "Role Request", to: "/dashboard/role-request", icon: <MdAdminPanelSettings /> },
    ];

    return (
        <div className="h-screen w-64 bg-white dark:bg-secondary border-r border-gray-200 dark:border-gray-800 flex flex-col hidden md:flex sticky top-0">
            {/* Logo Area */}
            <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-1">
                    <div className="w-10">
                        <LottieFiles animation={logo1} />
                    </div>
                    <span className="font-dosis text-2xl font-bold text-secondary dark:text-white">StudyMate</span>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-6 px-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/dashboard"} // Only exact match for overview
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive
                                ? "bg-primary text-secondary shadow-[0_0_10px_1px] shadow-primary/30"
                                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                            }`
                        }
                    >
                        <span className="text-xl">{link.icon}</span>
                        {link.name}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all"
                >
                    <MdHome className="text-xl" />
                    Back to Home
                </NavLink>
                <button
                    onClick={logoutUser}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium"
                >
                    <MdLogout className="text-xl" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
