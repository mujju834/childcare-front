import React, { useState } from 'react';
import axios from 'axios'
import './Sharedstyle.css'
import { useNavigate } from 'react-router-dom';

function LoginPage(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); 

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.post('http://localhost:5000/api/users/login', {
            email: email,
            password: password
        })
        .then(res => {
            console.log(res.data);
            alert("Successfully logged in");
            // teacher login
            
    
            if (res.data.isAdmin) {
                window.location.href = '/admindashboard';
                localStorage.setItem('email', email);
                localStorage.setItem('role', 'admin');
            } else if (res.data.isTeacher) {
                window.location.href = '/teacherdashboard';
                localStorage.setItem('email', email);
                localStorage.setItem('role', 'teacher');
            } else if (res.data.isParent) {
                window.location.href = '/parentdashboard';
                localStorage.setItem('email', email);
                localStorage.setItem('role', 'parent');
            } else if (res.data.isFacilityAdmin) {
                window.location.href = '/facilityadmindashboard';
                localStorage.setItem('email', email);
                localStorage.setItem('role', 'facilityadmin');
            } else {
                window.location.href = '/';
            }
        })
        .catch(err => {
            console.error(err.response ? err.response.data : err.message);
    
            // Specific alerts based on error response
            if (err.response) {
                const message = err.response.data.message;
                if (message.includes("Email not found") ) {
                    alert('Invalid Email');
                } else if(message.includes("Password doesn't match")){
                    alert(message); // General error message from server
                }
            } else {
                alert('An error occurred during login');
            }
        });
    };
    

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <div>
                <a href="/forgotpassword">Forgot Password?</a>
                <a href="/register">Register</a>
            </div>
        </div>
    );
}

export default LoginPage;
