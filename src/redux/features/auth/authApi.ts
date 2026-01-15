import { baseApi } from '../../api/baseApi';
import { ApiResponse } from '../../../types';

// Auth-specific types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    profileImage?: File;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    user?: {
        _id: string;
        name: string;
        email: string;
        role: string;
        profileImage?: string;
    };
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /register - Register a new user
        register: builder.mutation<ApiResponse<AuthResponse>, FormData>({
            query: (formData) => ({
                url: '/register',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['User'],
        }),

        // POST /login - Login user
        login: builder.mutation<ApiResponse<AuthResponse>, LoginCredentials>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        // POST /refresh-token - Refresh access token
        refreshToken: builder.mutation<ApiResponse<{ accessToken: string }>, { refreshToken: string }>({
            query: (data) => ({
                url: '/refresh-token',
                method: 'POST',
                body: data,
            }),
        }),

        // POST /logout - Logout user
        logout: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
} = authApi;
