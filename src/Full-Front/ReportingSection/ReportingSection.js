import React, { useState, useEffect, useRef } from 'react';

import { Bar, Pie } from 'react-chartjs-2';
import { 
    CategoryScale, 
    LinearScale, 
    Title, 
    Tooltip, 
    ArcElement, 
    BarElement, 
    BarController, 
    PieController, 
    Legend, 
    Chart as ChartJS 
} from 'chart.js';

// Register the elements and controllers for Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    ArcElement,
    BarElement,
    BarController,
    PieController,
    Legend
);


function ReportingSection() {
    const [chartData, setChartData] = useState({
        labels: ['Attendance', 'Billing'],
        datasets: [{
            label: 'Data Overview',
            data: [75, 50],  // Example data
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    });

    return (
        <div className="reporting-section">
            <h2>Reporting Overview</h2>
            
            <div className="bar-chart-container">
                <h3>Attendance Overview</h3>
                <Bar data={chartData} />
            </div>

            <div className="pie-chart-container">
                <h3>Billing Overview</h3>
                <Pie data={chartData} />
            </div>
        </div>
    );
}





export default ReportingSection;
