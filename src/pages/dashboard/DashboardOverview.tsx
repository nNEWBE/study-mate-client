
import useAuth from "../../hooks/useAuth";
import { useGetMySubmissionsQuery } from "../../redux/features/submissions/submissionApi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import CountUp from "react-countup";

const DashboardOverview = () => {
    const { user } = useAuth();
    // skip query if user is null, though our protected route handles that
    const { data: submissions = [], isLoading } = useGetMySubmissionsQuery(undefined, { skip: !user });

    // Stats
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const completed = submissions.filter(s => s.status !== 'pending').length;

    // Chart Data
    const statusData = [
        { name: 'Pending', value: pending, color: '#eab308' },
        { name: 'Completed', value: completed, color: '#22c55e' },
    ];

    // Marks Distribution
    const marksData = submissions
        .filter(s => s.marks)
        .map((s) => ({
            name: s.assignmentTitle.substring(0, 10) + '...',
            marks: s.marks
        }))
        .slice(0, 5);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (isLoading) return <div className="text-center py-10">Loading overview...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-secondary dark:text-white mb-6">Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Total Submissions</div>
                    <div className="text-4xl font-bold text-primary mt-2">
                        <CountUp end={total} duration={2} />
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Pending</div>
                    <div className="text-4xl font-bold text-yellow-500 mt-2">
                        <CountUp end={pending} duration={2} />
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase">Completed</div>
                    <div className="text-4xl font-bold text-green-500 mt-2">
                        <CountUp end={completed} duration={2} />
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Pie Chart */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Submission Status</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
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
                                <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marks Bar Chart */}
                <div className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
                    <h3 className="text-lg font-bold text-secondary dark:text-white mb-4">Recent Marks Performance</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marksData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="marks" fill="#00ffa5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
