import { baseApi } from '../../api/baseApi';
import { Submission, ApiResponse } from '../../../types';

// Submission-specific types
export interface CreateSubmissionData {
    assignmentId: string;
    pdfLink: string;
    quickNote?: string;
}

export interface UpdateSubmissionData {
    marks?: number;
    feedback?: string;
    status?: 'pending' | 'completed';
}

export const submissionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /submission - Create submission (Student only)
        createSubmission: builder.mutation<ApiResponse<Submission>, CreateSubmissionData>({
            query: (data) => ({
                url: '/submission',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Submission'],
        }),

        // GET /submission - Get all submissions (Admin/Teacher only)
        getAllSubmissions: builder.query<Submission[], void>({
            query: () => '/submission',
            transformResponse: (response: ApiResponse<Submission[]>) => response.data || [],
            providesTags: ['Submission'],
        }),

        // GET /submission/my-submissions - Get my submissions (Student)
        getMySubmissions: builder.query<Submission[], void>({
            query: () => '/submission/my-submissions',
            transformResponse: (response: ApiResponse<Submission[]>) => response.data || [],
            providesTags: ['Submission'],
        }),

        // GET /submission/:id - Get single submission (Authenticated)
        getSubmissionById: builder.query<Submission, string>({
            query: (id) => `/submission/${id}`,
            transformResponse: (response: ApiResponse<Submission>) => response.data as Submission,
            providesTags: (result, error, id) => [{ type: 'Submission', id }],
        }),

        // PATCH /submission/:id - Update submission (Admin/Teacher - for grading)
        updateSubmission: builder.mutation<ApiResponse<Submission>, { id: string; data: UpdateSubmissionData }>({
            query: ({ id, data }) => ({
                url: `/submission/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Submission'],
        }),
    }),
});

export const {
    useCreateSubmissionMutation,
    useGetAllSubmissionsQuery,
    useGetMySubmissionsQuery,
    useGetSubmissionByIdQuery,
    useUpdateSubmissionMutation,
} = submissionApi;
