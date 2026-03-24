import { createSlice } from '@reduxjs/toolkit';

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        blogs: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        fetchStart: (state) => {
            state.isLoading = true;
        },
        fetchSuccess: (state, action) => {
            state.isLoading = false;
            state.blogs = action.payload;
            state.error = null;
        },
        fetchFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchStart, fetchSuccess, fetchFailure } = blogSlice.actions;
export default blogSlice.reducer;
