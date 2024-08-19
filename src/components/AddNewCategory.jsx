import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCategory, fetchCategories } from '../redux/slice/categorySlice';
import s from "../pages/styles/AddNewBook.module.css";

export default function AddNewCategory({ setAddCategoryModal }) {
    const [name, setName] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        dispatch(addCategory({ name }));
        setAddCategoryModal(false);
        dispatch(fetchCategories());
    };

    return (
        <div className={s.wrapper}>
            <form onSubmit={handleSubmit}>
                <button onClick={() => setAddCategoryModal(false)} type="button" className="btn-close" aria-label="Close"></button>
                <h1>Add New Category</h1>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}
                    placeholder="Category Name"
                    required
                    style={{width:"200px"}}
                />
                <button type="submit" className='btn btn-primary'>Create</button>
            </form>
        </div>
    );
}