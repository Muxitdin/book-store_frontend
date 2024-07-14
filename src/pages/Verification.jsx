import React from 'react'
import { useNavigate } from 'react-router-dom'


function Verification() {
    const navigate = useNavigate()
    const handleVerification = () => {
        navigate('/signin')
    }

    return (
        <div>
            <h1>Verification Page</h1>
            <p>the verification messsage has been sent to your email addres.</p>
            <button onClick={handleVerification}>Confirm</button>
        </div>
    )
}

export default Verification