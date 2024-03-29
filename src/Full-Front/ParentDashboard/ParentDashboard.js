import React, { useState, useEffect } from 'react';
import './ParentDashboard.css';
import axios from 'axios';

function Navbar({ setView }) {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h2 onClick={() => setView('childLedger')}>Parent Dashboard</h2>
            </div>
            <ul className="navbar-links">
                <li><a href="#" onClick={() => setView('addChild')}>Add Child</a></li>
                <li><a href="#" onClick={() => setView('childLedger')}>Child Ledger</a></li>
                <li><a href="#" onClick={() => setView('makePayment')}>Make a Payment</a></li>
                <li><a href="#" onClick={() => setView('modifyEnrollment')}>Modify Enrollment</a></li>
                <li><a href="#" onClick={() => setView('withdrawal')}>Withdrawal</a></li>
                {/* <li><a href="#" onClick={() => setView('attendance')}>Attendance</a></li> */}
                <li><a href="#" onClick={() => setView('logout')}>Logout</a></li>
            </ul>
        </nav>
    );
}


function ParentDashboard() {
    const [view, setView] = useState('childLedger');

    const renderContent = () => {
        switch (view) {
            case 'addChild':
                return <AddChildForm />;
            case 'childLedger':
                return <ChildLedger />;
            case 'makePayment':
                return <MakePayment />;
            case 'modifyEnrollment':
                return <ModifyEnrollment />;
            case 'withdrawal':
                return <Withdrawal />;
            case 'attendance':
                return <Attendance />;
            case 'logout':
                return <Logout />;
            default:
                return <DefaultView />;
        }
    };

    return (
        <div className="parent-dashboard">
            <Navbar setView={setView} />
            {renderContent()}
        </div>
    );
}

// Define all the components used in renderContent:
// this is add child form
function AddChildForm() {
    const [isChildAdded, setIsChildAdded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const childName = e.target.childName.value;
        const dob = e.target.dob.value;
        const grade = e.target.grade.value;
        const parentEmail = e.target.parentEmail.value;
        const contactNumber = e.target.contactNumber.value;
        const address = e.target.address.value;

        try {
            const response = await axios.post('http://localhost:5000/api/users/add-child', {
                childName, dob, grade, parentEmail, contactNumber, address
            });

            // Handle successful response
            alert(response.data.message);
            // setIsChildAdded(true);
            window.location.href='/parentdashboard';

        } catch (error) {
            // Handle errors
            console.error('Error:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
            }
        
            alert('Failed to add child');
        }
    };

    return (
        <div>

        <div className="add-child-form">
            <h3>Add Child</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="childName">Child's Name:</label>
                    <input type="text" id="childName" name="childName" placeholder="Enter child's name" required />
                </div>

                <div className="form-group">
                    <label htmlFor="dob">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" required />
                </div>

                <div className="form-group">
                    <label htmlFor="grade">Grade:</label>
                    <select id="grade" name="grade" required>
                        <option value="">Select Grade</option>
                        <option value="1st">1st Grade</option>
                        <option value="2nd">2nd Grade</option>
                        <option value="3rd">3rd Grade</option>
                        {/* ... more options ... */}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="parentEmail">Parent's Email:</label>
                    <input type="text" id="parentEmail" name="parentEmail" placeholder="Enter parent's Email" required />
                </div>

                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input type="tel" id="contactNumber" name="contactNumber" placeholder="Enter contact number" required />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <textarea id="address" name="address" placeholder="Enter address" required></textarea>
                </div>

                <button type="submit">Add Child</button>
            </form>
        </div>
</div>
    );
}

// this is child ledger function
function ChildLedger() {
    const [childrenList, setChildrenList] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            const parentEmail = localStorage.getItem('email'); // Replace 'email' with your actual local storage key
            if (!parentEmail) {
                alert('No email found in local storage');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
                const filteredChildren = response.data.filter(child => child.parentEmail.toLowerCase() === parentEmail.toLowerCase());
                setChildrenList(filteredChildren);
            } catch (error) {
                console.error('Error fetching children:', error);
                alert('Failed to retrieve children information');
            }
        };

        fetchChildren();
    }, []);

    return (
        <div className="children-list">
            {childrenList.length > 0 ? (
                childrenList.map((child, index) => (
                    <div key={index} className="child-card">
                        <h3>{child.childName}</h3>
                        <p>Date of Birth: {child.dob}</p>
                        <p>Grade: {child.grade}</p>
                        <p>Contact Number: {child.contactNumber}</p>
                        <p>Address: {child.address}</p>
                        {/* Add more child details as needed */}
                    </div>
                ))
            ) : (
                <p>No children found for this parent.</p>
            )}
        </div>
    );
}


// this is the function to make payment
function MakePayment() {
    const [childrenList, setChildrenList] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            const parentEmail = localStorage.getItem('email'); // Replace 'email' with your actual local storage key
            if (!parentEmail) {
                alert('No email found in local storage.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
                const filteredChildren = response.data.filter(child => child.parentEmail.toLowerCase() === parentEmail.toLowerCase());
                setChildrenList(filteredChildren);
            } catch (error) {
                console.error('Error fetching children:', error);
                alert('Failed to retrieve children information');
            }
        };

        fetchChildren();
    }, []);
    
    const handlePayment = async (child) => {
        const confirmPayment = window.confirm(`Do you want to pay fees for ${child.childName}?`);
        if (confirmPayment) {
            try {
                await axios.post('http://localhost:5000/api/users/update-fee-paid', { 
                    childName: child.childName,
                    feePaid: child.feeDue // Use feeDue as the amount to be paid
                });
    
                // Update UI
                setChildrenList(childrenList.map(c => 
                    c.childName === child.childName ? { ...c, feePaid: child.feeDue } : c
                ));
    
                alert('Payment successful');
            } catch (error) {
                console.error('Error updating fee:', error);
                alert('Error updating fee');
            }
        }
    };
    
    

    return (
        <div className="children-list">
            {childrenList.length > 0 ? (
                childrenList.map((child, index) => (
                    <div key={index} className="child-card">
                        <h3>{child.childName}</h3>
                        <p>Date of Birth: {child.dob}</p>
                        <p>Grade: {child.grade}</p>
                        <p>Contact Number: {child.contactNumber}</p>
                        <p>Address: {child.address}</p>
                        <p>Fees Due: {child.feeDue}</p>
                        {child.feePaid > 0 ? (
                    <button className="paid-button">Paid</button>
                ) : (
                    <button onClick={() => handlePayment(child)}>Pay Fees</button>
                )}

                    </div>
                ))
            ) : (
                <p>No children found for this parent.</p>
            )}
        </div>
    );
}



//this is to modify enrollment
function ModifyEnrollment() {
    const [childName, setChildName] = useState('');
    const [childDetails, setChildDetails] = useState({
        grade: '',
        parentEmail: '',
        contactNumber: '',
        address: '',
    });
    const [isFetching, setIsFetching] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleFetchChild = async () => {
        setIsFetching(true);
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`http://localhost:5000/api/users/retrieve-children/${childName}`);
            setChildDetails(response.data);
        } catch (error) {
            console.error('Error fetching child:', error);
            alert('Failed to retrieve child information');
        }
        setIsFetching(false);
    };

    const handleUpdateChild = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            // Replace with your actual API endpoint
            await axios.put(`http://localhost:5000/api/users/add-child/${childName}`, childDetails);
            alert('Child information updated successfully');
        } catch (error) {
            console.error('Error updating child:', error);
            alert('Failed to update child information');
        }
        setIsUpdating(false);
    };

    return (
        <div>
            <h3>Modify Child Enrollment</h3>
            <div>
                <input
                    type="text"
                    placeholder="Enter child's name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                />
                <button onClick={handleFetchChild} disabled={isFetching}>
                    Fetch Child Details
                </button>
            </div>

            <form onSubmit={handleUpdateChild}>
                {/* Exclude Date of Birth */}
                <input
                    type="text"
                    placeholder="Grade"
                    value={childDetails.grade}
                    onChange={(e) => setChildDetails({ ...childDetails, grade: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Parent Email"
                    value={childDetails.parentEmail}
                    onChange={(e) => setChildDetails({ ...childDetails, parentEmail: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    value={childDetails.contactNumber}
                    onChange={(e) => setChildDetails({ ...childDetails, contactNumber: e.target.value })}
                />
                <textarea
                    placeholder="Address"
                    value={childDetails.address}
                    onChange={(e) => setChildDetails({ ...childDetails, address: e.target.value })}
                />
                <button type="submit" disabled={isUpdating}>
                    Update Child
                </button>
            </form>
        </div>
    );
}


// functin to withdraw child
function Withdrawal() {
    const [childrenList, setChildrenList] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            const parentEmail = localStorage.getItem('email'); // Replace 'email' with your actual local storage key
            if (!parentEmail) {
                alert('No email found in local storage.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
                const filteredChildren = response.data.filter(child => child.parentEmail.toLowerCase() === parentEmail.toLowerCase());
                setChildrenList(filteredChildren);
            } catch (error) {
                console.error('Error fetching children:', error);
                alert('Failed to retrieve children information');
            }
        };

        fetchChildren();
    }, []);

    const handleWithdraw = async (childName) => {
        const confirmWithdraw = window.confirm(`Requesting withdrawal for ${childName}. Continue?`);
        if (confirmWithdraw) {
            try {
                await axios.post('http://localhost:5000/api/users/request-withdrawal', { childName });
                alert('Withdrawal requested successfully.');
    
                // Update the local state to reflect the withdrawal request
                setChildrenList(childrenList.map(child => 
                    child.childName === childName ? { ...child, withdrawalRequestedByParent: true } : child
                ));
            } catch (error) {
                console.error('Error requesting withdrawal:', error);
                alert('Error requesting withdrawal');
            }
        }
    };

    return (
        <div className="children-list">
            {childrenList.length > 0 ? (
                childrenList.map((child, index) => (
                    <div key={index} className="child-card">
                        <h3>{child.childName}</h3>
                        <p>Date of Birth: {child.dob}</p>
                        <p>Grade: {child.grade}</p>
                        <p>Contact Number: {child.contactNumber}</p>
                        <p>Address: {child.address}</p>
                        {child.withdrawalApproved && <button className="approved-button" disabled>Withdrawal Approved</button>}
                        {child.withdrawalDeclined && <button className="declined-button" disabled>Withdrawal Declined</button>}
                        {!child.withdrawalApproved && !child.withdrawalDeclined && child.withdrawalRequestedByParent &&
                            <button className="requested-button" disabled>Withdrawal Requested</button>
                        }
                        {!child.withdrawalApproved && !child.withdrawalDeclined && !child.withdrawalRequestedByParent &&
                            <button onClick={() => handleWithdraw(child.childName)}>Request Withdrawal</button>
                        }
                    </div>
                ))
            ) : (
                <p>No children found for this parent.</p>
            )}
        </div>
    );
    
}


function Attendance() { /* ... */ }


//function to logout
function Logout() {
    useEffect(() => {
        // Proceed with the logout process immediately
        const timeout = setTimeout(() => {
            localStorage.clear(); // Clear session data
            window.location.href = '/login'; // Redirect to the login page
        }, 3000); // 3 seconds for the logout animation

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="logout-overlay">
            <div className="logout-message">
                Logging out...
            </div>
        </div>
    );
}









function DefaultView() { /* ... */ }

export default ParentDashboard;
