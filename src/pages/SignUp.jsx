import { React, useState, useEffect } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import axios from "axios"
import { saveToLocalStorage } from "../config/localstorage.js"
import s from "./styles/SignUp.module.css"

export default function SignUp() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        fullName: "",
        email: "",
        password: "",
    })


    const handleCreateNewUser = async (e) => {
        e.preventDefault();
        console.log(newUser);
        try {
            const { data } = await axios.post("http://localhost:3000/api/auth/register", newUser);
            console.log(data)
            const token = data.token;
            const user = data.user;
            console.log("Token received:", token);
            saveToLocalStorage("token", token);
            // saveToLocalStorage("user", JSON.stringify(user));
            navigate("/verification");
            document.location.reload();
        } catch (error) {
            console.log("Error creating user:", error);
        }
    }

    const getInputValue = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className={s.wrapper}>
            <form onSubmit={handleCreateNewUser}>
                <h1 className="font-mono mb-3">Registration</h1>
                <input onChange={getInputValue} className="w-full" name='fullName' type="text" placeholder='Full Name' />
                <input onChange={getInputValue} className="w-full" name='email' type="email" placeholder='E-mail' />
                <input onChange={getInputValue} className="w-full" name='password' type="password" placeholder='Password' />
                <button type="submit" className="w-full btn btn-success font-mono">Sign Up</button>
                <NavLink
                    to="/signin"
                    className="text-blue-400 hover:underline cursor-pointer self-end">
                    already have an account?
                </NavLink>
            </form>
        </div>
    )
}