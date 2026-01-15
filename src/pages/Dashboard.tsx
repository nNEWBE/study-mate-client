
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { Submission, ApiResponse } from "../types";
import Reveal from "../animation/Reveal";
import TextScramble from "../animation/TextScramble";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [roleRequests, setRoleRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await user?.getIdToken();
                const headers = { Authorization: `Bearer ${token}` };

                const [subRes, reqRes] = await Promise.all([
                    axios.get<ApiResponse<Submission[]>>(`${import.meta.env.VITE_API_URL}/submission/my-submissions`, { headers }),
                    axios.get(`${import.meta.env.VITE_API_URL}/role-request/my-requests`, { headers })
                ]);

                if (subRes.data.success && subRes.data.data) {
                    setSubmissions(subRes.data.data);
                }
                if (reqRes.data.success && reqRes.data.data) {
                    setRoleRequests(reqRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleRequestRole = async () => {
        import("sweetalert2").then(async (Swal) => {
            const { value: formValues } = await Swal.default.fire({
                title: 'Request Role Upgrade',
                html:
                    '<select id="swal-role" class="swal2-input">' +
                    '<option value="teacher">Teacher</option>' +
                    '<option value="admin">Admin</option>' +
                    '</select>' +
                    '<input id="swal-reason" class="swal2-input" placeholder="Reason (min 10 chars)">',
                focusConfirm: false,
                preConfirm: () => {
                    return [
                        (document.getElementById('swal-role') as HTMLInputElement).value,
                        (document.getElementById('swal-reason') as HTMLInputElement).value
                    ]
                }
            });

            if (formValues) {
                const [role, reason] = formValues;
                if (reason.length < 10) {
                    return Swal.default.fire('Error', 'Reason must be at least 10 characters', 'error');
                }
                try {
                    const token = await user?.getIdToken();
                    await axios.post(`${import.meta.env.VITE_API_URL}/role-request`,
                        { requestedRole: role, reason },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    Swal.default.fire('Success', 'Request submitted', 'success');
                    // Refresh requests could be added here
                } catch (error: any) {
                    Swal.default.fire('Error', error.response?.data?.message || 'Failed to submit', 'error');
                }
            }
        });
    };

    const pendingCount = submissions.filter((s) => s.status === "pending").length;
    const completedCount = submissions.filter((s) => s.status !== "pending").length;
    const latestRequest = roleRequests.length > 0 ? roleRequests[0] : null;

    return (
        <div className="min-h-screen w-full bg-white dark:bg-secondary pt-24 px-4 sm:px-10">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Reveal>
                        <h1 className="text-4xl font-bold dark:text-white">
                            Welcome back, <span className="text-primary">{user?.displayName?.split(" ")[0]}</span>!
                        </h1>
                    </Reveal>
                    <Reveal>
                        <p className="mt-2 text-gray-500 dark:text-gray-300">
                            Here is an overview of your activity.
                        </p>
                    </Reveal>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl shadow-[0_0_10px_2px] shadow-primary/20 bg-white dark:bg-secondary border border-gray-100 dark:border-gray-800"
                    >
                        <div className="text-4xl font-bold text-primary mb-2">
                            <TextScramble>{submissions.length.toString()}</TextScramble>
                        </div>
                        <div className="text-gray-500 dark:text-gray-300 font-medium font-edu">Total Submissions</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl shadow-[0_0_10px_2px] shadow-yellow-500/20 bg-white dark:bg-secondary border border-gray-100 dark:border-gray-800"
                    >
                        <div className="text-4xl font-bold text-yellow-500 mb-2">
                            <TextScramble>{pendingCount.toString()}</TextScramble>
                        </div>
                        <div className="text-gray-500 dark:text-gray-300 font-medium font-edu">Pending Submissions</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl shadow-[0_0_10px_2px] shadow-green-500/20 bg-white dark:bg-secondary border border-gray-100 dark:border-gray-800"
                    >
                        <div className="text-4xl font-bold text-green-500 mb-2">
                            <TextScramble>{completedCount.toString()}</TextScramble>
                        </div>
                        <div className="text-gray-500 dark:text-gray-300 font-medium font-edu">Graded Assignments</div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-12 justify-center items-center">
                    <Link to="/tasks" className="btn btn-primary text-white rounded-full px-8">Find Assignments</Link>
                    <button onClick={handleRequestRole} className="btn btn-outline text-primary border-primary hover:bg-primary hover:text-white rounded-full px-8">Request Role Upgrade</button>
                    {latestRequest && (
                        <div className={`badge badge-lg p-4 ${latestRequest.status === 'approved' ? 'badge-success' : 'badge-ghost'} text-white`}>
                            Role Request: <span className="uppercase ml-1">{latestRequest.status}</span> ({latestRequest.requestedRole})
                        </div>
                    )}
                </div>


                {/* Submissions Table */}
                <div className="bg-white dark:bg-secondary dark:border dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden mb-10">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold dark:text-white">Recent Submissions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            {/* head */}
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th>Assignment</th>
                                    <th>Status</th>
                                    <th>Marks</th>
                                    <th>Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={4} className="text-center py-10">Loading...</td></tr>
                                ) : submissions.length === 0 ? (
                                    <tr><td colSpan={4} className="text-center py-10 dark:text-gray-400">No submissions found.</td></tr>
                                ) : (
                                    submissions.map((sub) => (
                                        <tr key={sub._id} className="dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td>
                                                <div className="font-bold">{sub.assignmentTitle}</div>
                                                <div className="text-xs opacity-50">{new Date(sub.submittedAt || Date.now()).toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <span className={`badge ${sub.status === 'pending' ? 'badge-warning' : 'badge-success'} badge-sm`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td>
                                                {sub.marks ? <span className="font-bold text-primary">{sub.marks}</span> : '-'}
                                            </td>
                                            <td>
                                                <span className="text-sm truncate max-w-xs block" title={sub.feedback}>
                                                    {sub.feedback || '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
