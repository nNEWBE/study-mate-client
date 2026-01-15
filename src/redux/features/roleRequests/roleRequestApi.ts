import { baseApi } from '../../api/baseApi';
import { ApiResponse } from '../../../types';

// Role Request types
export interface RoleRequest {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    requestedRole: 'teacher' | 'admin';
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateRoleRequestData {
    requestedRole: 'teacher' | 'admin';
    reason: string;
}

export interface UpdateRoleRequestData {
    status: 'approved' | 'rejected';
}

export const roleRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /role-request - Create role request (Student/Teacher)
        createRoleRequest: builder.mutation<ApiResponse<RoleRequest>, CreateRoleRequestData>({
            query: (data) => ({
                url: '/role-request',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['RoleRequest'],
        }),

        // GET /role-request/my-requests - Get my role requests (Authenticated)
        getMyRoleRequests: builder.query<RoleRequest[], void>({
            query: () => '/role-request/my-requests',
            transformResponse: (response: ApiResponse<RoleRequest[]>) => response.data || [],
            providesTags: ['RoleRequest'],
        }),

        // GET /role-request - Get all role requests (Admin only)
        getAllRoleRequests: builder.query<RoleRequest[], void>({
            query: () => '/role-request',
            transformResponse: (response: ApiResponse<RoleRequest[]>) => response.data || [],
            providesTags: ['RoleRequest'],
        }),

        // PATCH /role-request/:id - Approve/Reject role request (Admin only)
        updateRoleRequest: builder.mutation<ApiResponse<RoleRequest>, { id: string; data: UpdateRoleRequestData }>({
            query: ({ id, data }) => ({
                url: `/role-request/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['RoleRequest', 'User'],
        }),
    }),
});

export const {
    useCreateRoleRequestMutation,
    useGetMyRoleRequestsQuery,
    useGetAllRoleRequestsQuery,
    useUpdateRoleRequestMutation,
} = roleRequestApi;
