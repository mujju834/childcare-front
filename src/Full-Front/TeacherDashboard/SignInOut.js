import React, { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';

const SignInOut = () => {
    const { user } = useContext(UserContext);

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [signInTime, setSignInTime] = useState(null);
    const [totalHoursWorked, setTotalHoursWorked] = useState(null);

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/sign-in', { email: user.email });
            setIsSignedIn(true);
            setSignInTime(response.data.signInTime);
            // Reset total hours worked on sign in
            setTotalHoursWorked(null);
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/sign-out', { email: user.email });
            setIsSignedIn(false);
            setTotalHoursWorked(response.data.totalHoursWorked);
        } catch (error) {
            console.error('Error during sign out:', error);
        }
    };

    return (
        <div className="sign-in-out">
            <button onClick={handleSignIn} disabled={isSignedIn}>Sign In</button>
            <button onClick={handleSignOut} disabled={!isSignedIn}>Sign Out</button>
            {signInTime && <p>Signed in at: {signInTime}</p>}
            {totalHoursWorked !== null && <p>Total Hours Worked: {totalHoursWorked}</p>}
        </div>
    );
};


export default SignInOut;