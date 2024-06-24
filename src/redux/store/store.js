import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "../slice/bookSlice.js";
import categorySlice from "../slice/categorySlice.js";
import authSlice from "../slice/authSlice.js";

export const store = configureStore({
    reducer: {
        book: bookSlice,
        category: categorySlice,
        auth: authSlice,
    }
});