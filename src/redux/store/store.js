import { configureStore } from "@reduxjs/toolkit";
import bookSlice from "../slice/bookSlice.js";
import categorySlice from "../slice/categorySlice.js";

export const store = configureStore({
    reducer: {
        book: bookSlice,
        category: categorySlice
    }
});