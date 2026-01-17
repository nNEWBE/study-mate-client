import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import CountUp from "react-countup";
import { MdTrendingUp, MdTrendingDown, MdAccessTime, MdStar } from "react-icons/md";

// Dummy data for analytics
const performanceData = [
    { month: 'Aug', score: 72 },
    { month: 'Sep', score: 78 },
    { month: 'Oct', score: 82 },
    { month: 'Nov', score: 85 },
    { month: 'Dec', score: 88 },
    { month: 'Jan', score: 91 },
];

const subjectData = [
    { name: 'Mon', react: 4, typescript: 3, node: 2 },
    { name: 'Tue', react: 5, typescript: 4, node: 3 },
    { name: 'Wed', react: 3, typescript: 5, node: 4 },
    { name: 'Thu', react: 6, typescript: 4, node: 5 },
    { name: 'Fri', react: 4, typescript: 6, node: 3 },
    { name: 'Sat', react: 5, typescript: 5, node: 4 },
    { name: 'Sun', react: 3, typescript: 3, node: 2 },
];

const skillsData = [
    { subject: 'React', A: 85, fullMark: 100 },
    { subject: 'TypeScript', A: 78, fullMark: 100 },
    { subject: 'Node.js', A: 72, fullMark: 100 },
    { subject: 'MongoDB', A: 88, fullMark: 100 },
    { subject: 'CSS', A: 92, fullMark: 100 },
    { subject: 'JavaScript', A: 95, fullMark: 100 },
];

const topAssignments = [
    { id: 1, title: 'MongoDB Aggregation Pipeline', score: 98, category: 'Database', trend: 'up' },
    { id: 2, title: 'React Custom Hooks', score: 95, category: 'Frontend', trend: 'up' },
    { id: 3, title: 'TypeScript Generics', score: 92, category: 'Language', trend: 'up' },
    { id: 4, title: 'Node.js Streams', score: 88, category: 'Backend', trend: 'down' },
    { id: 5, title: 'CSS Animations', score: 85, category: 'Styling', trend: 'stable' },
];

const DashboardAnalytics = () => {
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
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary dark:text-white font-dosis">Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-edu">Track your learning progress and performance</p>
                </div>
                <div className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary text-sm font-medium">
                    📊 Demo Data
                </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1f2937] p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Avg. Score</span>
                        <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                            <MdTrendingUp /> +5%
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-secondary dark:text-white font-dosis">
                        <CountUp end={87} suffix="%" duration={2} />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1f2937] p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Study Hours</span>
                        <span className="flex items-center gap-1 text-green-500 text-xs font-medium">
                            <MdTrendingUp /> +12%
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-secondary dark:text-white font-dosis">
                        <CountUp end={48} suffix="h" duration={2} />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1f2937] p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Streak</span>
                        <span className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                            🔥 Hot
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-secondary dark:text-white font-dosis">
                        <CountUp end={14} suffix=" days" duration={2} />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1f2937] p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Ranking</span>
                        <MdStar className="text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold text-secondary dark:text-white font-dosis">
                        #<CountUp end={12} duration={2} />
                    </div>
                </div>
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-6">Performance Trend</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ffa5" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#00ffa5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none' }} />
                                <Area type="monotone" dataKey="score" stroke="#00ffa5" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skills Radar */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-6">Skills Overview</h3>
                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                <Radar name="Score" dataKey="A" stroke="#00ffa5" fill="#00ffa5" fillOpacity={0.3} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Row */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Study Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-6">Weekly Study Activity</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none' }} />
                                <Legend />
                                <Bar dataKey="react" name="React" fill="#61DAFB" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="typescript" name="TypeScript" fill="#3178C6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="node" name="Node.js" fill="#339933" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Assignments */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-secondary dark:text-white font-dosis mb-4">Top Scores</h3>
                    <div className="space-y-3">
                        {topAssignments.map((assignment, index) => (
                            <div key={assignment.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                        index === 1 ? 'bg-gray-100 text-gray-600' :
                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                                'bg-gray-50 text-gray-500'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-secondary dark:text-white truncate">{assignment.title}</p>
                                    <p className="text-xs text-gray-500">{assignment.category}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-primary">{assignment.score}</span>
                                    {assignment.trend === 'up' && <MdTrendingUp className="text-green-500 text-sm" />}
                                    {assignment.trend === 'down' && <MdTrendingDown className="text-red-500 text-sm" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardAnalytics;
