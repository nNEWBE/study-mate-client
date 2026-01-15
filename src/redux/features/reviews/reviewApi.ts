import { baseApi } from '../../api/baseApi';
import { ApiResponse } from '../../../types';

// Review types
export interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    rating: number;
    comment: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateReviewData {
    rating: number;
    comment: string;
}

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /review - Create new review (Authenticated users)
        createReview: builder.mutation<ApiResponse<Review>, CreateReviewData>({
            query: (data) => ({
                url: '/review',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Review'],
        }),

        // GET /review - Get all reviews
        getAllReviews: builder.query<Review[], void>({
            query: () => '/review',
            transformResponse: (response: ApiResponse<Review[]>) => response.data || [],
            providesTags: ['Review'],
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useGetAllReviewsQuery,
} = reviewApi;
