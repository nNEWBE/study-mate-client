
import useAuth from "../../hooks/useAuth";
import { useGetMySubmissionsQuery } from "../../redux/features/submissions/submissionApi";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage, MdCheckCircle, MdAccessTime, MdStar, MdTrendingUp } from "react-icons/md";
import { useState, useMemo } from "react";

// Dummy data for preview - Expanded for better pagination demo
const dummySubmissions = Array.from({ length: 45 }).map((_, i) => ({
    _id: `${i + 1}`,
    assignmentTitle: [
        'React Fundamentals Quiz', 'TypeScript Advanced Types', 'Node.js REST API Project',
        'MongoDB Aggregation', 'CSS Grid Layout Challenge', 'JavaScript Async/Await',
        'Redux State Management', 'Express Middleware', 'GraphQL API Design', 'Docker Basics'
    ][i % 10] + ` ${Math.floor(i / 10) + 1}`,
    status: i % 3 === 0 ? 'pending' : 'completed',
    marks: i % 3 === 0 ? null : 70 + Math.floor(Math.random() * 30),
    feedback: i % 3 === 0 ? null : ['Excellent work!', 'Good effort', 'Needs improvement', 'Perfect!'][i % 4],
    submittedAt: new Date(Date.now() - i * 86400000).toISOString()
}));

const DashboardSubmissions = () => {
    const { user } = useAuth();
    const { data: realSubmissions = [], isLoading } = useGetMySubmissionsQuery(undefined, { skip: !user });
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Use dummy data if no real submissions exist
    const submissions = realSubmissions.length > 0 ? realSubmissions : dummySubmissions;
    const isUsingDummyData = realSubmissions.length === 0;

    // Filter and search
    const filteredSubmissions = useMemo(() => {
        return submissions.filter(sub => {
            const matchesFilter = filter === 'all' ||
                (filter === 'pending' && sub.status === 'pending') ||
                (filter === 'completed' && sub.status !== 'pending');
            const matchesSearch = sub.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [submissions, filter, searchTerm]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

    // Reset handlers
    const handleFilterChange = (newFilter: 'all' | 'pending' | 'completed') => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Stats
    const stats = useMemo(() => ({
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'pending').length,
        completed: submissions.filter(s => s.status !== 'pending').length,
        avgScore: Math.round(submissions.filter(s => s.marks).reduce((acc, s) => acc + (s.marks || 0), 0) / (submissions.filter(s => s.marks).length || 1))
    }), [submissions]);

    // Page Numbers logic
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Table Row stagger animation
    const tableContainerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05 // FAST Stagger for sleek effect
            }
        },
        exit: { opacity: 0 }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 30 }
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={cardVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary dark:text-white font-dosis">My Submissions</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-edu">View and track all your assignment submissions</p>
                </div>
                {isUsingDummyData && (
                    <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm font-medium flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                        </span>
                        Preview Data
                    </div>
                )}
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={cardVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: stats.total, icon: <MdStar />, color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/20' },
                    { label: 'Pending', value: stats.pending, icon: <MdAccessTime />, color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/20' },
                    { label: 'Completed', value: stats.completed, icon: <MdCheckCircle />, color: 'text-green-500', bg: 'bg-green-500/20', border: 'border-green-500/20' },
                    { label: 'Avg Score', value: `${stats.avgScore}%`, icon: <MdTrendingUp />, color: 'text-blue-500', bg: 'bg-blue-500/20', border: 'border-blue-500/20' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`relative overflow-hidden p-5 rounded-2xl border ${stat.border} bg-white dark:bg-[#1f2937] shadow-lg`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <div className={`text-3xl font-bold ${stat.color} font-dosis`}>{stat.value}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Controls */}
            <motion.div variants={cardVariants} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl text-secondary dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {(['all', 'pending', 'completed'] as const).map((filterOption) => (
                        <button
                            key={filterOption}
                            onClick={() => handleFilterChange(filterOption)}
                            className={`relative px-5 py-2.5 rounded-lg font-medium transition-all capitalize text-sm ${filter === filterOption ? 'text-secondary' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            {filter === filterOption && (
                                <motion.div layoutId="activeFilter" className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                            )}
                            <span className="relative z-10">{filterOption}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Table Area */}
            <motion.div variants={cardVariants} className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto min-h-[400px]"> {/* Fixed height container to prevent jumping */}
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignment</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submitted On</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Marks</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feedback</th>
                            </tr>
                        </thead>

                        {/* ANIMATED TBODY */}
                        <motion.tbody
                            key={currentPage + filter + searchTerm} // Re-renders the entire tbody on change
                            variants={tableContainerVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="divide-y divide-gray-100 dark:divide-gray-700/50"
                        >
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div></td></tr>
                            ) : paginatedSubmissions.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-20 text-gray-500">No submissions found.</td></tr>
                            ) : (
                                paginatedSubmissions.map((sub) => (
                                    <motion.tr
                                        key={sub._id}
                                        variants={rowVariants} // Individual row animation
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                                    {sub.assignmentTitle.charAt(0)}
                                                </div>
                                                <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{sub.assignmentTitle}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(sub.submittedAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${sub.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${sub.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.marks ? <span className="font-bold text-gray-700 dark:text-gray-300">{sub.marks}<span className="text-xs text-gray-400 font-normal">/100</span></span> : <span className="text-gray-400">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 italic truncate max-w-[200px]">{sub.feedback || "Pending feedback"}</td>
                                    </motion.tr>
                                ))
                            )}
                        </motion.tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                {filteredSubmissions.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}</span> to <span className="font-medium text-gray-900 dark:text-white">{Math.min(endIndex, filteredSubmissions.length)}</span> of <span className="font-medium text-gray-900 dark:text-white">{filteredSubmissions.length}</span> results
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"><MdFirstPage size={20} /></motion.button>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"><MdChevronLeft size={20} /></motion.button>

                            <div className="flex items-center gap-1 mx-2">
                                {getPageNumbers().map((page, i) => (
                                    page === '...' ? <span key={`dots-${i}`} className="text-gray-400 px-1">...</span> : (
                                        <motion.button
                                            key={page}
                                            onClick={() => setCurrentPage(page as number)}
                                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700'
                                                }`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {page}
                                        </motion.button>
                                    )
                                ))}
                            </div>

                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"><MdChevronRight size={20} /></motion.button>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"><MdLastPage size={20} /></motion.button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default DashboardSubmissions;
