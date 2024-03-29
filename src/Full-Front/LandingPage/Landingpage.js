import React from 'react';
import './Landingpage.css'

function LandingPage() {

    function redirectLogin(e) {
        e.preventDefault();
        window.location = '/login';
    }

    function redirectRegister(e) {
        e.preventDefault();
        window.location = '/register';
    }

    return (
        <div className="landing-container">
            <div className="header">
                <h1>Welcome to Childcare Management System</h1>
            </div>
            <div className="description">
                <p>
                    Managing a childcare facility is now easier than ever. Our system is designed to handle
                    daily operations efficiently, ensuring a smooth experience for administrators, teachers, and parents alike.
                </p>
                <p>
                    Track attendance, manage enrollments, handle accounting, and maintain optimal staff ratios, all in one place.
                </p>
            </div>
            <div className="button-container">
                <button className="login-button" onClick={redirectLogin}>Login</button>
                <button className="register-button" onClick={redirectRegister}>Register</button>
            </div>
        </div>
    );
}

export default LandingPage;
