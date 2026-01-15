
import { IoMoon, IoSunny, IoMenu } from "react-icons/io5";
import { useToggle } from "../../context/ToggleProvider";
import useAuth from "../../hooks/useAuth";

interface DashboardNavbarProps {
    toggleSidebar: () => void;
}

const DashboardNavbar = ({ toggleSidebar }: DashboardNavbarProps) => {
    const { theme, setTheme } = useToggle();
    const { user } = useAuth();

    const handleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.checked);
    };

    return (
        <div className="h-20 bg-white dark:bg-secondary border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-2 text-2xl text-secondary dark:text-white"
                >
                    <IoMenu />
                </button>
                <h2 className="text-xl font-bold font-dosis text-secondary dark:text-white">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <div className="relative">
                    <input
                        onChange={handleTheme}
                        checked={theme || false}
                        type="checkbox"
                        id="dash-theme-toggle"
                        className="toggle-input hidden"
                    />
                    <label
                        htmlFor="dash-theme-toggle"
                        className="cursor-pointer flex items-center justify-between w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 relative transition-colors"
                        style={{ position: 'relative' }} // Override CSS clash if needed
                    >
                        <IoSunny className="text-yellow-500 text-sm z-10" />
                        <IoMoon className="text-white text-sm z-10" />
                        <span className={`absolute bg-white top-1 w-5 h-5 rounded-full transition-all duration-300 shadow-sm ${theme ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`}></span>
                    </label>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-secondary dark:text-white leading-none">{user?.displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.email}</p>
                    </div>
                    <img
                        src={user?.photoURL || "https://via.placeholder.com/40"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;
