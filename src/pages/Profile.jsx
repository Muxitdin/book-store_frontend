import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AddNewBook from "../components/AddNewBook.jsx"
import AddNewCategory from "../components/AddNewCategory.jsx"
import s from "./styles/Profile.module.css"
import { useSelector, useDispatch } from "react-redux"
import { authLogout } from "../redux/slice/authSlice.js"

export default function Profile() {
    const { auth, isLoggedIn } = useSelector(state => state.auth);
    const [addBookModal, setAddBookModal] = useState(false)
    const [addCategoryModal, setAddCategoryModal] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate()

    // console.log(isLoggedIn, auth?.role)

    if (!isLoggedIn && !auth?.role) {
        return null
    }

    const handleLogOut = () => {
        dispatch(authLogout())
        navigate("/")
        window.location.reload();
    }

    return (
        <div className={s.wrapper}>
            <div className={s.container}>
                {auth?.role === "admin" && (
                    <>
                        <button onClick={() => setAddCategoryModal(true)} type="button" className="btn btn-primary">Add Category</button>
                        <button onClick={() => setAddBookModal(true)} type="button" className="btn btn-success">Add Book</button>
                    </>
                )}
                <button onClick={handleLogOut} type="button" className="btn btn-danger">Log Out</button>
                {addBookModal && <AddNewBook setAddBookModal={setAddBookModal} />}
                {addCategoryModal && <AddNewCategory setAddCategoryModal={setAddCategoryModal} />}
            </div>
        </div>
    )
}