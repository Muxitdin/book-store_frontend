import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory, updateCategory } from "../redux/slice/categorySlice";
import { bookFailure, bookStart, bookSuccess } from "../redux/slice/bookSlice";
import UpdateCategory from "../components/UpdateCategory";
import s from "./styles/Navbar.module.css";
import axios from "axios";

export default function Navbar() {
    const dispatch = useDispatch();
    const { categories, isLoading } = useSelector(state => state.category);  // and here i also use isLoading instead of loading
    const [editModal, setEditModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [showEditButtons, setShowEditButtons] = useState(false); // State for toggling buttons
    const [currentActive, setCurrentActive] = useState(""); // State for active genre button

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDelete = async (id) => {
        dispatch(deleteCategory(id));
        dispatch(fetchCategories());
        const { data } = await axios.get(`http://localhost:5000/api/books`);
        dispatch(bookSuccess({ type: "b", data }));
    };

    const toggleEditButtons = () => {
        setShowEditButtons(!showEditButtons);
    };

    const handleClickTakeAll = async () => {
        try {
            dispatch(bookStart());
            const { data } = await axios.get(`http://localhost:5000/api/books`);
            setCurrentActive("all");
            dispatch(bookSuccess({ type: "b", data }));
        } catch (error) {
            console.log(error);
            dispatch(bookFailure(error.message));
        }
    }

    const handleClickGenre = async (genre) => {
        try {
            dispatch(bookStart());
            const { data } = await axios.get("http://localhost:5000/api/books/filter", { params: { category: genre } })
            setCurrentActive(genre);
            dispatch(bookSuccess({ type: "b", data }));
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
                <ul className="nav justify-content-center">
                    <li><a href="/">Home</a></li>
                    <li><a href="/wishlist">Wish List</a></li>
                    <li><a href="/signup">Create an Account</a></li>
                    <li><a href="/signin">LogIn</a></li>
                </ul>
            </div>

            <nav className="navbar">
                <div className="container-fluid">
                    <a href="/" class="navbar-brand" className={s.logo}><i className="fa-solid fa-book"></i>REAL<span>BOOKS</span></a>
                    <form className="d-flex flex-row" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>

            <div className={s.lowerNav}>
                <button onClick={toggleEditButtons} type="button" className="btn btn-secondary"><i class="fa-solid fa-pen"></i></button>
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
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))
                    )}



                    {/* <li className={getBtnClass("all")} onClick={() => handleClickTakeAll()}>All books</li>
                    <li className={getBtnClass("detective")} onClick={() => handleClickGenre("detective")}>Detectives</li>
                    <li className={getBtnClass("adventure")} onClick={() => handleClickGenre("adventure")}>Adventures</li>
                    <li className={getBtnClass("novel")} onClick={() => handleClickGenre("novel")}>Novel</li> */}
                </ul>

                { editModal && <UpdateCategory category={currentCategory} setEditModal={setEditModal} editModal={editModal} /> }
            </div>
        </div>
    )
}