import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

function AdminDashboard() {
    const [currentView, setCurrentView] = useState('addFacility');
    const [facilities, setFacilities] = useState([]);

    const [newFacilityName, setNewFacilityName] = useState('');
    const [newFacilityLicenseNumber, setNewFacilityLicenseNumber] = useState('');

    useEffect(() => {
        if (currentView === 'viewFacilities') {
            fetchFacilities();
        }
    }, [currentView]);

    const handleAddFacility = async () => {
        try {
            const newFacility = {
                name: newFacilityName,
                licenseNumber: newFacilityLicenseNumber
            };
            
            const response = await axios.post('http://localhost:5000/api/users/add-facility', newFacility);
            alert(response.data.message);
            
            setFacilities([...facilities, response.data.facility]);
            setNewFacilityName('');
            setNewFacilityLicenseNumber('');
        } catch (error) {
            alert("Error adding facility:", error.response ? error.response.data.message : 'An error occurred');
        }
    };

    const fetchFacilities = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/facilities');
            setFacilities(response.data);
        } catch (error) {
            console.error("Error fetching facilities:", error);
            alert('Failed to fetch facilities');
        }
    };

    const handleDeleteFacility = async (facilityName, licenseNumber) => {
        try {
            await axios.delete('http://localhost:5000/api/users/facility', {
                data: { name: facilityName, licenseNumber: licenseNumber }
            });
            setFacilities(facilities.filter(facility => facility.name !== facilityName || facility.licenseNumber !== licenseNumber));
            alert("Facility deleted successfully");
        } catch (error) {
            console.error("Error deleting facility:", error);
            alert('Failed to delete facility');
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>System Administrator Dashboard</h2>
            <div className="dashboard-options">
                <button onClick={() => setCurrentView('addFacility')}>Add Facility</button>
                <button onClick={() => setCurrentView('viewFacilities')}>View Facilities</button>
            </div>

            {currentView === 'addFacility' && (
                <div className="add-facility-form">
                    <input 
                        type="text"
                        placeholder="Facility Name"
                        value={newFacilityName}
                        onChange={(e) => setNewFacilityName(e.target.value)}
                    />
                    <input 
                        type="text"
                        placeholder="Facility License Number"
                        value={newFacilityLicenseNumber}
                        onChange={(e) => setNewFacilityLicenseNumber(e.target.value)}
                    />
                    <button onClick={handleAddFacility}>Add New Facility</button>
                </div>
            )}

            {currentView === 'viewFacilities' && (
                <div className="facilities-overview">
                    {facilities.map(facility => (
                        <div key={`${facility.name}-${facility.licenseNumber}`} className="facility-card">
                            <h3>{facility.name}</h3>
                            <p>License Number: {facility.licenseNumber}</p>
                            <button onClick={() => handleDeleteFacility(facility.name, facility.licenseNumber)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
