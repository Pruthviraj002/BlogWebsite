import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
        error: null,
    },
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.data = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.data = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        updateUserInfo: (state, action) => {
            state.data = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
