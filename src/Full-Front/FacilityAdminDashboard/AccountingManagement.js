import React, { useState,useEffect } from 'react';
import axios from 'axios';

function AccountingManagement() {
    const [currentView, setCurrentView] = useState('');

    // Add the logic and Axios calls for each function as needed

    return (
        <div className="accounting-management">
            <div className="accounting-options">
                <button onClick={() => setCurrentView('setTuitionFees')}>Set Tuition Fees</button>
                <button onClick={() => setCurrentView('generateCharges')}>Automatic Charges</button>
                <button onClick={() => setCurrentView('collectPayments')}>Collect Payments</button>
                <button onClick={() => setCurrentView('viewLedger')}>View Ledger</button>
            </div>

            {currentView === 'setTuitionFees' && <SetTuitionFees />}
            {currentView === 'generateCharges' && <GenerateCharges />}
            {currentView === 'collectPayments' && <CollectPayments />}
            {currentView === 'viewLedger' && <ViewLedger />}
        </div>
    );
}

function SetTuitionFees() {
    const initialFees = {
        Infant: 300,
        Toddler: 275,
        Twadler: 250,
        '3YearsOld': 225,
        '4YearsOld': 200
    };
    
    const [tuitionFees, setTuitionFees] = useState(initialFees);
    const handleFeeChange = (classroom, fee) => {
        setTuitionFees(prevFees => ({ ...prevFees, [classroom]: fee }));
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/tuition-fees', tuitionFees);
            alert('Tuition fees assigned successfully');
            setTuitionFees(initialFees);
        } catch (error) {
            console.error('Error updating tuition fees:', error);
            alert('Failed to update tuition fees');
        }
    };

    return (
        <div>
            <h3>Set Tuition Fees</h3>
            {Object.entries(tuitionFees).map(([classroom, fee]) => (
                <div key={classroom}>
                    <label>{classroom}: $</label>
                    <input 
                        type="number" 
                        value={fee} 
                        onChange={(e) => handleFeeChange(classroom, e.target.value)} 
                    />
                </div>
            ))}
            <button onClick={handleSubmit}>Update Fees</button>
        </div>
    );
}


function GenerateCharges() {
    const generateCharges = async () => {
        try {
            // Replace with your actual API endpoint
            await axios.post('http://localhost:5000/api/generate-charges');
            alert('Charges generated for the week.');
        } catch (error) {
            console.error('Error generating charges:', error);
        }
    };

    return (
        <div>
            <h3>Generate Weekly Charges</h3>
            <button onClick={generateCharges}>Generate Charges</button>
        </div>
    );
}

function CollectPayments() {
    const [children, setChildren] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
                const childrenWithFee = response.data.map(child => ({
                    ...child, 
                    fee: determineFee(child.age), // Calculate fee based on age
                    paid: child.paymentStatus // Assuming 'paymentStatus' is a field in your child data
                }));
                setChildren(childrenWithFee);
            } catch (error) {
                console.error('Error fetching children:', error);
            }
        };

        fetchChildren();
    }, []);

   // Inside handleCollectPayment function

const handleCollectPayment = async (childName) => {
    try {
        const response = await axios.post('http://localhost:5000/api/users/collect-payment', { childName });
        alert(`Payment collected successfully for ${childName}.Updated Fee: $${response.data.feeDue}`);

        // Update the payment status and feePaid in the state for the corresponding child
        const updatedChildren = children.map(child => 
            child.childName === childName ? { ...child, Due: true, feeDue: response.data.feeDue } : child
        );
        setChildren(updatedChildren);

    } catch (error) {
        console.error('Error collecting payment:', error);
    }
};


    // Function to determine fee based on age
    const determineFee = (age) => {
        switch(age) {
            case 0: return 300; // Infant
            case 1: return 275; // Toddler
            case 2: return 250; // Twadler
            case 3: return 225; // 3 Years Old
            case 4: // 4 Years Old and above
            default: return 200; // Default fee for age 4 and above
        }
    };

    return (
        <div>
            <h3>Collect Weekly Payments</h3>
            {children.map(child => (
                <div key={child.childName} className="child-payment-card">
                    <p>Child Name: {child.childName}</p>
                    <p>Grade: {child.grade}</p>
                    <p>Fee Due: ${child.fee}</p> {/* Display the calculated fee */}
                    {child.feeDue > 0  ? (
                        <div className="paid-tab" >Updated</div>
                    ) : (
                        <button onClick={() => handleCollectPayment(child.childName)}>Update Payment</button>
                    )}
                </div>
            ))}
        </div>
    );
}




function ViewLedger() {
    const [children, setChildren] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
                setChildren(response.data);
            } catch (error) {
                console.error('Error fetching children:', error);
            }
        };

        fetchChildren();
    }, []);

    return (
        <div className="children-ledger-container">
        <h3>Children's Information</h3>
        <div className="child-cards-container">
            {children.map(child => (
                <div key={child._id} className="child-card">
                    <p><strong>Name:</strong> {child.childName}</p>
                    <p><strong>Date of Birth:</strong> {child.dob}</p>
                    <p><strong>Grade:</strong> {child.grade}</p>
                    <p><strong>Contact Number:</strong> {child.contactNumber}</p>
                    <p><strong>Address:</strong> {child.address}</p>
                    {child.feeDue > 0  ? (
                        <div className="paid-tab" >Updated</div>
                    ) : (
                        <button >Not Updated</button>
                    )}

                </div>
            ))}
        </div>
        </div>
    );
}



export default AccountingManagement;
