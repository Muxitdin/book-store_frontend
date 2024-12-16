import { React, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom"
import { saveToLocalStorage } from "../config/localstorage.js"
import axios from "axios"
import Service from "../config/service.js";
import Swal from "sweetalert2";
import s from "./styles/SignUp.module.css"
import { Toast } from '@/config/sweetAlert.js'

export default function SignIn() {
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector(state => state.auth);

    if (isLoggedIn) {
        navigate("/profile")
    }

    const [newUser, setNewUser] = useState({
        email: "",
        password: ""
    })

    const handleLogInUser = async (e) => {
        e.preventDefault();
        console.log(newUser)
        try {
            const { data } = await axios.post("http://localhost:3000/api/auth/login", newUser);
            const token = data.token;
            saveToLocalStorage("token", token);
            navigate("/profile")
            document.location.reload();
        } catch (error) {
            console.log(error);
            Toast.fire({ icon: "error", title: error?.response?.data?.message || error.message })
        }
    }

    const getInputValue = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        })
    }

    const handleIsForgotPassword = async (e) => {
        e.stopPropagation();
        Swal.fire({
            title: "Insert your email",
            html: `<p>We will send you an email to <b>reset</b> your <b>password</b></p>`,
            input: "email",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Send",
            cancelButtonText: "Cancel",
            showLoaderOnConfirm: true,
            preConfirm: async (inputValue) => {
                try {
                    if (inputValue === "") return Swal.showValidationMessage("Please, insert an email");
                    const data = await Service.findUserByEmail(inputValue);
                    console.log(data)
                    return data;
                } catch (error) {
                    Swal.showValidationMessage(error?.response?.data?.message || error.message);
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: result?.value?.message,
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        });
    };
    
    return (
        <div className={s.wrapper}>
            <form onSubmit={handleLogInUser}>
                <h1 className="font-mono mb-3">Log In</h1>
                <input onChange={getInputValue} className="w-full" name='email' type="email" placeholder='E-mail' />
                <input onChange={getInputValue} className="w-full" name='password' type="password" placeholder='Password' />
                <button type="submit" className="w-full btn btn-success font-mono">Log In</button>
                <div className="w-full flex justify-between items-center">
                    <p
                        onClick={(e) => handleIsForgotPassword(e)}
                        className="text-blue-400 hover:underline cursor-pointer">
                        forgot password?
                    </p>
                    <NavLink
                        to="/signup"
                        className="text-blue-400 hover:underline cursor-pointer">
                        create an account
                    </NavLink>
                </div>
            </form>
        </div>
    )
}