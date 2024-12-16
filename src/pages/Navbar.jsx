import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookFailure, bookStart, bookSuccess } from "../redux/slice/bookSlice";
import { fetchCategories, deleteCategory } from "../redux/slice/categorySlice";
import Service from "../config/service.js";
import UpdateCategory from "../components/UpdateCategory";
import s from "./styles/Navbar.module.css";
import logo from '../images/book.png';
import { GoHeart } from "react-icons/go";
import { IoCart, IoCartOutline, IoPersonOutline, IoPerson } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar({ setQuery }) {
    const dispatch = useDispatch();
    const { categories, isLoading } = useSelector(state => state.category);
    const { auth, isLoggedIn } = useSelector(state => state.auth);
    const [editModal, setEditModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [showEditButtons, setShowEditButtons] = useState(false);
    const [cat, setCat] = useState("")

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { value } = e.target;
        setQuery(value);
    }

    const handleDelete = async (id) => {
        try {
            dispatch(deleteCategory(id));
            dispatch(fetchCategories());
        } catch (error) {
            console.log(error);
        }
    };

    const toggleEditButtons = () => {
        setShowEditButtons(!showEditButtons);
    };

    const handleClickGenre = async (genre, id) => {
        try {
            dispatch(bookStart());
            const data = await Service.getAllBooksFilter({ params: { category: genre } });
            dispatch(bookSuccess({ type: "b", data }));
            setCat(id);
        } catch (error) {
            console.log(error);
            dispatch(bookFailure(error.message));
        }
    }

    const location = useLocation();

    return (
        <>
            <nav className="bg-white shadow-lg relative z-20 px-32">
                <div className="flex items-center justify-between text-sm text-gray-500" >
                    <div className="flex items-center justify-between gap-4 cursor-pointer w-full">
                        <ul className="navbar">
                            <div className="container-fluid">
                                <a href="/" className={s.logo + " navbar-brand"}><img src={logo} className="min-w-14 max-w-14 h-auto" alt="logo" /></a>
                            </div>
                        </ul>
                        <ul className="flex items-center gap-4 cursor-pointer">
                            <li className="d-flex flex-row">
                                <input onChange={handleInputChange} className="min-w-[300px] border-2 p-1.5 outline-gray-800" type="search" placeholder="Search" aria-label="Search" />
                            </li>
                            <li>
                                <NavLink className="flex items-center gap-1 text-black normal-case font-medium text-[17px]" to={isLoggedIn ? "/profile" : "/signin"}>
                                    {location.pathname === "/profile" ? <IoPerson className="text-xl" /> : <IoPersonOutline className="text-xl" />}
                                    <span>{auth?.fullName?.length > 8 ? auth?.fullName?.slice(0, 8) + "..." : auth?.fullName || "LogIn"}</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink className="flex items-center gap-1 text-black font-medium text-[17px]" to={isLoggedIn ? "/wishlist" : "/signin"}>
                                    {location.pathname === "/wishlist" ? <GoHeartFill className="text-xl" /> : <GoHeart className="text-xl" />}
                                    <span>Wishlist</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink className="flex items-center gap-1 text-black font-medium text-[17px]" to={isLoggedIn ? "/cart" : "/signin"}>
                                    {location.pathname === "/cart" ? <IoCart className="text-xl" /> : <IoCartOutline className="text-xl" />}
                                    <span>Cart</span>
                                    <span className="size-5 flex items-center justify-center rounded-full text-white bg-gray-800">{auth?.basket?.length || 0}</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {location.pathname === "/" && (
                <div className="mt-6 px-32 flex gap-2">
                    {isLoggedIn && auth?.role === true ? (
                        <button onClick={toggleEditButtons} type="button" className="btn"><i className="fa-solid fa-pen text-m"></i></button>
                    ) : (null)}
                    <ul className="flex flex-row gap-4 ">
                        {isLoading ? (
                            <li>Loading...</li>
                        ) : (
                            categories.map(category => (
                                <li key={category._id} className={`${cat === category?._id ? 'bg-gray-800 text-white' : 'bg-white'} cursor-pointer px-4 py-2 shadow-md hover:bg-gray-800  transform`} onClick={() => handleClickGenre(category?.name, category?._id)}>{category.name}
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
                                                onClick={() => handleDelete(category?._id)}
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

                    {editModal && <UpdateCategory category={currentCategory} setEditModal={setEditModal} editModal={editModal} />}

                </div>
            )}
        </>
    )
}