import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage(props) {
    const navigate = useNavigate();
    const [role, setRole] = useState('parent'); // default to parent
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Specific fields for roles
    const [childInfo, setChildInfo] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [adminCode, setAdminCode] = useState('');
    // Fields for the facility admin
    const [facilityName, setFacilityName] = useState('');
    const [facilityLicenseNumber, setFacilityLicenseNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a user object based on the role
        const user = {
            email,
            password,
            role,
        };

        // Add role-specific information to the user object
        if (role === 'parent') {
            user.childInfo = childInfo;
        } else if (role === 'teacher') {
            user.qualifications = qualifications;
        } else if (role === 'admin') {
            user.adminCode = adminCode;
        } else if (role === 'facilityadmin') {
            user.facilityName = facilityName;
            user.facilityLicenseNumber = facilityLicenseNumber;
        }

        // Send a POST request to the backend
        axios.post('http://localhost:5000/api/users/register', user)
        .then(res => {
            // Check for different roles and navigate accordingly
            if (res.data.isAdmin) {
                window.location.href='/admindashboard';
                localStorage.setItem('email', email);
                localStorage.setItem('role', 'admin');


            } else if (res.data.isTeacher) {

                localStorage.setItem('email', email);
                localStorage.setItem('role', 'teacher');

                window.location.href='/teacherdashboard';
            } else if (res.data.isParent) {
                localStorage.setItem('email', email);
                localStorage.setItem('role', 'parent');
                window.location.href='/parentdashboard';
            } else if (res.data.isFacilityAdmin) {
                // Save the facility admin's email and role in local storage
                localStorage.setItem('email', email);
                localStorage.setItem('role', 'facilityadmin');
                window.location.href='/facilityadmindashboard';
            } else {
                window.location.href='/';
            }
    
            alert("User registered successfully");
        })
        .catch(err => {
            // Error handling
            console.error(err.response ? err.response.data : err.message);
            alert(err.response ? err.response.data.message : 'An error occurred');
        }) .catch(err => {
                // Error handling
                console.error(err.response ? err.response.data : err.message);
                alert(err.response ? err.response.data.message : 'An error occurred');
            });
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="parent">Parent</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                        <option value="facilityadmin">Facility Admin</option>
                    </select>
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {role === 'parent' && (
                    <div>
                        <label>Child's Information:</label>
                        <input type="text" value={childInfo} onChange={(e) => setChildInfo(e.target.value)} required />
                    </div>
                )}
                {role === 'teacher' && (
                    <div>
                        <label>Qualifications:</label>
                        <input type="text" value={qualifications} onChange={(e) => setQualifications(e.target.value)} required />
                    </div>
                )}
                {role === 'admin' && (
                    <div>
                        <label>Admin Registration Code:</label>
                        <input type="text" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
                    </div>
                )}
                {role === 'facilityadmin' && (
                    <div>
                        <label>Facility Name:</label>
                        <input type="text" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} required />
                    </div>
                )}
                {role === 'facilityadmin' && (
                    <div>
                        <label>Facility License Number:</label>
                        <input type="text" value={facilityLicenseNumber} onChange={(e) => setFacilityLicenseNumber(e.target.value)} required />
                    </div>
                )}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
