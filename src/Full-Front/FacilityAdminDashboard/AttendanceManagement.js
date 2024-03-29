import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendanceManagement() {
    const [attendees, setAttendees] = useState([]);
    const [attendanceType, setAttendanceType] = useState('');

    useEffect(() => {
        if (attendanceType) {
            fetchAttendees(attendanceType);
        }
    }, [attendanceType]);

    const fetchAttendees = async (type) => {
        const endpoint = type === 'staff' 
            ? 'http://localhost:5000/api/users/retrieve-staff-attendance' 
            : 'http://localhost:5000/api/users/retrieve-children-attendance';
        
        try {
            const response = await axios.get(endpoint);
            setAttendees(response.data);
        } catch (error) {
            console.error('Error fetching attendees:', error);
        }
    };

    const attendanceButton = (attendee) => {
        const today = new Date().toISOString().split('T')[0];
        const attendanceDate = attendee.attendance?.date.split('T')[0];
    
        if (attendanceDate === today) {
            return (
                <button disabled className={attendee.attendance.status === 'present' ? 'present-button' : 'absent-button'}>
                    {attendee.attendance.status === 'present' ? 'Present Today' : 'Absent'}
                </button>
            );
        } else {
            return (
                <>
                    <button onClick={() => handleAttendance(attendee.name || attendee.childName, 'present')} className="present-button">Present</button>
                    <button onClick={() => handleAttendance(attendee.name || attendee.childName, 'absent')} className="absent-button">Absent</button>
                </>
            );
        }
    };
    

    const handleAttendance = async (attendeeName, attendanceStatus) => {
        try {
            // Determine the endpoint and data structure based on the attendanceType
            const endpoint = attendanceType === 'staff' 
                ? 'http://localhost:5000/api/users/staff/attendance' 
                : 'http://localhost:5000/api/users/children/attendance';
            
            const data = attendanceType === 'staff' 
                ? { name: attendeeName, status: attendanceStatus } 
                : { childName: attendeeName, status: attendanceStatus };
    
            // Send the POST request to mark attendance
            await axios.post(endpoint, data);
    
            // Show success alert
            alert(`${attendeeName}'s attendance marked as ${attendanceStatus} successfully`);
    
            // Refetch attendees to update the UI with the new attendance status
            await fetchAttendees(attendanceType);
    
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };
    
    //get today date 
    function getCurrentFormattedDate() {
        const now = new Date();
        return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    
    

    const getAttendeeName = (attendee) => {
        return attendanceType === 'staff' ? attendee.name : attendee.childName;
    };

    return (
        <div className="attendance-management">
            <h3>Attendance Management</h3>
{/* display the current date */}
            <div>
                <h4>{getCurrentFormattedDate()}</h4> {/* Display the current date */}
            </div>
            <div className="attendance-buttons">
                <button onClick={() => setAttendanceType('staff')}>Staff Attendance</button>
                <button onClick={() => setAttendanceType('children')}>Children Attendance</button>
            </div>
            <div className="attendees-list">
            {attendees.map(attendee => (
                <div key={attendee._id} className="attendee-card">
                    <div className="attendee-info">
                        <span className="attendee-name">{attendee.name || attendee.childName}</span>
                    </div>
                    <div className="attendance-action-buttons">
                        {attendanceButton(attendee)}
                    </div>
                </div>
            ))}
        </div>
    </div>
);
}

export default AttendanceManagement;






