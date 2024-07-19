import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Verification() {
    const { auth, isLoggedIn } = useSelector(state => state.auth);

    const navigate = useNavigate()
    const handleVerification = () => {
        if (isLoggedIn) {
            navigate('/profile')
            document.location.reload('/')
            return;
        }
        navigate('/signin')
    }

    return (
        <div>
            <h1>Verification Page</h1>
            <p>the verification messsage has been sent to your email addres.</p>
            <button onClick={handleVerification}>Done</button>
        </div>
    )
}

export default Verification