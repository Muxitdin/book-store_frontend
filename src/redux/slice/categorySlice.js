import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        isLoading: false, // here i used isLoading instead of loading
        error: null
    },
    reducers: {
        categoryStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        categorySuccess: (state, action) => {
            state.isLoading = false;
            state.categories = action.payload;
        },
        categoryFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        addCategorySuccess: (state, action) => {
            state.categories.push(action.payload);
        },
        updateCategorySuccess: (state, action) => {
            const index = state.categories.findIndex(category => category._id === action.payload._id);
            state.categories[index] = action.payload;
        },
        deleteCategorySuccess: (state, action) => {
            state.categories = state.categories.filter(category => category._id !== action.payload);
        }
    }
})

export const { categoryStart, categorySuccess, categoryFailure, addCategorySuccess, updateCategorySuccess, deleteCategorySuccess } = categorySlice.actions;
export default categorySlice.reducer;

export const fetchCategories = () => async dispatch => {
    dispatch(categoryStart());
    try {
        const { data } = await axios.get('http://localhost:5000/api/categories');
        dispatch(categorySuccess(data));
        return data;
    } catch (error) {
        dispatch(categoryFailure(error.message));
        throw error;
    }
};

export const addCategory = (category) => async dispatch => {
    dispatch(categoryStart());
    try {
        const { data } = await axios.post('http://localhost:5000/api/categories/add', category);
        dispatch(addCategorySuccess(data));
    } catch (error) {
        dispatch(categoryFailure(error.message));
    }
};

export const updateCategory = (id, category) => async dispatch => {
    dispatch(categoryStart());
    try {
        const { data } = await axios.put(`http://localhost:5000/api/categories/update/${id}`, category);
        dispatch(updateCategorySuccess(data));
        return data;
    } catch (error) {
        dispatch(categoryFailure(error.message));
        throw error;
    }
};

export const deleteCategory = (id) => async dispatch => {
    dispatch(categoryStart());
    try {
        await axios.delete(`http://localhost:5000/api/categories/delete/${id}`);
        dispatch(deleteCategorySuccess(id));
    } catch (error) {
        dispatch(categoryFailure(error.message));
    }
};
