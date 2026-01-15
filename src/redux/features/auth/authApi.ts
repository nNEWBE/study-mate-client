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
    profileImageUrl?: string;
    provider?: 'google' | 'github' | 'email';
    socialId?: string;
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
        provider?: 'google' | 'github' | 'email';
    };
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /register - Register a new user
        register: builder.mutation<ApiResponse<AuthResponse>, RegisterData>({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: data,
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

        // POST /social-login - Login with social provider (Google/GitHub)
        socialLogin: builder.mutation<ApiResponse<AuthResponse>, { email?: string; socialId?: string }>({
            query: (data) => ({
                url: '/social-login',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useSocialLoginMutation,
} = authApi;
