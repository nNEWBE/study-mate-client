
import useAuth from "../../hooks/useAuth";
import { useGetMyRoleRequestsQuery, useCreateRoleRequestMutation } from "../../redux/features/roleRequests/roleRequestApi";
import Swal from "sweetalert2";

const DashboardRole = () => {
    const { user } = useAuth();
    const { data: requests = [], isLoading } = useGetMyRoleRequestsQuery(undefined, { skip: !user });
    const [createRoleRequest] = useCreateRoleRequestMutation();

    const handleRequestRole = async () => {
        const { value: formValues } = await Swal.fire({
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
                return Swal.fire('Error', 'Reason must be at least 10 characters', 'error');
            }
            try {
                const res = await createRoleRequest({ requestedRole: role, reason }).unwrap();
                if (res.success) {
                    Swal.fire('Success', 'Request submitted', 'success');
                }
            } catch (error: any) {
                Swal.fire('Error', error.data?.message || 'Failed to submit', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary dark:text-white">Role Requests</h1>
                <button
                    onClick={handleRequestRole}
                    className="bg-primary text-secondary font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-primary/50 transition-all active:scale-95"
                >
                    Request Upgrade
                </button>
            </div>

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
