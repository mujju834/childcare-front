import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/forgot', { email });
            if (response.data.exists) {
                setStep(2);
            } else {
                setMessage('No account found');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/reset-password', { email, password });
            setMessage(response.data.message);
            setStep(3);
            // Redirect to the login page after a short delay
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000); // 2000 ms delay (2 seconds)
        } catch (error) {
            console.error(error);
        }
    };
    

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                {step === 1 && <>
                    <h2>Forgot Password</h2>
                    <p>Enter your email address to reset your password.</p>
                    <form onSubmit={handleEmailSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        {message && <p className="error-message">{message}</p>}
                        <button type="submit">Next</button>
                    </form>
                </>}

                {step === 2 && <>
                    <h2>Reset Password</h2>
                    <p>Enter your new password. here</p>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="input-group">
                            <label htmlFor="password">New Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit">Reset Password</button>
                    </form>
                </>}

                {step === 3 && <>
                    <h2>Success</h2>
                    <p>{message}</p>
                </>}
            </div>
        </div>
    );
}

export default ForgotPassword;
