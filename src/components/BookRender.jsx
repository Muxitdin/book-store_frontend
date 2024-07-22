import React, { useEffect } from 'react'
import Service from '../config/service.js';
import { bookFailure, bookStart, bookSuccess } from "../redux/slice/bookSlice";
import { getAuthFunction } from "../redux/slice/authSlice.js";
import { useDispatch, useSelector } from 'react-redux';
import s from "../pages/styles/BookRenderer.module.css";
import { FaCartShopping } from "react-icons/fa6";
import { getFromLocalStorage } from '../config/localstorage.js';
import { useNavigate } from 'react-router-dom';
import { Toast } from '@/config/sweetAlert.js';


function BookRender({ books, isLoading, query }) {
    const { auth, isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const getAllBooks = async () => {
            dispatch(bookStart());
            try {
                const data = await Service.getAllBooks();
                dispatch(bookSuccess({ type: "b", data }));
            } catch (error) {
                dispatch(bookFailure());
                console.error('Error fetching books:', error);
            }
        }
        getAllBooks();
    }, [])

    const handleAddToCart = async (userId, bookId) => {
        if (isLoggedIn) {
            try {
                await Service.addBookToCart(userId, bookId)
                if (getFromLocalStorage("token")) {
                    dispatch(getAuthFunction());
                }
                // navigate("/cart")
                Toast.fire({
                    icon: 'success',
                    title: 'Book added to cart'
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            navigate("/login")
        }
    }

    const handleDeleteBook = async (id) => {
        try {
            await Service.deleteBook(id);
            if (getFromLocalStorage("token")) {
                const getAllBooks = async () => {
                    dispatch(bookStart());
                    try {
                        const data = await Service.getAllBooks();
                        dispatch(bookSuccess({ type: "b", data }));
                    } catch (error) {
                        dispatch(bookFailure());
                        console.error('Error fetching books:', error);
                    }
                }
                getAllBooks();
            }
            Toast.fire({
                icon: 'success',
                title: 'Deleted successfully'
            })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className={s.wrapper}>
            <h1 className="text-center text-4xl text-slate-600">All Books</h1>
            {
                isLoading ? <div className={s.loaderWrapper}><div className={s.loader}></div></div> :
                    <div className={s.content_wrapper}>
                        {
                            books?.filter((book) => {
                                return book?.name?.toLowerCase().includes(query.toLowerCase()) ||
                                    book?.author?.fullName.toLowerCase().includes(query.toLowerCase()) ||
                                    book?.category?.toLowerCase().includes(query.toLowerCase())
                            }).map(book => (
                                <div className={s.singleBook} key={book._id}>
                                    <div className={s.singleBook_wrapper}>
                                        <img src={book.image} alt="poster" />
                                        <h3>{book.name}</h3>
                                        <p>{book?.author?.fullName}</p>
                                        {/* <p>{book.description}</p> */}
                                        <p>{book.category}</p>
                                        <div className={s.btnwrapper}>
                                            {/* <div className={s.like_btn}>
                                                <i class="fi fi-ss-heart"></i>
                                            </div> */}
                                            <div className={s.price}>
                                                ${book.price}
                                            </div>
                                            <div className={s.edit_delete_btns}>
                                                <button onClick={() => handleAddToCart(auth._id, book._id)}><FaCartShopping /></button>
                                            </div>
                                            {isLoggedIn && auth?.role === "admin" ? (
                                                <div className={s.edit_delete_btns}>
                                                    <button className="btn btn-sm btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                                                    <button onClick={() => handleDeleteBook(book._id)} className="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></button>
                                                </div>
                                            ) : (<></>)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
            }
            {
                !isLoading && books?.length === 0 ? <h1 className={s.notfound}>No book found</h1> : null
            }
        </div>
    )
}

export default BookRender;