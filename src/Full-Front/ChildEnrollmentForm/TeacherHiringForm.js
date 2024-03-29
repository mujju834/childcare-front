import React, { useState } from 'react';
import './Forms.css';

function TeacherHiringForm() {
    const [teacherDetails, setTeacherDetails] = useState({
        firstName: "",
        lastName: "",
        DOB: "",
        address: "",
        phoneNumber: "",
        hourlySalary: ""
    });

    const handleChange = (e) => {
        setTeacherDetails({
            ...teacherDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Teacher Hiring Data:", teacherDetails);
        // Submit the form data
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>Teacher Hiring Form</h2>
            <input 
                type="text" 
                placeholder="First Name" 
                name="firstName"
                value={teacherDetails.firstName}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                name="lastName"
                value={teacherDetails.lastName}
                onChange={handleChange}
            />
            <input 
                type="date" 
                placeholder="Date of Birth" 
                name="DOB"
                value={teacherDetails.DOB}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Address" 
                name="address"
                value={teacherDetails.address}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Phone Number" 
                name="phoneNumber"
                value={teacherDetails.phoneNumber}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Hourly Salary" 
                name="hourlySalary"
                value={teacherDetails.hourlySalary}
                onChange={handleChange}
            />
            <button type="submit">Hire</button>
        </form>
    );
}

export default TeacherHiringForm;
