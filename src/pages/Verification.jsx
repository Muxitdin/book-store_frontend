import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Verification() {
    const { auth, isLoggedIn } = useSelector(state => state.auth);

    const navigate = useNavigate()
    const handleVerification = () => {
        if (isLoggedIn) {
            navigate('/profile')
            document.location.reload()
            return;
        }
        navigate('/signin')
    }

    return (
        <div className='flex flex-col items-center justify-center h-[calc(100vh-197px)] bg-gray-100'>
            <h1 className='text-2xl font-bold mb-4'>Verification Page</h1>
            <p className='text-gray-700 mb-6 text-center'>A verification link has been emailed to you. <br />Please check your inbox</p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleVerification}>Done</button>
        </div>
    )
}

export default Verification