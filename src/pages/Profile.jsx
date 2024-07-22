import { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import AddNewBook from "../components/AddNewBook.jsx"
import AddNewCategory from "../components/AddNewCategory.jsx"
import s from "./styles/Profile.module.css"
import { useSelector, useDispatch } from "react-redux"
import { authLogout, updateUser } from "../redux/slice/authSlice.js"
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import Service from "@/config/service.js"
import { Toast } from "@/config/sweetAlert.js"


export default function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    
    const { auth, isLoggedIn } = useSelector(state => state.auth);

    const [addBookModal, setAddBookModal] = useState(false)
    const [addCategoryModal, setAddCategoryModal] = useState(false)

    const [isEditingFullName, setIsEditingFullName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (auth) {
            setFullName(auth?.fullName)
            setEmail(auth?.email)
        }
    }, [auth])
    


    if (!isLoggedIn && !auth?.role) {
        return null
    }

    const handleLogOut = () => {
        dispatch(authLogout())
        navigate("/")
        window.location.reload();
    }


    const handleEditData = (field) => {
        if (field === "fullName") {
            setIsEditingFullName(!isEditingFullName);
        } else if (field === "email") {
            setIsEditingEmail(!isEditingEmail);
        }
    };

    const handleSave = (field) => {
        if (field === "fullName") {
            dispatch(updateUser(auth?._id, { type: "fullName", value: fullName }))
            
            setIsEditingFullName(false);
        } else if (field === "email") {
            dispatch(updateUser(auth?._id, { type: "email", value: email }))
            // Update the user data with the new email
            // You can dispatch an action to update the user data in the redux store
            setIsEditingEmail(false);
        }
    };

    const handleSendVerificationEmail = async () => {
        try {
            const { data } = await Service.sendVerificationEmail( { email : auth?.email } );
            console.log(data)
            Toast.fire({
                icon: 'success',
                title: 'Verification email sent successfully'
            })
        } catch (error) {
            console.log(error)
        }
    } 

    return (
        <div className={s.wrapper}>
            <div className={s.inner_wrapper}>
                <div>
                    <h1 className="text-5xl font-serif mb-3">Welcome to Your Profile</h1>
                    <h3 className="text-xl  mb-5">{auth?.role}</h3>
                    <div className="w-3/5 flex flex-col gap-4 text-xl">
                        <div className="w-full flex justify-between gap-2">
                            <span className="text-gray-600">Full Name</span>
                            <div className="flex-grow border-b-2 border-b-gray-600 border-dashed"></div>
                            {isEditingFullName ? (
                                <> 
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="border px-2 py-2 mx-2"
                                    />
                                    <FaCheck onClick={() => handleSave("fullName")} className="mt-3 text-slate-600"/>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-900 font-medium">{fullName}</span> 
                                    <FaEdit onClick={() => handleEditData("fullName")} className="mt-1 ml-2 text-slate-600"/>
                                </>
                            )}
                        </div>

                        <div className="w-full flex justify-between gap-2">
                            <span className="text-gray-600">E-mail</span>
                            <div className="flex-grow border-b-2 border-b-gray-600 border-dashed"></div>
                            {isEditingEmail ? (
                                <>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border px-2 py-2 mx-2"
                                    />
                                    <FaCheck onClick={() => handleSave("email")} className="mt-3 text-slate-600"/>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-900 font-medium">{email}</span>
                                    <FaEdit onClick={() => handleEditData("email")} className="mt-1 ml-2 text-slate-600"/>
                                </>
                            )}
                        </div>
                        { !auth?.verified && <NavLink to="/verification" onClick={handleSendVerificationEmail} className="text-red-500">click here to verify your email</NavLink> }
                    </div>

                    <div className="w-3/5 mt-14 flex items-center justify-start gap-x-6">
                        {auth?.role === "admin" && auth?.verified === true && (
                            <>
                                <button onClick={() => setAddCategoryModal(true)} type="button" className="btn btn-primary">Add Category</button>
                                <button onClick={() => setAddBookModal(true)} type="button" className="btn btn-success">Add Book</button>
                            </>
                        )}
                        <button
                            onClick={handleLogOut}
                            type="button"
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            Log Out
                        </button>

                    </div>
                </div>


                {addBookModal && <AddNewBook setAddBookModal={setAddBookModal} />}
                {addCategoryModal && <AddNewCategory setAddCategoryModal={setAddCategoryModal} />}
            </div>
        </div>
    )
}







// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AddNewBook from "../components/AddNewBook.jsx";
// import AddNewCategory from "../components/AddNewCategory.jsx";
// import s from "./styles/Profile.module.css";
// import { useSelector, useDispatch } from "react-redux";
// import { authLogout } from "../redux/slice/authSlice.js";

// export default function Prsofile() {
//     const { auth, isLoggedIn } = useSelector(state => state.auth);
//     const [addBookModal, setAddBookModal] = useState(false);
//     const [addCategoryModal, setAddCategoryModal] = useState(false);

//     const [isEditingFullName, setIsEditingFullName] = useState(false);
//     const [isEditingEmail, setIsEditingEmail] = useState(false);
//     const [fullName, setFullName] = useState(auth?.fullName || "");
//     const [email, setEmail] = useState(auth?.email || "");

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     if (!isLoggedIn && !auth?.role) {
//         return null;
//     }

//     const handleLogOut = () => {
//         dispatch(authLogout());
//         navigate("/");
//         window.location.reload();
//     };

//     const handleEditData = (field) => {
//         if (field === "fullName") {
//             setIsEditingFullName(!isEditingFullName);
//         } else if (field === "email") {
//             setIsEditingEmail(!isEditingEmail);
//         }
//     };

//     const handleSave = (field) => {
//         if (field === "fullName") {
//             // Update the user data with the new full name
//             // You can dispatch an action to update the user data in the redux store
//             setIsEditingFullName(false);
//         } else if (field === "email") {
//             // Update the user data with the new email
//             // You can dispatch an action to update the user data in the redux store
//             setIsEditingEmail(false);
//         }
//     };

//     return (
//         <div className={s.wrapper}>
//             <div className={s.inner_wrapper}>
//                 <div>
//                     <h1 className="text-5xl font-serif mb-3">Welcome to Your Profile</h1>
//                     <h3 className="text-xl mb-5">{auth?.role}</h3>
//                     <div className="w-3/5 flex flex-col gap-4 text-xl">
//                         <div className="w-full flex justify-between gap-2 items-center">
//                             <span className="text-gray-600">Full Name</span>
//                             <div className="flex-grow border-b-2 border-b-gray-600 border-dashed"></div>
//                             {isEditingFullName ? (
//                                 <>
//                                     <input
//                                         type="text"
//                                         value={fullName}
//                                         onChange={(e) => setFullName(e.target.value)}
//                                         className="border px-2 py-1"
//                                     />
//                                     <button onClick={() => handleSave("fullName")} className="btn btn-primary ml-2">Save</button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <span className="text-gray-900">{fullName}</span>
//                                     <button onClick={() => handleEditData("fullName")} className="btn btn-secondary ml-2">Edit</button>
//                                 </>
//                             )}
//                         </div>

//                         <div className="w-full flex justify-between gap-2 items-center">
//                             <span className="text-gray-600">E-mail</span>
//                             <div className="flex-grow border-b-2 border-b-gray-600 border-dashed"></div>
//                             {isEditingEmail ? (
//                                 <>
//                                     <input
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         className="border px-2 py-1"
//                                     />
//                                     <button onClick={() => handleSave("email")} className="btn btn-primary ml-2">Save</button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <span className="text-gray-900">{email}</span>
//                                     <button onClick={() => handleEditData("email")} className="btn btn-secondary ml-2">Edit</button>
//                                 </>
//                             )}
//                         </div>
//                     </div>

//                     <div className="w-3/5 mt-14 flex items-center justify-start gap-x-6">
//                         {auth?.role === "admin" && (
//                             <>
//                                 <button onClick={() => setAddCategoryModal(true)} type="button" className="btn btn-primary">Add Category</button>
//                                 <button onClick={() => setAddBookModal(true)} type="button" className="btn btn-success">Add Book</button>
//                             </>
//                         )}
//                         <button
//                             onClick={handleLogOut}
//                             type="button"
//                             className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
//                         >
//                             Log Out
//                         </button>
//                     </div>
//                 </div>

//                 {addBookModal && <AddNewBook setAddBookModal={setAddBookModal} />}
//                 {addCategoryModal && <AddNewCategory setAddCategoryModal={setAddCategoryModal} />}
//             </div>
//         </div>
//     );
// }
