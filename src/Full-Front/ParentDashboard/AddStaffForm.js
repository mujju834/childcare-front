import React from 'react';
import { useStaff } from '../../contexts/StaffContext';


function AddStaffForm() {
    const { addStaff } = useStaff();
    const handleSubmit = (e) => {
        e.preventDefault();

        const staffName = e.target.staffName.value;
        const email = e.target.email.value;
        const role = e.target.role.value;
        const contactNumber = e.target.contactNumber.value;

        addStaff({ staffName, email, role, contactNumber });
        alert("Staff details submitted successfully!");

        // Optionally, you can clear the form or redirect to another page here
    };

    return (
        <div className="add-staff-form">
            <h3>Add Staff</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="staffName">Staff Name:</label>
                    <input type="text" id="staffName" name="staffName" placeholder="Enter staff name" required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Enter email" required />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="">Select Role</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input type="tel" id="contactNumber" name="contactNumber" placeholder="Enter contact number" required />
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default AddStaffForm;
