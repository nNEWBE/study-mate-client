
import useAuth from "../../hooks/useAuth";
import { useGetMySubmissionsQuery } from "../../redux/features/submissions/submissionApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    MdTrendingUp,
    MdAccessTime,
    MdCheckCircle,
    MdPendingActions,
    MdAssignment,
    MdCalendarToday,
    MdArrowForward
} from "react-icons/md";

// Dummy data for preview when no real data exists
const dummySubmissions = [
    { _id: '1', assignmentTitle: 'React Fundamentals Quiz', status: 'completed', marks: 92, submittedAt: '2026-01-15' },
    { _id: '2', assignmentTitle: 'TypeScript Advanced Types', status: 'completed', marks: 88, submittedAt: '2026-01-14' },
    { _id: '3', assignmentTitle: 'Node.js REST API Project', status: 'pending', marks: null, submittedAt: '2026-01-13' },
    { _id: '4', assignmentTitle: 'MongoDB Aggregation', status: 'completed', marks: 95, submittedAt: '2026-01-12' },
    { _id: '5', assignmentTitle: 'CSS Grid Layout Challenge', status: 'completed', marks: 78, submittedAt: '2026-01-11' },
    { _id: '6', assignmentTitle: 'JavaScript Async/Await', status: 'pending', marks: null, submittedAt: '2026-01-10' },
    { _id: '7', assignmentTitle: 'Redux State Management', status: 'completed', marks: 85, submittedAt: '2026-01-09' },
    { _id: '8', assignmentTitle: 'Express Middleware', status: 'completed', marks: 90, submittedAt: '2026-01-08' },
];

const dummyActivityData = [
    { day: 'Mon', submissions: 3 },
    { day: 'Tue', submissions: 5 },
    { day: 'Wed', submissions: 2 },
    { day: 'Thu', submissions: 7 },
    { day: 'Fri', submissions: 4 },
    { day: 'Sat', submissions: 6 },
    { day: 'Sun', submissions: 3 },
];

const dummyRecentActivity = [
    { id: 1, action: 'Submitted assignment', title: 'React Fundamentals Quiz', time: '2 hours ago', icon: <MdCheckCircle className="text-green-500" /> },
    { id: 2, action: 'Started assignment', title: 'TypeScript Advanced Types', time: '5 hours ago', icon: <MdPendingActions className="text-yellow-500" /> },
    { id: 3, action: 'Received grade', title: 'MongoDB Aggregation - 95/100', time: '1 day ago', icon: <MdTrendingUp className="text-primary" /> },
    { id: 4, action: 'Completed assignment', title: 'CSS Grid Layout Challenge', time: '2 days ago', icon: <MdCheckCircle className="text-green-500" /> },
];

const DashboardOverview = () => {
    const { user } = useAuth();
    const { data: realSubmissions = [], isLoading } = useGetMySubmissionsQuery(undefined, { skip: !user });

    // Use dummy data if no real submissions exist
    const submissions = realSubmissions.length > 0 ? realSubmissions : dummySubmissions;
    const isUsingDummyData = realSubmissions.length === 0;

    // Stats
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const completed = submissions.filter(s => s.status !== 'pending').length;
    const avgMarks = Math.round(submissions.filter(s => s.marks).reduce((acc, s) => acc + (s.marks || 0), 0) / (completed || 1));

    // Chart Data
    const statusData = [
        { name: 'Pending', value: pending, color: '#eab308' },
        { name: 'Completed', value: completed, color: '#22c55e' },
    ];

    // Marks Distribution
    const marksData = submissions
        .filter(s => s.marks)
        .map((s) => ({
            name: s.assignmentTitle.substring(0, 12) + (s.assignmentTitle.length > 12 ? '...' : ''),
            marks: s.marks
        }))
        .slice(0, 5);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary dark:text-white font-dosis">
                        Welcome back, <span className="text-primary">{user?.displayName?.split(' ')[0] || 'Student'}</span>!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-edu">
                        Here's what's happening with your assignments today.
                    </p>
                </div>
                {isUsingDummyData && (
                    <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                        📊 Showing preview data
                    </div>
                )}
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Total Submissions */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5"
                >
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-primary/20 rounded-xl">
                                <MdAssignment className="text-2xl text-primary" />
                            </div>
                            <MdTrendingUp className="text-2xl text-primary/50" />
                        </div>
                        <div className="text-4xl font-bold text-primary mt-4 font-dosis">
                            <CountUp end={total} duration={2} />
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Total Submissions</div>
                    </div>
                </motion.div>

                {/* Pending */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 dark:from-yellow-500/20 dark:to-yellow-500/10 p-6 rounded-2xl border border-yellow-500/20 shadow-lg shadow-yellow-500/5"
                >
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-yellow-500/20 rounded-xl">
                                <MdPendingActions className="text-2xl text-yellow-500" />
                            </div>
                            <MdAccessTime className="text-2xl text-yellow-500/50" />
                        </div>
                        <div className="text-4xl font-bold text-yellow-500 mt-4 font-dosis">
                            <CountUp end={pending} duration={2} />
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Pending Review</div>
                    </div>
                </motion.div>

                {/* Completed */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/10 p-6 rounded-2xl border border-green-500/20 shadow-lg shadow-green-500/5"
                >
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <MdCheckCircle className="text-2xl text-green-500" />
                            </div>
                            <MdTrendingUp className="text-2xl text-green-500/50" />
                        </div>
                        <div className="text-4xl font-bold text-green-500 mt-4 font-dosis">
                            <CountUp end={completed} duration={2} />
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Completed</div>
                    </div>
                </motion.div>

                {/* Average Marks */}
                <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10 p-6 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5"
                >
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <MdTrendingUp className="text-2xl text-blue-500" />
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full font-bold">AVG</span>
                        </div>
                        <div className="text-4xl font-bold text-blue-500 mt-4 font-dosis">
                            <CountUp end={avgMarks} duration={2} suffix="%" />
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">Average Score</div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis">Weekly Activity</h3>
                        <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">This Week</span>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dummyActivityData}>
                                <defs>
                                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ffa5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00ffa5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#00ffa5' }}
                                />
                                <Area type="monotone" dataKey="submissions" stroke="#00ffa5" strokeWidth={2} fillOpacity={1} fill="url(#colorSubmissions)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis">Submission Status</h3>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    innerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {statusData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}: {entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Bottom Row */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Marks Performance */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis">Marks Performance</h3>
                        <Link to="/dashboard/submissions" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                            View All <MdArrowForward />
                        </Link>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marksData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#00ffa5' }}
                                />
                                <Bar dataKey="marks" fill="#00ffa5" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {dummyRecentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xl">
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-secondary dark:text-white truncate">{activity.action}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{activity.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardOverview;
