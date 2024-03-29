import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChildrenList({ children }) {
    return (
        <div className="children-list">
            <h4>Children Enrolled</h4>
            <div className="children-table">
                {children.map(child => (
                    <div key={child.id} className="child-card">
                        <div className="child-detail"><strong>Name:</strong> {child.childName}</div>
                        <div className="child-detail"><strong>DOB:</strong> {child.dob}</div>
                        <div className="child-detail"><strong>Grade:</strong> {child.grade}</div>
                        <div className="child-detail"><strong>Contact:</strong> {child.contactNumber}</div>
                        <div className="child-detail"><strong>Address:</strong> {child.address}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}


function ClassroomCapacityManager({ onSeeCapacity }) {
    const [selectedClassroomGrade, setSelectedClassroomGrade] = useState('');
    const [classrooms, setClassrooms] = useState([]);
    const [showCapacities, setShowCapacities] = useState(false);

    useEffect(() => {
        // Fetch the grades from the API endpoint
        const fetchGrades = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
                // Extract the grades, assuming each child object has a 'grade' field
                const gradesFromApi = response.data.map(child => child.grade);
                // Deduplicate the grades to get a list of classroom names
                const uniqueGrades = [...new Set(gradesFromApi)];
                setClassrooms(uniqueGrades);
            } catch (error) {
                console.error('Error fetching classrooms:', error);
            }
        };

        fetchGrades();
    }, []);

    const handleSeeCapacity = () => {
        // Check if a grade has been selected
        if (selectedClassroomGrade) {
            // If so, allow the capacity information to be displayed
            setShowCapacities(true);
        } else {
            // If not, reset the display and alert the user
            setShowCapacities(false);
            alert('Please select a classroom grade to see its capacity.');
        }
    };
    return (
        <div className="capacity-management">
            <h4>View Classroom Capacity</h4>
            <div className="form-group">
                <label>Select Grade:</label>
                <select 
                    value={selectedClassroomGrade}
                    onChange={(e) => setSelectedClassroomGrade(e.target.value)}
                    required>
                    <option value="">--Choose Grade--</option>
                    {/* Classroom options */}
                    {classrooms.map((grade, index) => (
                        <option key={index} value={grade}>
                            {grade}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={() => setShowCapacities(true)}>See Capacity</button>
            {showCapacities && (
                <div className="capacity-information">
                    <div className="capacity-card">Infant: 8</div>
                    <div className="capacity-card">Toddler: 12</div>
                    <div className="capacity-card">Twaddler: 16</div>
                    <div className="capacity-card">3 Years Old: 18</div>
                    <div className="capacity-card">4 Years Old: 20</div>
                </div>
            )}
        </div>
    );
}





function ClassroomManagement() {
    const [currentView, setCurrentView] = useState('');
    const [classrooms, setClassrooms] = useState([]);
    const [children, setChildren] = useState([]);

    useEffect(() => {
        fetchChildren();
    }, []);

   

    const fetchChildren = async () => {
        try {
            // Use GET request to fetch children
            const response = await axios.get('http://localhost:5000/api/users/retrieve-children');
            setChildren(response.data);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

 

    return (
        <div>
            <h3>Classroom Management</h3>
            <div className="management-options">
                <button onClick={() => setCurrentView('viewClassrooms')}>View Classrooms</button>
                <button onClick={() => setCurrentView('manageCapacity')}>Classroom Capacity</button>
            </div>

            {currentView === 'viewClassrooms' && (
                <ChildrenList children={children} />
            )}

            {currentView === 'manageCapacity' && (
                <ClassroomCapacityManager classrooms={classrooms} />
            )}
        </div>
    );
}

export default ClassroomManagement;
