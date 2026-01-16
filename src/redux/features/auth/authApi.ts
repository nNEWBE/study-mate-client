import { baseApi } from '../../api/baseApi';
import { ApiResponse } from '../../../types';

// Auth-specific types
export interface LoginCredentials {
    email: string;
    password?: string; // Optional for social login
}

export interface RegisterData {
    name: string;
    email: string;
    password?: string; // Optional for social login (google/github)
    profileImageUrl?: string;
    provider?: 'google' | 'github' | 'password';
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
        providers?: ('google' | 'github' | 'password')[];
    };
}

export interface CheckUserResponse {
    exists: boolean;
    hasProvider: boolean;
    providers: ('google' | 'github' | 'password')[];
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

        // POST /login - Login user (works for both password and social login)
        login: builder.mutation<ApiResponse<AuthResponse>, LoginCredentials>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        // POST /refresh-token - Refresh access token
        refreshToken: builder.mutation<ApiResponse<AuthResponse>, void>({
            query: () => ({
                url: '/refresh-token',
                method: 'POST',
            }),
        }),

        // POST /logout - Logout user
        logout: builder.mutation<ApiResponse<null>, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),

        // GET /check-user - Check if user exists with a specific provider
        checkUserExists: builder.query<ApiResponse<CheckUserResponse>, { email: string; provider: string }>({
            query: ({ email, provider }) => ({
                url: `/check-user?email=${encodeURIComponent(email)}&provider=${provider}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useLazyCheckUserExistsQuery,
} = authApi;
