import { motion } from "framer-motion";
import { useState } from "react";
import { useToggle } from "../../context/ToggleProvider";
import {
    MdDarkMode,
    MdLightMode,
    MdNotifications,
    MdEmail,
    MdLock,
    MdLanguage,
    MdVolumeUp,
    MdToggleOn,
    MdToggleOff
} from "react-icons/md";

const DashboardSettings = () => {
    const { theme, setTheme } = useToggle();
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [sounds, setSounds] = useState(false);

    const toggleTheme = () => setTheme(prev => !prev);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
        <button
            onClick={onToggle}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
            <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-4xl"
        >
            <motion.div variants={item}>
                <h1 className="text-3xl font-bold text-secondary dark:text-white font-dosis">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-edu">Customize your dashboard experience</p>
            </motion.div>

            {/* Appearance */}
            <motion.div variants={item} className="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-4 flex items-center gap-2">
                    {theme ? <MdDarkMode className="text-primary" /> : <MdLightMode className="text-primary" />}
                    Appearance
                </h3>

                <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h4 className="font-medium text-secondary dark:text-white">Dark Mode</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                    </div>
                    <ToggleSwitch enabled={theme ?? false} onToggle={toggleTheme} />
                </div>

                <div className="flex items-center justify-between py-4">
                    <div>
                        <h4 className="font-medium text-secondary dark:text-white">Language</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
                    </div>
                    <select className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 text-secondary dark:text-white focus:border-primary focus:outline-none">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                    </select>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div variants={item} className="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-4 flex items-center gap-2">
                    <MdNotifications className="text-primary" />
                    Notifications
                </h3>

                <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h4 className="font-medium text-secondary dark:text-white">Push Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about assignment updates</p>
                    </div>
                    <ToggleSwitch enabled={notifications} onToggle={() => setNotifications(!notifications)} />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h4 className="font-medium text-secondary dark:text-white">Email Updates</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly digest and important updates</p>
                    </div>
                    <ToggleSwitch enabled={emailUpdates} onToggle={() => setEmailUpdates(!emailUpdates)} />
                </div>

                <div className="flex items-center justify-between py-4">
                    <div>
                        <h4 className="font-medium text-secondary dark:text-white">Sound Effects</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Play sounds for notifications and actions</p>
                    </div>
                    <ToggleSwitch enabled={sounds} onToggle={() => setSounds(!sounds)} />
                </div>
            </motion.div>

            {/* Security */}
            <motion.div variants={item} className="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-4 flex items-center gap-2">
                    <MdLock className="text-primary" />
                    Security
                </h3>

                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary transition-colors group">
                        <div className="flex items-center gap-3">
                            <MdLock className="text-gray-400 group-hover:text-primary transition-colors" />
                            <div className="text-left">
                                <h4 className="font-medium text-secondary dark:text-white">Change Password</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password regularly</p>
                            </div>
                        </div>
                        <span className="text-gray-400">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary transition-colors group">
                        <div className="flex items-center gap-3">
                            <MdEmail className="text-gray-400 group-hover:text-primary transition-colors" />
                            <div className="text-left">
                                <h4 className="font-medium text-secondary dark:text-white">Two-Factor Authentication</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded-full font-medium">Coming Soon</span>
                    </button>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div variants={item} className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-800 p-6">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 font-dosis mb-4">Danger Zone</h3>
                <p className="text-sm text-red-500 dark:text-red-400 mb-4">These actions are irreversible. Please proceed with caution.</p>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors">
                    Delete Account
                </button>
            </motion.div>
        </motion.div>
    );
};

export default DashboardSettings;
