import React, { useEffect, useState } from 'react'
import Service from '../config/service.js';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthFunction, deleteFromCart, authFailure, authStart, authSuccess } from "../redux/slice/authSlice.js";
import { getFromLocalStorage } from '../config/localstorage.js';
import s from "../pages/styles/BookRenderer.module.css";
import { Toast } from '@/config/sweetAlert.js';
import StripeCheckout from "react-stripe-checkout";
import logo from "../images/book.png"
import { NavLink } from 'react-router-dom';

export default function Cart() {
    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state.book)
    const { auth, isLoggedIn } = useSelector(state => state.auth)
    const [renderToggler, setRenderToggler] = useState(false)

    const stripeKey = "pk_test_51PdlyKIiH8xXNpUEUBvM5IzD8UjjyYt1s5pJLxwtRetrUkPEKcSToYaMbBxN3FVsYL0gf0qOXSEZCC5RzpSiJXPa00tCF7L7Ym"
    const [stripeToken, setStripeToken] = useState(null)

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
                Toast.fire({
                    icon: 'success',
                    title: 'Added one more'
                })
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

            if ((auth?.basket?.reduce((total, item) => total + item?.count, 0)) < 1) {
                dispatch(deleteFromCart(userId, itemId));
                console.log('Cart is now empty')
                dispatch(getAuthFunction());
            }
            Toast.fire({
                icon: 'success',
                title: 'Removed from cart'
            })
            dispatch(getAuthFunction());
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteBookFromCart = async (userId, itemId) => {
        console.log(itemId)
        try {
            await Service.deleteBookFromCart(userId, itemId);

            if (getFromLocalStorage("token")) {
                dispatch(getAuthFunction());
            }
            Toast.fire({
                icon: 'success',
                title: 'Deleted from cart'
            })
        } catch (error) {
            console.log(error);
        }
    }

    const totalAmount = auth?.basket?.reduce((total, item) => total + (item?.book?.price * item?.count), 0)
    const products = auth?.basket?.map(item => item?.book?._id); // get all the item ids from the cart

    const onToken = async (token) => {
        setStripeToken(token);
    };

    useEffect(() => {
        const handlePaymentFunction = async () => {
            try {
                dispatch(authStart())
                const { data, message } = await Service.payment({ totalAmount, currency: "USD", source: stripeToken?.id, products });
                dispatch(authSuccess(data));
                console.log(data)
                Toast.fire({ icon: 'success', title: message })
            } catch (error) {
                console.log(error)
            } finally {
                dispatch(authFailure())
            }
        }

        if (stripeToken) handlePaymentFunction();
    }, [stripeToken])

    return (
        isLoggedIn && (
            <div className={`${s.wrapper} h-[calc(100vh-197px)]`}>
                <div className="flex items-center justify-between">
                    {
                        auth?.basket?.length !== 0 &&
                        <StripeCheckout
                            name="Book Store"
                            description={`Total amount: ${totalAmount?.toLocaleString()} USD`}
                            ComponentClass="div"
                            token={onToken}
                            panelLabel="To'lash"
                            currency="USD"
                            stripeKey={stripeKey}
                            shippingAddress
                        >
                            <button className="rounded-md bg-gray-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                перейти к оформлению
                            </button>
                        </StripeCheckout>
                    }
                </div>
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
                                            <p>{item?.book?.category}</p>
                                            <div className={s.btnwrapper}>
                                                <div className={s.price}>
                                                    ${(item?.book?.price * item?.count)}
                                                </div>
                                                {isLoggedIn ? (
                                                    <>
                                                        <div className='font-semibold flex items-center'>
                                                            <button onClick={() => handleAddToCart(auth._id, item?.book?._id)} className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200">+</button>
                                                            <span className='mx-1'>{auth?.basket?.find(product => product?._id === item?._id)?.count}</span>
                                                            <button onClick={() => handleRemoveBookFromCart(auth._id, item?._id, auth, item)} className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200">-</button>
                                                        </div>
                                                        <div className={s.edit_delete_btns}>
                                                            <button onClick={() => handleDeleteBookFromCart(auth?._id, item?._id)} className="btn btn-sm btn-danger"><i className="fa-solid fa-trash"></i></button>
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
                    !isLoading && auth?.basket?.length === 0 ? (
                        <>
                            <h1 className={`${s.notfound} text-4xl font-semibold text-[#666]`} >your cart is empty</h1>
                            <p className='text-center font-semibold text-l text-gray-800 mt-2 hover:underline'><NavLink to="/">go Home</NavLink></p>
                        </>
                    ) : null
                }
            </div>
        )
    )
}