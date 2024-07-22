import { React, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { saveToLocalStorage } from "../config/localstorage.js"
import s from "./styles/SignUp.module.css"
import Service from "../config/service.js";
import Swal from "sweetalert2";

export default function SignIn() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        email: "",
        password: ""
    })

    const handleLogInUser = async (e) => {
        e.preventDefault();
        console.log(newUser)
        try {
            const { data } = await axios.post("http://localhost:3000/api/auth/login", newUser);
            console.log(data)
            const token = data.token;
            const user = data.user;
            console.log("Token received:", token);
            saveToLocalStorage("token", token);
            navigate("/profile")
            document.location.reload();
        } catch (error) {
            console.log(error);
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
                <h1>Log In</h1>
                <input onChange={getInputValue} className="w-full" name='email' type="email" placeholder='E-mail' />
                <input onChange={getInputValue} className="w-full" name='password' type="password" placeholder='Password' />
                <p
                    onClick={(e) => handleIsForgotPassword(e)}
                    className="text-blue-500 hover:underline self-start cursor-pointer">
                    forgot password?
                </p>
                <button type="submit" className="btn btn-success">Log In</button>
            </form>
        </div>
    )
}