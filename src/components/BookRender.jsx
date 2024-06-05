import React from 'react'
import s from "../pages/styles/BookRenderer.module.css";

function BookRender({ books, isLoading }) {
    return (
        <div className={s.wrapper}>
            {
                isLoading ? <div className={s.loaderWrapper}><div className={s.loader}></div></div> :
                <>
                    {
                        books.map(book => (
                            <div className={s.singleBook} key={book._id}>
                                <img src={book.image} alt="poster" />
                                <h3>{book.name}</h3>
                                <p>{book.author}</p>
                                {/* <p>{book.description}</p> */}
                                <p>{book.category}</p>
                                <button> 
                                    <i class="fa-regular fa-heart"></i>
                                </button>
                            </div>
                        ))
                    }
                </>
            }
            {
                !isLoading && books.length === 0 ? <h1 className={s.notfound}>No book found</h1> : null
            }
        </div>
    )
}

export default BookRender;