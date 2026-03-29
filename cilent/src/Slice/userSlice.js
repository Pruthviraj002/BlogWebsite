import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        isLoading: false,
        isEditModalOpen: false,
        error: null,
    },
    reducers: {
        toggleEditModal: (state, action) => {
            state.isEditModalOpen = action.payload;
        },
        loginStart: (state) => {

            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.data = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.data = null;
            state.token = null;
            state.refreshToken = null;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
        updateUserInfo: (state, action) => {
            state.data = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        updateToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
    },
});

export const { toggleEditModal, loginStart, loginSuccess, loginFailure, logout, updateUserInfo, updateToken } = userSlice.actions;
export default userSlice.reducer;
