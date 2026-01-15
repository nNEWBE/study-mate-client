import { baseApi } from '../../api/baseApi';
import { ApiResponse, Assignment } from '../../../types';

// Wishlist types
export interface WishlistItem {
    _id: string;
    user: string;
    assignment: Assignment;
    createdAt?: string;
}

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /wishlist - Add to wishlist (Authenticated)
        addToWishlist: builder.mutation<ApiResponse<WishlistItem>, { assignment: string }>({
            query: (data) => ({
                url: '/wishlist',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Wishlist'],
        }),

        // GET /wishlist - Get my wishlist (Authenticated)
        getWishlist: builder.query<WishlistItem[], void>({
            query: () => '/wishlist',
            transformResponse: (response: ApiResponse<WishlistItem[]>) => response.data || [],
            providesTags: ['Wishlist'],
        }),

        // DELETE /wishlist/:id - Remove from wishlist (Authenticated)
        removeFromWishlist: builder.mutation<ApiResponse<void>, string>({
            query: (id) => ({
                url: `/wishlist/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist'],
        }),
    }),
});

export const {
    useAddToWishlistMutation,
    useGetWishlistQuery,
    useRemoveFromWishlistMutation,
} = wishlistApi;
