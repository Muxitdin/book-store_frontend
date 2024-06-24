import { React, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { saveToLocalStorage } from "../config/localstorage.js"
import s from "./styles/SignIn.module.css"

export default function SignIn() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        email: "",
        password: ""
    })

    const handldeLogInUser = async (e) => {
        e.preventDefault();
        console.log(newUser)
        try {
            const { data } = await axios.post("http://localhost:5000/api/auth/login", newUser);
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

    return (
        <div className={s.wrapper}>
            <form onSubmit={handldeLogInUser}>
                <h1>Log In</h1>
                <input onChange={getInputValue} name='email' type="email" placeholder='E-mail' />
                <input onChange={getInputValue} name='password' type="password" placeholder='Password' />
                <button type="submit" className="btn btn-success">Log In</button>
            </form>
        </div>
    )
}