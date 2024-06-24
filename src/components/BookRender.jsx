import React, { useEffect } from 'react'
import Service from '../config/service.js';
import { bookFailure, bookStart, bookSuccess } from "../redux/slice/bookSlice";
import { useDispatch, useSelector } from 'react-redux';
import s from "../pages/styles/BookRenderer.module.css";


function BookRender({ books, isLoading}) {
    const { auth, isLoggedIn } = useSelector(state => state.auth);
    const dispatch = useDispatch();

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


    const handleDeleteBook = async (id) => {
        try {
            await Service.deleteBook(id);
            document.location.reload();
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className={s.wrapper}>
            {
                isLoading ? <div className={s.loaderWrapper}><div className={s.loader}></div></div> :
                    <>
                        {
                            books?.map(book => (
                                <div className={s.singleBook} key={book._id}>
                                    <div className={s.singleBook_wrapper}>
                                        <img src={book.image} alt="poster" />
                                        <h3>{book.name}</h3>
                                        <p>{book?.author?.fullName}</p>
                                        {/* <p>{book.description}</p> */}
                                        <p>{book.category}</p>
                                        <div className={s.btnwrapper}>
                                            <div className={s.like_btn}>
                                                <i class="fi fi-ss-heart"></i>
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
                    </>
            }
            {
                !isLoading && books?.length === 0 ? <h1 className={s.notfound}>No book found</h1> : null
            }
        </div>
    )
}

export default BookRender;