import React, { useState } from 'react';
import './Forms.css';

function ChildEnrollmentForm() {
    const [childDetails, setChildDetails] = useState({
        firstName: "",
        lastName: "",
        DOB: "",
        allergies: "",
        parentDetails: ""
    });

    const handleChange = (e) => {
        setChildDetails({
            ...childDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Child Enrollment Data:", childDetails);
        // Submit the form data
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>Child Enrollment Form</h2>
            <input 
                type="text" 
                placeholder="First Name" 
                name="firstName"
                value={childDetails.firstName}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                name="lastName"
                value={childDetails.lastName}
                onChange={handleChange}
            />
            <input 
                type="date" 
                name="DOB"
                value={childDetails.DOB}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Allergies" 
                name="allergies"
                value={childDetails.allergies}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Parent Details" 
                name="parentDetails"
                value={childDetails.parentDetails}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default ChildEnrollmentForm;
