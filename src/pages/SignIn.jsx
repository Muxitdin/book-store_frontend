import { useState } from "react"
import AddNewBook from "../components/AddNewBook.jsx"
import AddNewCategory from "../components/AddNewCategory.jsx"
import s from "./styles/SignIn.module.css"

export default function SignIn() {
    const [addBookModal, setAddBookModal] = useState(false)
    const [addCategoryModal, setAddCategoryModal] = useState(false)


    return (
        <div className={s.wrapper}>
            <div className={s.container}>
                <button onClick={() => setAddCategoryModal(true)} type="button" className="btn btn-primary">Add Category</button>
                <button onClick={() => setAddBookModal(true)} type="button" className="btn btn-success">Add Book</button>
                { addBookModal && <AddNewBook setAddBookModal={setAddBookModal} /> }
                { addCategoryModal && <AddNewCategory setAddCategoryModal={setAddCategoryModal}/> }
            </div>
        </div>
    )
}