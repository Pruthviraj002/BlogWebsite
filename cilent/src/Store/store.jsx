import { configureStore } from "@reduxjs/toolkit";
import blogSlice from "../Slice/blogSlice"
import userSlice from '../Slice/userSlice'

const store = configureStore({
    reducer: {
        blog: blogSlice,
        user: userSlice
    },
    devTools: true
})

export default store