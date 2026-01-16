import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useGetMyRoleRequestsQuery, useCreateRoleRequestMutation } from "../../redux/features/roleRequests/roleRequestApi";
import { useModal } from "../../components/ui/Modal";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";

const DashboardRole = () => {
    const { user } = useAuth();
    const { showModal } = useModal();
    const { data: requests = [], isLoading } = useGetMyRoleRequestsQuery(undefined, { skip: !user });
    const [createRoleRequest] = useCreateRoleRequestMutation();

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("teacher");
    const [reason, setReason] = useState<string>("");

    const handleSubmitRequest = async () => {
        if (reason.length < 10) {
            toast.error("Reason must be at least 10 characters");
            return;
        }

        try {
            const res = await createRoleRequest({ requestedRole: selectedRole as "teacher" | "admin", reason }).unwrap();
            if (res.success) {
                showModal({
                    type: "success",
                    title: "Success",
                    message: "Request submitted successfully!",
                    confirmText: "OK",
                });
                setShowForm(false);
                setReason("");
            }
        } catch (error: any) {
            showModal({
                type: "error",
                title: "Error",
                message: error.data?.message || "Failed to submit request",
                confirmText: "OK",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary dark:text-white">Role Requests</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-secondary font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-primary/50 transition-all active:scale-95"
                >
                    Request Upgrade
                </button>
            </div>

            {/* Role Request Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                type="info"
                title="Request Role Upgrade"
                confirmText="Submit Request"
                cancelText="Cancel"
                showCancel={true}
                onConfirm={handleSubmitRequest}
                onCancel={() => setShowForm(false)}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary dark:text-white mb-2">
                            Select Role
                        </label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-secondary/30 dark:border-white/30 bg-white dark:bg-secondary text-secondary dark:text-white focus:border-primary focus:outline-none transition-colors"
                        >
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary dark:text-white mb-2">
                            Reason (min 10 characters)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Why do you want this role?"
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-secondary/30 dark:border-white/30 bg-white dark:bg-secondary text-secondary dark:text-white focus:border-primary focus:outline-none transition-colors resize-none"
                        />
                    </div>
                </div>
            </Modal>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-400">Loading...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-10 bg-white dark:bg-[#1f2937] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No role requests found.</p>
                        <p className="text-sm text-gray-400 mt-1">Want to become a teacher or admin? Click the button above.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req._id} className="bg-white dark:bg-[#1f2937] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-secondary dark:text-white capitalize">{req.requestedRole} Request</h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{req.reason}</p>
                            </div>
                            <div className="text-sm text-gray-400">
                                {new Date(req.createdAt || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardRole;
