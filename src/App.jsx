import { React, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authFailure, authSuccess } from "./redux/slice/authSlice.js";
import { getFromLocalStorage } from "./config/localstorage.js";
import { Route, Routes } from "react-router-dom";
import Service from "./config/service.js"
import s from "./App.module.css";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const getAuthFunction = async () => {
      try {
        const { data } = await Service.getAuth();
        console.log(data)
        dispatch(authSuccess(data));
      } catch (error) {
        dispatch(authFailure(error.message))
        console.log(error)
      }
    };

    if (getFromLocalStorage("token")) {
      getAuthFunction();
    }
  }, []);


  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        {/* Navbar */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}