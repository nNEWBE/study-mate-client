
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        email: string | null;
        uid: string | null;
        displayName: string | null;
        photoURL: string | null;
        role: 'student' | 'teacher' | 'admin' | null;
    } | null;
    token: string | null;
    loading: boolean;
    // Track which social login button was clicked (google/github)
    // This fixes Supabase returning first provider for linked accounts
    pendingProvider: 'google' | 'github' | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: true,
    pendingProvider: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: AuthState['user']; token: string | null }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.pendingProvider = null;
        },
        // Set which social button was clicked before OAuth redirect
        setPendingProvider: (state, action: PayloadAction<'google' | 'github'>) => {
            state.pendingProvider = action.payload;
        },
        // Clear pending provider after login is complete
        clearPendingProvider: (state) => {
            state.pendingProvider = null;
        }
    },
});

export const { setUser, setLoading, logout, setPendingProvider, clearPendingProvider } = authSlice.actions;
export default authSlice.reducer;
