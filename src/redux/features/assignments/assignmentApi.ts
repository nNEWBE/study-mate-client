import { baseApi } from '../../api/baseApi';
import { Assignment, ApiResponse } from '../../../types';

export const assignmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /assignment - Get all assignments
        getAssignments: builder.query<Assignment[], string | void>({
            query: (filter) => ({
                url: '/assignment',
                params: typeof filter === 'string' ? { filter } : undefined,
            }),
            transformResponse: (response: ApiResponse<Assignment[]>) => response.data || [],
            providesTags: ['Assignment'],
        }),

        // GET /assignment/:id - Get single assignment (Authenticated)
        getAssignmentById: builder.query<Assignment, string>({
            query: (id) => `/assignment/${id}`,
            transformResponse: (response: ApiResponse<Assignment>) => response.data as Assignment,
            providesTags: (result, error, id) => [{ type: 'Assignment', id }],
        }),

        // POST /assignment - Create assignment (Authenticated, with file upload)
        createAssignment: builder.mutation<ApiResponse<Assignment>, FormData | Partial<Assignment>>({
            query: (data) => ({
                url: '/assignment',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Assignment'],
        }),

        // PUT /assignment/:id - Update assignment (Authenticated, with file upload)
        updateAssignment: builder.mutation<ApiResponse<Assignment>, { id: string; data: FormData | Partial<Assignment> }>({
            query: ({ id, data }) => ({
                url: `/assignment/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Assignment', { type: 'Assignment', id }],
        }),

        // DELETE /assignment/:id - Delete assignment (Authenticated)
        deleteAssignment: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/assignment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Assignment'],
        }),
    }),
});

export const {
    useGetAssignmentsQuery,
    useGetAssignmentByIdQuery,
    useCreateAssignmentMutation,
    useUpdateAssignmentMutation,
    useDeleteAssignmentMutation,
} = assignmentApi;
