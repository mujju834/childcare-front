// TeacherDashboard.js
import React, { useState,useContext,useEffect } from 'react';
import './TeacherDashboard.css';
import axios from 'axios';

function TeacherDashboard() {
    const [view, setView] = useState('attendance');
    const [email, setEmail] = useState(''); // To handle email input for teacher invite
    const [teacherAttendance, setTeacherAttendance] = useState([]);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [signInTime, setSignInTime] = useState(null);
    const [totalHoursWorked, setTotalHoursWorked] = useState(null);
    const [signInDetails, setSignInDetails] = useState(null);

    useEffect(() => {
        const fetchSignInDetails = async () => {
            const email = localStorage.getItem('email');
            if (email) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/retrieve-staff?email=${email}`);
                    setSignInDetails(response.data); // Assuming this returns the last signInTime and signOutTime
                } catch (error) {
                    console.error('Error fetching sign-in details:', error);
                }
            }
        };

        fetchSignInDetails();
    }, []);

    useEffect(() => {
        const loggedInEmail = localStorage.getItem('email'); // Retrieve the logged-in teacher's email from local storage
    
        if (loggedInEmail) {
            const fetchAttendance = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/users/retrieve-staff-attendance?email=${loggedInEmail}`);
                    if (response.data && response.data.attendance) {
                        setTeacherAttendance(response.data.attendance);
                    }
                } catch (error) {
                    console.error('Error fetching attendance:', error);
                }
            };
            fetchAttendance();
        }
    }, []);


    const displayAttendance = () => {
        if (!teacherAttendance) return null;
    
        const formattedDate = new Date(teacherAttendance.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const statusColor = teacherAttendance.status === 'present' ? 'green' : 'red';
    
        return (
            <p style={{ color: statusColor }}>
                {formattedDate} - {teacherAttendance.status}
            </p>
        );
    };
    
    

    // Dummy Data
    const students = ["Alice", "Bob", "Charlie"];
    const salary = { monthly: 1000, weeklyHours: 35, monthlyHours: 140 };
    const attendanceData = [5, 6, 7, 6, 5, 4, 5]; // Replace with real data

    // Handler for toggling views
    const toggleView = (viewName) => {
        setView(viewName);
    };

    // Components for different views
    const WeeklyAttendanceChart = ({ attendanceData }) => {
        return (
            <div className="attendance-chart">
                <h3>Weekly Attendance</h3>
                {/* Chart would be rendered here */}
                {displayAttendance()} {/* Include the attendance display */}

            </div>
        );
    };

    function ClassroomOverview() {
        const [assignedClassroom, setAssignedClassroom] = useState('');
        const [studentsInClassroom, setStudentsInClassroom] = useState([]);
    
        useEffect(() => {
            const loggedInEmail = localStorage.getItem('email');
    
            // Function to map classroom number to grade string
            const mapClassroomToGrade = (classroomNumber) => {
                const gradeMapping = {
                    '1': '1st',
                    '2': '2nd',
                    '3': '3rd',
                    // Add more mappings as per your data
                };
                return gradeMapping[classroomNumber];
            };
    
            const fetchStaffAndChildren = async () => {
                try {
                    const staffResponse = await axios.get('http://localhost:5000/api/users/retrieve-staff');
                    const childrenResponse = await axios.get('http://localhost:5000/api/users/retrieve-children');
    
                    // Find the logged-in teacher's information
                    const loggedInStaff = staffResponse.data.find(staff => staff.email === loggedInEmail);
                    if (loggedInStaff && loggedInStaff.assignedClassroom) {
                        const classroomGrade = mapClassroomToGrade(loggedInStaff.assignedClassroom);
                        setAssignedClassroom(loggedInStaff.assignedClassroom);
    
                        // Filter children who are in the same grade as the teacher's assigned class
                        const childrenInClassroom = childrenResponse.data.filter(child => child.grade === classroomGrade);
    
                        setStudentsInClassroom(childrenInClassroom); // Store the entire child object
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
    
            fetchStaffAndChildren();
        }, []);
    
        return (
            <div className="classroom-overview">
                <h3>Classroom Overview</h3>
                <h4>Assigned Classroom: {assignedClassroom || 'Not Assigned'}</h4>
                <h5>Students:</h5>
                <div className="students-list">
                    {studentsInClassroom.length > 0 ? (
                        studentsInClassroom.map(student => (
                            <div key={student._id} className="student-card">
                                <p className="student-name">Name: {student.childName}</p>
                                <p className="student-contact">Contact: {student.contactNumber}</p>
                            </div>
                        ))
                    ) : (
                        <p>No students assigned to this classroom</p>
                    )}
                </div>
            </div>
        );
    }       
    
    
    function SalaryDetails() {
        const [totalHoursWorked, setTotalHoursWorked] = useState(0);
        const hourlyRate = 60; // $60/hour
    
        useEffect(() => {
            const email = localStorage.getItem('email');
            if (email) {
                axios.get(`http://localhost:5000/api/users/total-hours-worked/${encodeURIComponent(email)}`)
                    .then(response => {
                        const hours = parseFloat(response.data.totalHoursWorked);
                        setTotalHoursWorked(isNaN(hours) ? 0 : hours);
                    })
                    .catch(error => console.error('Error fetching total hours worked:', error));
            }
        }, []);
    
        const calculateEarnedIncome = () => {
            return (hourlyRate * totalHoursWorked).toFixed(2);
        };
    
        return (
            <div className="salary-details">
                <h3>Salary Details</h3>
                <p>Hours Worked This Month: {totalHoursWorked.toFixed(2)} hours</p> {/* Format displayed value */}
                <p>Earned Income till now: ${calculateEarnedIncome()}</p>
            </div>
        );
    }
    
    

    // Teacher Invitation Component
    const TeacherInvite = () => {
        const handleInvite = (email) => {
            // Logic to send an invitation email
            console.log('Inviting teacher:', email);
        };

        return (
            <div className="teacher-invite">
                <h3>Invite Teacher</h3>
                <input 
                    type="email" 
                    placeholder="Enter teacher's email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <button onClick={() => handleInvite(email)}>Send Invite</button>
            </div>
        );
    };

    // Sign-in and Sign-out Component
   // ... other imports and code ...
   const handleSignIn = async () => {
    try {
        const email = localStorage.getItem('email');
        const response = await axios.post('http://localhost:5000/api/users/sign-in', { email });

        if (response.status === 200) {
            // Signed in successfully
            setIsSignedIn(true);
            setSignInTime(new Date(response.data.signInTime));
        }
    } catch (error) {
        // Check if error response is due to already being signed in
        if (error.response && error.response.status === 409) {
            // User already signed in
            alert("Already signed in for today.");
        } else {
            console.error('Error during sign in:', error);
        }
    }
};





const SignInOutView = () => {
    const handleSignOut = async () => {
        const confirmation = window.confirm("Are you sure you want to sign out?");
        if (confirmation) {
            try {
                const email = localStorage.getItem('email');
                const signOutResponse = await axios.post('http://localhost:5000/api/users/sign-out', { email });
    
                if (signOutResponse.status === 200) {
                    const totalHoursWorked = signOutResponse.data.hoursWorked;
                    setIsSignedIn(false);
                    setSignInTime(null);
                    setTotalHoursWorked(totalHoursWorked);
    
                    // Now save the total hours worked
                    await axios.post('http://localhost:5000/api/users/total-hours-worked', { email, totalHoursWorked });
    
                    alert("You have been signed out successfully. Total hours worked: " + totalHoursWorked + " hours");
                }
            } catch (error) {
                console.error('Error during sign out:', error);
                alert('Failed to sign out');
            }
        }
    };
    
    

    // ... rest of your component ...

    return (
        <div>
            <div className="sign-in-out-container">
                <button onClick={handleSignIn} disabled={isSignedIn}>Sign In</button>
                <button onClick={handleSignOut} >Sign Out</button>
            </div>
            <div className="sign-in-out-details">
                {signInTime && signInTime instanceof Date && <p>Signed in at: {signInTime.toLocaleTimeString()}</p>}
                {totalHoursWorked !== null && <p>Total Hours Worked: {totalHoursWorked} hours</p>}
            </div>
        </div>
    );
};




// ... rest of the TeacherDashboard component ...

   

    // Updated renderView function
    const renderView = () => {
        switch (view) {
            case 'attendance':
            return (
                <div>
                    <WeeklyAttendanceChart attendanceData={attendanceData} />
                </div>
            );
            case 'classroom':
                return <ClassroomOverview students={students} />;
            case 'salary':
                return <SalaryDetails salary={salary} />;
            case 'invite':
                return <TeacherInvite />;
            case 'signinout':
                return <SignInOutView  />;
            default:
                return (
                    <>
                        <WeeklyAttendanceChart attendanceData={attendanceData} />
                        <ClassroomOverview students={students} />
                        <SalaryDetails salary={salary} />
                        <TeacherInvite />
                    </>
                );
        }
    };
    

    // Updated Navbar
    function Navbar({ toggleView }) {
        const handleLogout = () => {
            const confirmLogout = window.confirm("Are you sure you want to log out?");
        
            if (confirmLogout) {
                localStorage.clear();
        
                // Alert the user
                alert('logging you out');
            
                // Redirect to the home page
                window.location.href='/';
            }
        };
        

        return (
            <nav className="teacher-navbar">
               <ul>
                <li><button onClick={() => toggleView('attendance')}>Attendance</button></li>
                <li><button onClick={() => toggleView('classroom')}>Classroom</button></li>
                <li><button onClick={() => toggleView('salary')}>Salary</button></li>
                <li><button onClick={() => toggleView('signinout')}>Sign In/Out</button></li>
                    <li className="logout-button-container">
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </li>
                </ul>
            </nav>
        );
    }

    // Main render return
    return (
        <div className="teacher-dashboard">
            <Navbar toggleView={setView} />
            <div className="content">
                {renderView()}
            </div>
        </div>
    );
}

export default TeacherDashboard;
