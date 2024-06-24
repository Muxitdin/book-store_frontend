import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookFailure, bookStart, bookSuccess } from "../redux/slice/bookSlice";
import { fetchCategories, deleteCategory, updateCategory } from "../redux/slice/categorySlice";
import Service from "../config/service.js";
import UpdateCategory from "../components/UpdateCategory";
import s from "./styles/Navbar.module.css";

export default function Navbar() {
    const dispatch = useDispatch();
    const { categories, isLoading } = useSelector(state => state.category);
    const { auth, isLoggedIn } = useSelector(state => state.auth);
    const [editModal, setEditModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [showEditButtons, setShowEditButtons] = useState(false); // State for toggling buttons
    const [currentActive, setCurrentActive] = useState(""); // State for active genre button

    console.log(isLoggedIn, auth?.role)

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDelete = async (id) => {
        dispatch(deleteCategory(id));
        dispatch(fetchCategories());
    };

    const toggleEditButtons = () => {
        setShowEditButtons(!showEditButtons);
    };

    // const handleClickTakeAll = async () => {
    //     try {
    //         dispatch(bookStart());
    //         const { data } = await axios.get(`http://localhost:5000/api/books`);
    //         setCurrentActive("all");
    //         dispatch(bookSuccess({ type: "b", data }));
    //     } catch (error) {
    //         console.log(error);
    //         dispatch(bookFailure(error.message));
    //     }
    // }

    const handleClickGenre = async (genre) => {
        try {
            dispatch(bookStart());
            const data = await Service.getAllBooksFilter({ params: { category: genre } });
            dispatch(bookSuccess({ type: "b", data }));
            setCurrentActive(genre);
        } catch (error) {
            console.log(error);
            dispatch(bookFailure(error.message));
        }
    }

    const getBtnClass = (genre) => {
        return currentActive === genre ? `${s.active}` : "";
    }

    return (
        <div className={s.wrapper}>
            <div className={s.upperNav}>
                <ul className="nav justify-content-between">
                    <div>
                        <li><a href="/">Home</a></li>
                        <li><a href="/wishlist">Wish List</a></li>
                    </div>
                    { isLoggedIn && auth?.role ? (
                        <div>
                            <div className={s.profileInfo} ><p>{`${auth?.fullName}`}</p><p>{`${auth?.role}`}</p></div>
                            <li className={s.profileIcon}><a href="/profile"><i className="fa-solid fa-user"></i></a></li>
                        </div>
                    ) : (
                        <div>
                            <li><a href="/signup">Create an Account</a></li>
                            <li><a href="/signin">LogIn</a></li>
                        </div>
                    )}
                </ul>
            </div>

            <nav className="navbar">
                <div className="container-fluid">
                    <a href="/" className={s.logo + " navbar-brand"}><i className="fa-solid fa-book"></i>REAL<span>BOOKS</span></a>
                    <form className="d-flex flex-row" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>

            <div className={s.lowerNav}>
                {isLoggedIn && auth?.role === "admin" ? (
                    <button onClick={toggleEditButtons} type="button" className="btn btn-secondary"><i className="fa-solid fa-pen"></i></button>
                ) : ( null )}
                <ul>
                    {isLoading ? (
                        <li>Loading...</li>
                    ) : (
                        categories.map(category => (
                            <li key={category._id} className={getBtnClass(category.name)} onClick={() => handleClickGenre(category.name)}>{category.name}
                                {showEditButtons && (
                                    <div className={s.editButtons}>
                                        <button
                                            onClick={() => {
                                                setCurrentCategory(category);
                                                setEditModal(true);
                                            }}
                                            className="btn btn-sm btn-warning"
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))
                    )}
                </ul>

                { editModal && <UpdateCategory category={currentCategory} setEditModal={setEditModal} editModal={editModal} /> }
                
            </div>
        </div>
    )
}