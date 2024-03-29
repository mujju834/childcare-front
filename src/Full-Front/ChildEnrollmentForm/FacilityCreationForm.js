import React, { useState } from 'react';
import './Forms.css';

function FacilityCreationForm() {
    const [facilityDetails, setFacilityDetails] = useState({
        facilityName: "",
        address: "",
        phoneNumber: "",
        adminDetails: "",
        licenseNumber: ""
    });

    const handleChange = (e) => {
        setFacilityDetails({
            ...facilityDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Facility Creation Data:", facilityDetails);
        // Submit the form data
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>Facility Creation Form</h2>
            <input 
                type="text" 
                placeholder="Facility Name" 
                name="facilityName"
                value={facilityDetails.facilityName}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Address" 
                name="address"
                value={facilityDetails.address}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Phone Number" 
                name="phoneNumber"
                value={facilityDetails.phoneNumber}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="Admin Details" 
                name="adminDetails"
                value={facilityDetails.adminDetails}
                onChange={handleChange}
            />
            <input 
                type="text" 
                placeholder="License Number" 
                name="licenseNumber"
                value={facilityDetails.licenseNumber}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default FacilityCreationForm;
