import { baseApi } from '../../api/baseApi';
import { ApiResponse } from '../../../types';

// User types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    profileImage?: string;
    provider?: 'google' | 'github' | 'email';
    isBlocked?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateUserData {
    name?: string;
    profileImage?: File;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /user - Get all users
        getAllUsers: builder.query<User[], void>({
            query: () => '/user',
            transformResponse: (response: ApiResponse<User[]>) => response.data || [],
            providesTags: ['User'],
        }),

        // PATCH /user/update-user/:id - Update user profile
        updateUser: builder.mutation<ApiResponse<User>, { id: string; data: FormData }>({
            query: ({ id, data }) => ({
                url: `/user/update-user/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),

        // PATCH /user/change-status/:id - Block/Unblock user
        changeUserStatus: builder.mutation<ApiResponse<User>, { id: string; isBlocked: boolean }>({
            query: ({ id, isBlocked }) => ({
                url: `/user/change-status/${id}`,
                method: 'PATCH',
                body: { isBlocked },
            }),
            invalidatesTags: ['User'],
        }),

        // GET /user/me - Get current logged-in user profile
        getMe: builder.query<User, void>({
            query: () => '/user/me',
            transformResponse: (response: ApiResponse<User>) => response.data as User,
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useChangeUserStatusMutation,
    useGetMeQuery,
} = userApi;
