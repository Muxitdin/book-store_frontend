import React, { useEffect, useState } from 'react'
import Service from '../config/service.js';

import { useDispatch, useSelector } from 'react-redux';
import { bookFailure, bookStart, bookSuccess } from "../redux/slice/bookSlice.js";
import { getAuthFunction, deleteFromCart } from "../redux/slice/authSlice.js";
import { getFromLocalStorage } from '../config/localstorage.js';
import s from "../pages/styles/BookRenderer.module.css";


export default function Cart() {
    const dispatch = useDispatch();

    const { isLoading } = useSelector(state => state.book)
    const { auth, isLoggedIn } = useSelector(state => state.auth)

    const [renderToggler, setRenderToggler] = useState(false)

    useEffect(() => {
        setRenderToggler(!renderToggler);
    }, [auth])


    const handleAddToCart = async (userId, bookId) => {
        if (isLoggedIn) {
            try {
                await Service.addBookToCart(userId, bookId)
                if (getFromLocalStorage("token")) {
                    dispatch(getAuthFunction());
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            navigate("/login")
        }
    }

    const handleRemoveBookFromCart = async (userId, itemId, auth, item) => {
        console.log(itemId)
        try {
            await Service.removeBookFromCart(userId, itemId);

            if ((auth?.basket?.reduce((total, item) => total + item?.count, 0)) <= 1) {
                dispatch(deleteFromCart(userId, itemId));
                console.log('Cart is now empty')
                dispatch(getAuthFunction());
            }

            dispatch(getAuthFunction());
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteBookFromCart = async (userId, itemId) => {
        console.log(itemId)
        try {
            dispatch(deleteFromCart(userId, itemId))
            // dispatch(getAuthFunction());
            document.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        isLoggedIn && (
            <div className={s.wrapper}>
                <h1 className="text-center text-4xl text-slate-600">Cart</h1>
                {
                    isLoading ? <div className={s.loaderWrapper}><div className={s.loader}></div></div> :
                        <div className={s.content_wrapper}>
                            {
                                auth?.basket?.map(item => (
                                    <div className={s.singleBook} key={item.book?._id}>
                                        <div className={s.singleBook_wrapper}>
                                            <img src={item?.book?.image} alt="poster" />
                                            <h3>{item?.book?.name}</h3>
                                            <p>{item?.book?.author?.fullName}</p>
                                            {/* <p>{book.description}</p> */}
                                            <p>{item?.book?.category}</p>
                                            <div className={s.btnwrapper}>
                                                {/* <div className={s.like_btn}>
                                                    <i class="fi fi-ss-heart"></i>
                                                </div> */}
                                                <div className={s.price}>
                                                    ${item?.book?.price}
                                                </div>
                                                {isLoggedIn ? (
                                                    <>
                                                        <div>
                                                            <button onClick={() => handleAddToCart(auth._id, item?.book?._id)} className="btn btn-sm btn-primary">+</button>
                                                            <span>{auth?.basket?.find(product => product?._id === item?._id)?.count}</span>
                                                            <button onClick={() => handleRemoveBookFromCart(auth._id, item?._id, auth, item)} className="btn btn-sm btn-primary">-</button>
                                                        </div>
                                                        <div className={s.edit_delete_btns}>
                                                            {/* <button className="btn btn-sm btn-warning"><i class="fa-solid fa-pen-to-square"></i></button> */}
                                                            <button onClick={() => handleDeleteBookFromCart(auth._id, item?._id)} className="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></button>
                                                        </div>
                                                    </>
                                                ) : (<></>)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                }
                {
                    !isLoading && auth?.basket?.length === 0 ? <h1 className={s.notfound}>No book found</h1> : null
                }
            </div>
        )
    )
}