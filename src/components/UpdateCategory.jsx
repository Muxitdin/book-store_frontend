import { React, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCategory } from '../redux/slice/categorySlice';
import s from '../pages/styles/AddNewBook.module.css'


export default function UpdateCategory({ category, setEditModal, editModal }) {
    const [name, setName] = useState(category.name);
    const dispatch = useDispatch();
 
 
    const handleSubmit = async () => {
        dispatch(updateCategory(category._id, { name }));
        await dispatch(fetchCategories());
        setEditModal(false);
    };

    return (
        <div className={s.wrapper}>
            <form onSubmit={handleSubmit}>
                <button onClick={() => setEditModal(false)} type="button" class="btn-close" aria-label="Close"></button>
                <h1>Edit Category</h1>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category Name"
                    required
                />
                <button type="submit" className='btn btn-primary'>Update Category</button>
            </form>
        </div>
    );
}