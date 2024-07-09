import { createSlice } from "@reduxjs/toolkit";
import { clearLocalStorage, saveToLocalStorage } from "../../config/localstorage";
import Service from "../../config/service";

const initialState = {
    isLoading: false,
    auth: null,
    isLoggedIn: false,
    isError: null,
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authStart: (state) => {
            state.isLoading = true;
        },
        authSuccess: (state, action) => {
            state.isLoading = false;
            state.auth = action.payload;
            state.isLoggedIn = true;
            if (action.payload.token) {
                saveToLocalStorage("token", action.payload.token);
            }
        },
        authFailure: (state, action) => {   
            state.isLoading = false;
            state.isError = action.payload;
        },
        authLogout: (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = false;
            clearLocalStorage();
        },
    },
});

export const {
    authStart,
    authSuccess,
    authFailure,
    authLogout,
} = AuthSlice.actions;
export default AuthSlice.reducer;

export const getAuthFunction = () => async dispatch =>{
    try {
        const { data } = await Service.getAuth();
        await dispatch(authSuccess(data));
    } catch (error) {
        console.log(error)
    }
}

export const addToCart = ( userId, bookId ) => async dispatch => {
    try {
        const { data } = await Service.addBookToCart(userId, bookId);
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const deleteFromCart = ( userId, itemId ) => async dispatch => {
    try {
        const { data } = await Service.deleteBookFromCart(userId, itemId);
        return data;
    } catch (error) {
        console.log(error);
    }
}