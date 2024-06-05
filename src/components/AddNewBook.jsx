import React, { useState } from 'react'
import axios from 'axios'
import s from "../pages/styles/AddNewBook.module.css"

export default function AddNewBook( {setAddBookModal} ) {
    const [newBook, setNewBook] = useState({
        name: "",
        year: "",
        author: "",
        description: "",
        price: "",
        category: "",
        image: ""
    })

    const getInputValue = (e) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        })
    }

    const handleAddNewBook = async (e) => {
        e.preventDefault()
        console.log(newBook)
        await axios.post("http://localhost:5000/api/books/", newBook)
        setAddBookModal(false)
    }

    return (
        <div className={s.wrapper}>
            <form onSubmit={(e) => handleAddNewBook(e)}>
                <button onClick={() => setAddBookModal(false)} type="button" class="btn-close" aria-label="Close"></button>
                <h1>Add New Book</h1>
                <input onChange={(e) => getInputValue(e)} name='name' type="text" placeholder='Name of book' />
                <input onChange={(e) => getInputValue(e)} name='year' type="text" placeholder='Year' />
                <input onChange={(e) => getInputValue(e)} name='author' type="text" placeholder='Author' />
                <input onChange={(e) => getInputValue(e)} name='description' type="text" placeholder='Description' />
                <input onChange={(e) => getInputValue(e)} name='image' type="text" placeholder='Image URL' />
                <input onChange={(e) => getInputValue(e)} name='price' type="text" placeholder='Price' />
                <input onChange={(e) => getInputValue(e)} name='category' type="text" placeholder='Genre' />
                <button type="submit" class="btn btn-success">Create</button>
            </form>
        </div>
    )
}