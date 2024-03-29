import React, { useState,useEffect } from 'react';
import axios from 'axios';
function ReportsManagement() {
    const [currentReport, setCurrentReport] = useState('');

    return (
        <div className="reports-management">
            <div className="reports-options">
                <button onClick={() => setCurrentReport('attendanceReports')}>Attendance Reports</button>
                <button onClick={() => setCurrentReport('financialReports')}>Financial Reports</button>
            </div>

            {currentReport === 'attendanceReports' && <AttendanceReports />}
            {currentReport === 'financialReports' && <FinancialReports />}
        </div>
    );
}

function AttendanceReports() {
    const [attendanceData, setAttendanceData] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/api/users/retrieve-children')
            .then(response => {
                const data = processAttendanceData(response.data);
                setAttendanceData(data);
            })
            .catch(error => console.error('Error fetching children data:', error));
    }, []);

    const processAttendanceData = (children) => {
        const data = {};

        children.forEach(child => {
            const grade = child.grade;
            const status = child.attendance && child.attendance.status; // Assuming attendance status is part of child data

            if (!data[grade]) {
                data[grade] = { total: 0, present: 0, absent: 0 };
            }

            data[grade].total += 1;
            if (status === 'present') {
                data[grade].present += 1;
            } else {
                data[grade].absent += 1;
            }
        });

        return data;
    };

    return (
        <div className="attendance-report-container">
            {Object.entries(attendanceData).map(([grade, { total, present, absent }]) => (
                <div key={grade} className="grade-attendance-card">
                    <h4>Grade {grade} (Total: {total})</h4>
                    <p>Present: {present}</p>
                    <p>Absent: {absent}</p>
                </div>
            ))}
        </div>
    );
}

function FinancialReports() {
    const [financialData, setFinancialData] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/apireports/weekly-financial')
            .then(response => setFinancialData(response.data))
            .catch(error => console.error('Error fetching financial data:', error));
    }, []);

    return (
        <div className="report-content">
            <p>Total Money Earned: ${financialData.totalEarned}</p>
            <p>Total Money Billed: ${financialData.totalBilled}</p>
        </div>
    );
}

export default ReportsManagement;
