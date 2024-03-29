import React, { useState, useEffect } from 'react';
import './FacilityAdminDashboard.css';
import axios from 'axios';
import ClassroomManagement from './ClassroomManagement'; 
import AttendanceManagement from './AttendanceManagement';
import AccountingManagement from './AccountingManagement';
import ReportsManagement from './ReportsManagement';

function FacilityAdminDashboard() {
    const [currentTab, setCurrentTab] = useState(localStorage.getItem('currentTab') || 'Enrollment Management');
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        localStorage.removeItem('currentTab');
    }, []);

    return (
        <div className="facility-admin-dashboard">
            <TabMenu currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <TabContent currentTab={currentTab} staffList={staffList} setStaffList={setStaffList} />
        </div>
    );
}




function TabMenu({ currentTab, setCurrentTab }) {
    const tabs = ['Enrollment Management', 'Staff Management', 'Classroom Management', 'Attendance', 'Accounting', 'Reports'];

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            // Clear local storage, alert, and redirect
            localStorage.clear();
            alert("Logging out");
            window.location.href = '/';
        }
        // If not confirmed, stay on the page
    };

    return (
        <div className="tab-menu">
            {tabs.map(tab => (
                <button key={tab} className={tab === currentTab ? 'active' : ''} onClick={() => setCurrentTab(tab)}>
                    {tab}
                </button>
            ))}
            <button className="logout-button" onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Logout</button>
        </div>
    );
}



// staff list component for showing assigned classrooms 
function StaffListWithAssign({ staffList, setStaffList }) {
    const [selectedClassrooms, setSelectedClassrooms] = useState({});
    const classrooms = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

    const handleReassign = (staffEmail) => {
        // Toggle isReassigning for the clicked staff member
        const updatedList = staffList.map(staff => 
            staff.email === staffEmail ? { ...staff, isReassigning: !staff.isReassigning } : staff
        );
        setStaffList(updatedList);
    };

    const handleClassroomChange = (staffEmail, classroom) => {
        setSelectedClassrooms({ ...selectedClassrooms, [staffEmail]: classroom });
    };

    const handleAssign = async (staffEmail) => {
        const classroom = selectedClassrooms[staffEmail];
    
        try {
            // Send a PUT request to your backend to update the assigned classroom
            await axios.put('http://localhost:5000/api/users/assign-staff', {
                email: staffEmail,
                assignedClassroom: classroom
            });
    
            // Update the frontend state only if the backend update is successful
            const updatedList = staffList.map(staff => 
                staff.email === staffEmail ? { ...staff, assignedClassroom: classroom, isReassigning: false } : staff
            );
            setStaffList(updatedList);
    
            alert('Staff assigned to classroom successfully');
        } catch (error) {
            console.error('Error assigning classroom:', error);
            alert('Failed to assign classroom');
        }
    };
    

    return (
        <div className="staff-list">
            {staffList.map(staff => (
                <div key={staff.email} className="staff-card">
                    <p>Name: {staff.name}</p>
                    <p>Email: {staff.email}</p>
                    
                    {(!staff.assignedClassroom || staff.isReassigning) ? (
                        // Show dropdown and Assign button if not assigned or reassigning
                        <>
                            <select value={selectedClassrooms[staff.email] || ""} onChange={(e) => handleClassroomChange(staff.email, e.target.value)}>
                                <option value="" disabled>Select Classroom</option>
                                {classrooms.map(classroom => (
                                    <option key={classroom} value={classroom}>Class {classroom}</option>
                                ))}
                            </select>
                            <button onClick={() => handleAssign(staff.email)}>Assign</button>
                        </>
                    ) : (
                        // Show assigned class and Reassign button
                        <>
                            <p className="highlight">Assigned to Class {staff.assignedClassroom}</p>
                            <button onClick={() => handleReassign(staff.email)}>Reassign</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}







function TabContent ({ currentTab, onReassign, staffList, setStaffList }) {
    return (
        <div className="tab-content">
            {currentTab === 'Enrollment Management' && <EnrollmentManagement />}
            {currentTab === 'Staff Management' && <StaffManagement onReassign={onReassign} />}
            {currentTab === 'Classroom Management' && <ClassroomManagement />}
            {currentTab === 'Attendance' && <AttendanceManagement />}
            {currentTab === 'Accounting' && <AccountingManagement />} 
            {currentTab === 'Reports' && <ReportsManagement />}
            {/* Implement components for other tabs as needed */}
        </div>
    );
}


function EnrollmentManagement() {
    const [enrollmentOption, setEnrollmentOption] = useState('');
    const [childrenList, setChildrenList] = useState([]);

    

    const handleOptionChange = (option) => {
        setEnrollmentOption(option);
        if (option === 'withdrawalRequests') {
            fetchChildrenWithWithdrawalRequests();
        } else {
            fetchChildren();
        }
    };

    const fetchChildren = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
            setChildrenList(response.data);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const handleDeleteChild = async (childId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this child?");
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/users/delete-child/${childId}`);
                alert('Child deleted successfully');
                fetchChildren(); // Refresh the list

            } catch (error) {
                console.error('Error deleting child:', error);
                alert('Failed to delete child');
            }
        } else {
            console.log('Deletion cancelled');
        }
    };

    const handleWaitlistChild = async (childId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/users/waitlist-child/${childId}`);
            alert(response.data.message); // Display success message
            updateChildStatus(childId, { waitlisted: true }); // Update state
        } catch (error) {
            console.error('Error waitlisting child:', error);
            alert('Failed to waitlist child');
        }
    };
    
    const handleRemoveWaitlistChild = async (childId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/users/remove-waitlist-child/${childId}`);
            alert(response.data.message); // Display success message
            updateChildStatus(childId, { waitlisted: false }); // Update state
        } catch (error) {
            console.error('Error removing child from waitlist:', error);
            alert('Failed to remove child from waitlist');
        }
    };
    
    // Helper function to update the child's status in the state
    const updateChildStatus = (childName, newStatus) => {
        setChildrenList(childrenList.map(child => 
            child.childName === childName ? { ...child, ...newStatus } : child
        ));
    };
    

    const fetchChildrenWithWithdrawalRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
            const childrenWithRequests = response.data.filter(child => child.withdrawalRequestedByParent);
            setChildrenList(childrenWithRequests);
        } catch (error) {
            console.error('Error fetching children with withdrawal requests:', error);
        }
    };

   
    // approve or deny childs request
    const handleApproveWithdrawal = async (childName, childId) => {
        try {
            // First, approve the withdrawal
            const approveResponse = await axios.put(`http://localhost:5000/api/users/approve-withdrawal/${childName}`);
            alert(approveResponse.data.message);
            
            // If approval is successful, proceed to delete the child
            const deleteResponse = await axios.delete(`http://localhost:5000/api/users/delete-child/${childId}`);
            // alert(deleteResponse.data.message);
    
            // Update local state to remove the child from the list
            setChildrenList(childrenList.filter(child => child._id !== childId));
    
        } catch (error) {
            console.error('Error in withdrawal approval or deletion:', error);
            alert('Error in processing withdrawal');
        }
    };
    
    
    const handleDenyWithdrawal = async (childName) => {
        try {
            await axios.put(`http://localhost:5000/api/users/deny-withdrawal/${childName}`);
            alert('Withdrawal denied successfully');
            updateChildStatus(childName, { withdrawalDeclined: true });
        } catch (error) {
            console.error('Error denying withdrawal:', error);
            alert('Error denying withdrawal');
        }
    };
    
    
    
    

    return (
        <div>
            <h3>Enrollment Management</h3>
            <div className="enrollment-options">
                <button onClick={() => handleOptionChange('addChild')}>Add Child</button>
                <button onClick={() => handleOptionChange('withdrawChild')}>Withdraw Child</button>
                <button onClick={() => handleOptionChange('waitlistChild')}>Waitlist Child</button>
                <button onClick={() => handleOptionChange('withdrawalRequests')}>Withdrawal Requests</button>
            </div>
            
            {enrollmentOption === 'addChild' && <AddChildForm />}
            {enrollmentOption === 'withdrawChild' && (
                <div className="children-list">
                    {childrenList.map(child => (
                        <div key={child._id} className="child-card">
                            <p>Name: {child.childName}</p>
                            <p>Date of Birth: {child.dob}</p>
                            <p>Grade: {child.grade}</p>
                            <button onClick={() => handleDeleteChild(child._id)}>Withdraw</button>
                        </div>
                    ))}
                </div>
            )}

            {enrollmentOption === 'waitlistChild' && (
                <div className="children-list">
                    {childrenList.map(child => (
                        <div key={child._id} className="child-card">
                            <p>Name: {child.childName}</p>
                            <p>Date of Birth: {child.dob}</p>
                            <p>Grade: {child.grade}</p>
                            {child.waitlisted ? (
            <button onClick={() => handleRemoveWaitlistChild(child._id)}>
                Remove from Waitlist
            </button>
        ) : (
            <button onClick={() => handleWaitlistChild(child._id)}>
                Waitlist Child
            </button>
        )}
                        </div>
                    ))}
                </div>
            )}
            {enrollmentOption === 'withdrawalRequests' && (
    <div className="children-list">
        {childrenList.map(child => (
            <div key={child._id} className="child-card">
                <p>Name: {child.childName}</p>
                <p>Date of Birth: {child.dob}</p>
                <p>Grade: {child.grade}</p>
                <p>Contact Number: {child.contactNumber}</p>
                <p>Address: {child.address}</p>
                {child.withdrawalApproved && <button className="button-approved">Withdrawal Approved</button>}
    {child.withdrawalDeclined && <button className="button-declined">Withdrawal Declined</button>}
    {!child.withdrawalApproved && !child.withdrawalDeclined && (
        <>
            <button onClick={() => handleApproveWithdrawal(child.childName, child._id)}>Approve</button>

            <button onClick={() => handleDenyWithdrawal(child.childName)}>Deny</button>
        </>
    )}
            </div>
        ))}
    </div>
)}

        </div>
    );
}

function StaffManagement( ) {
    const [activeButton, setActiveButton] = useState('');
    const [staffList, setStaffList] = useState([]);

    useEffect(() => {
        fetchStaff();
    }, []);


    const onAssign = async (name, email, classroom) => {
        try {
            // Implement logic to assign a staff member to a classroom
            await axios.put('http://localhost:5000/api/users/assign-staff', { name, email, assignedClassroom: classroom });
            alert('Staff assigned to classroom successfully');
    
            // Update staffList state to reflect the new assignment and reset isReassigning state
            setStaffList(staffList.map(staff => {
                if (staff.name === name && staff.email === email) {
                    return { 
                        ...staff, 
                        assignedClassroom: classroom, 
                        isReassigning: false // Resetting the reassigning state
                    };
                }
                return staff;
            }));
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to assign staff to classroom');
        }
    };
    

    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/retrieve-staff');
            // Add isReassigning property
            const updatedStaffList = response.data.map(staff => ({ ...staff, isReassigning: false }));
            setStaffList(updatedStaffList);
        } catch (error) {
            console.error('Error fetching staff:', error);
            alert('Failed to fetch staff');
        }
    };
    

    const handleAddStaffClick = () => {
        setActiveButton('add');
    };

    const handleRemoveStaffClick = () => {
        setActiveButton('remove');
    };

    const handleShowStaffClick = () => {
        setActiveButton('show');
    };

    const removeStaffMember = async (staffId) => {
        const isConfirmed = window.confirm(`Are you sure you want to remove this staff member?`);
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/users/delete-staff/${staffId}`);
                alert('Staff member removed successfully');
                // Update the staff list state
                const updatedStaffList = staffList.filter(staff => staff._id !== staffId);
                setStaffList(updatedStaffList);
            } catch (error) {
                console.error('Error removing staff:', error);
                alert('Failed to remove staff');
            }
        }
    };
    
    

    return (
        <div>
            <h3>Staff Management</h3>
            <div className="staff-management-nav">
                <button onClick={handleAddStaffClick} className={activeButton === 'add' ? 'active' : ''}>Add Staff</button>
                <button onClick={handleRemoveStaffClick} className={activeButton === 'remove' ? 'active' : ''}>Remove Staff</button>
                <button onClick={handleShowStaffClick} className={activeButton === 'show' ? 'active' : ''}>Show Staff</button>
            </div>
            {activeButton === 'add' && <AddStaffForm fetchStaff={fetchStaff} />}
            {activeButton === 'remove' && <StaffListWithRemove staffList={staffList} removeStaffMember={removeStaffMember} />}
            {activeButton === 'show' && <StaffListWithAssign  staffList={staffList} setStaffList={setStaffList}  />}


        </div>
    );
}

function StaffListWithRemove({ staffList, removeStaffMember }) {
    return (
        <div className="staff-list">
            {staffList.map(staff => (
                <div key={staff._id} className="staff-card">
                    <p>Name: {staff.name}</p>
                    <p>Qualifications: {staff.qualifications}</p>
                    <p>Email: {staff.email}</p>
                    <p>Phone: {staff.phone}</p>
                    <button onClick={() => removeStaffMember(staff._id)}>Remove</button>
                </div>
            ))}
        </div>
    );
}

function StaffList({ staffList }) {
    return (
        <div className="staff-list">
            {staffList.map(staff => (
                <div key={staff._id} className="staff-card">
                    <p>Name: {staff.name}</p>
                    <p>Qualifications: {staff.qualifications}</p>
                    <p>Email: {staff.email}</p>
                    <p>Phone: {staff.phone}</p>
                </div>
            ))}
        </div>
    );
}




function AddStaffForm({ onSubmit,fetchStaff  }) {
    // State to store form inputs
    const [staffName, setStaffName] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users/add-staff', {
                name: staffName,
                qualifications,
                email,
                phone,
            });
            alert('Staff member added successfully');
            fetchStaff(); // This might be redundant since you are reloading the page
    
            // Store the current tab in local storage
            localStorage.setItem('currentTab', 'Staff Management');
    
            // Reload the page
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add staff');
        }
    };
    
    return (
        <form className="add-staff-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="staffName">Name:</label>
                <input
                    type="text"
                    id="staffName"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="qualifications">Qualifications:</label>
                <input
                    type="text"
                    id="qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
}






function AddChildForm() {
    const [childName, setChildName] = useState('');
    const [dob, setDob] = useState('');
    const [grade, setGrade] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');

    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const diff = Date.now() - birthDate.getTime();
        const ageDate = new Date(diff); 
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    const age = calculateAge(dob);

        try {
            const response = await axios.post('http://localhost:5000/api/users/add-child', {
                childName, dob, grade, parentEmail, contactNumber, address, age
            });
            alert(response.data.message);
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add child');
        }
    };

    return (
        <div className="add-child-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Child's Name:</label>
                    <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Grade:</label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} required>
                        <option value="">Select Grade</option>
                        <option value="1st">1st Grade</option>
                        <option value="2nd">2nd Grade</option>
                        <option value="3rd">3rd Grade</option>
                        {/* ... more options ... */}
                    </select>
                </div>
                <div className="form-group">
                    <label>Parent's Email:</label>
                    <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Contact Number:</label>
                    <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
                </div>
                <button type="submit">Add Child</button>
            </form>
        </div>
    );
}

export default FacilityAdminDashboard;
