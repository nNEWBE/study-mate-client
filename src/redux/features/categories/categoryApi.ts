import { baseApi } from '../../api/baseApi';
import { ApiResponse } from '../../../types';

// Category types
export interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCategoryData {
    name: string;
    description?: string;
    image?: File;
}

export interface UpdateCategoryData {
    name?: string;
    description?: string;
    image?: File;
}

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /category - Create new category (Admin only)
        createCategory: builder.mutation<ApiResponse<Category>, FormData>({
            query: (formData) => ({
                url: '/category',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Category'],
        }),

        // GET /category - Get all categories
        getAllCategories: builder.query<Category[], void>({
            query: () => '/category',
            transformResponse: (response: ApiResponse<Category[]>) => response.data || [],
            providesTags: ['Category'],
        }),

        // GET /category/:id - Get single category
        getCategoryById: builder.query<Category, string>({
            query: (id) => `/category/${id}`,
            transformResponse: (response: ApiResponse<Category>) => response.data as Category,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),

        // PATCH /category/:id - Update category (Admin only)
        updateCategory: builder.mutation<ApiResponse<Category>, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/category/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),

        // DELETE /category/:id - Delete category (Admin only)
        deleteCategory: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useCreateCategoryMutation,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
