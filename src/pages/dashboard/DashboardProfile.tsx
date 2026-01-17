import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { MdPerson, MdEmail, MdBadge, MdCalendarToday, MdEdit, MdCameraAlt } from "react-icons/md";

const DashboardProfile = () => {
    const { user } = useAuth();

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <motion.div variants={item}>
                <h1 className="text-3xl font-bold text-secondary dark:text-white font-dosis">Profile Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-edu">Manage your account information</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <motion.div variants={item} className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {/* Cover */}
                        <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-green-400 relative">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                        </div>

                        {/* Avatar */}
                        <div className="relative px-6 pb-6">
                            <div className="relative -mt-16 mb-4">
                                <div className="w-28 h-28 rounded-full border-4 border-white dark:border-[#1f2937] overflow-hidden bg-gray-200 shadow-lg">
                                    <img
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=00ffa5&color=111827&size=128`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-secondary shadow-lg hover:scale-110 transition-transform">
                                    <MdCameraAlt />
                                </button>
                            </div>

                            <h2 className="text-xl font-bold text-secondary dark:text-white">{user?.displayName || 'Student'}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <MdBadge className="text-primary" />
                                    <span className="capitalize">Student</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    <MdCalendarToday className="text-primary" />
                                    <span>Joined January 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Edit Profile Form */}
                <motion.div variants={item} className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis">Edit Profile</h3>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors">
                                <MdEdit /> Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <MdPerson className="text-gray-400" />
                                    <span className="text-secondary dark:text-white">{user?.displayName || 'Not set'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <MdEmail className="text-gray-400" />
                                    <span className="text-secondary dark:text-white">{user?.email || 'Not set'}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Role</label>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <MdBadge className="text-gray-400" />
                                    <span className="text-secondary dark:text-white capitalize">Student</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Member Since</label>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <MdCalendarToday className="text-gray-400" />
                                    <span className="text-secondary dark:text-white">January 2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-primary">Pro tip:</span> Complete your profile to unlock all features and personalize your learning experience.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default DashboardProfile;
