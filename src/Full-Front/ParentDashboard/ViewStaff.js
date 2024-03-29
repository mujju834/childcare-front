import React from 'react';
import { useStaff } from '../../contexts/StaffContext';
import './ViewStaff.css';

function ViewStaff() {
    const { staffList } = useStaff();

    return (
        <div className="staff-list">
            <h3>Staff Details</h3>
            <div className="staff-cards">
                {staffList.map((staff, index) => (
                    <div className="staff-card" key={index}>
                        <p><strong>Name:</strong> {staff.staffName}</p>
                        <p><strong>Email:</strong> {staff.email}</p>
                        <p><strong>Role:</strong> {staff.role}</p>
                        <p><strong>Contact Number:</strong> {staff.contactNumber}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewStaff;
