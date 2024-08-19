import React, { useEffect, useState } from 'react'
import axios from 'axios'
import s from "../pages/styles/AddNewBook.module.css"

export default function AddNewBook({ setAddBookModal }) {
    const [newBook, setNewBook] = useState({
        name: "",
        year: "",
        author: "",
        description: "",
        price: "",
        category: "",
        image: ""
    })

    const [authors, setAuthors] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchAllAuthors = async () => {
            const { data } = await axios.get(`http://localhost:3000/api/auth/allusers`)
            setAuthors(data)
            console.log(authors);
        }
        const fetchAllCategories = async () => {
            const { data } = await axios.get(`http://localhost:3000/api/categories`)
            setCategories(data)
            console.log(categories);
        }

        fetchAllAuthors();
        fetchAllCategories();
    }, [])

    const getInputValue = (e) => {
        setNewBook({
            ...newBook,
            [e.target.name]: e.target.value
        })
    }

    const handleAddNewBook = async (e) => {
        e.preventDefault()
        try {
            console.log(newBook)
            await axios.post("http://localhost:3000/api/books", newBook)
            setAddBookModal(false)
        } catch (error) {
            console.log(error)
        }
    }

    const uploadImage = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append("image", file);
        const { data } = await axios.post("http://localhost:3000/api/upload-image", formData);
        console.log(data)
        setNewBook({
            ...newBook,
            image: data?.imgUrl
        })
    }

    return (
        <div className={s.wrapper}>
            <form onSubmit={(e) => handleAddNewBook(e)}>
                <button onClick={() => setAddBookModal(false)} type="button" className="btn-close" aria-label="Close"></button>
                <h1>Add New Book</h1>
                <input onChange={getInputValue} name='name' type="text" placeholder='Name of book' />
                <input onChange={getInputValue} name='year' type="text" placeholder='Year' />
                {/* <Select onValueChange={handleSelectChange} name="author">
                    <SelectTrigger>
                        <SelectValue placeholder="select author" value="" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Authors</SelectLabel>
                            {authors?.map((author) => (
                                <SelectItem key={author?._id} value={author?._id}>{author?.fullName}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select> */}
                <input onChange={getInputValue} name='description' type="text" placeholder='Description' />
                {/* <input onChange={getInputValue} name='image' type="text" placeholder='Image URL' /> */}
                <input onChange={getInputValue} name='price' type="text" placeholder='Price' />
                {/* <input onChange={getInputValue} name='category' type="text" placeholder='Genre' /> */}
                {/* <input onChange={getInputValue} name='author' type="text" placeholder='Author' /> */}
                <select onChange={getInputValue} name="author" className='p-[0.5rem]'>
                    <option value="">Select Author</option>
                    {authors?.map((author) => (
                        <option key={author?._id} value={author?._id}>{author?.fullName}</option>
                    ))}
                </select>
                <select onChange={getInputValue} name="category" className='p-[0.5rem]'>
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                        <option key={cat?._id} value={cat?.name}>{cat?.name}</option>
                    ))}
                </select>
                <form action="/profile" method="post" enctype="multipart/form-data">
                    <input onChange={uploadImage} className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="image" type="file" name="image" ></input>
                </form>
                <button type="submit" className="btn btn-success">Create</button>
            </form>
        </div>
    )
}