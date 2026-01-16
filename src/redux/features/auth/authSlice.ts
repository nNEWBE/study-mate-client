
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
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: true,
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
        }
    },
});

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
