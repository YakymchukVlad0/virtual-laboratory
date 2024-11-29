import React, { useState, useEffect } from "react";
import DateFilter from "../Components/DateFilter.jsx";
import EventsNavigation from "../Components/EventsNavigation.jsx";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';
import { Line, Bar } from "react-chartjs-2";
import axios from 'axios';

// Register the necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

// Function to aggregate data
const aggregateData = (data, period) => {
    const aggregated = {};

    data.forEach(item => {
        let key;
        const date = new Date(item.date);

        if (period === 'by week') {
            const week = getWeekNumber(date);
            key = `${date.getFullYear()}-W${week}`;
        } else if (period === 'by month') {
            key = date.toISOString().slice(0, 7); // YYYY-MM
        } else if (period === 'by day of week') {
            key = date.getDay(); // 0 = Sunday, 1 = Monday, ...
        } else {
            key = item.date; // Default: no aggregation
        }

        if (aggregated[key]) {
            aggregated[key] += item.duration;
        } else {
            aggregated[key] = item.duration;
        }
    });

    return Object.keys(aggregated)
        .map(key => ({
            key,
            duration: aggregated[key]
        }))
        .sort((a, b) => new Date(a.key) - new Date(b.key));
};

// Function to get week number
const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

const ActivityPage = () => {
    const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0 });
    const [chartData, setChartData] = useState({});
    const [monthlyData, setMonthlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('by day');
    const [dateRange, setDateRange] = useState({ start: "2024-01-01", end: "2024-12-31" });

    const fetchActivityStats = async () => {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (!userString) {
            alert("Please log in again.");
            return;
        }

        const user = JSON.parse(userString);
        const userId = user.id;

        if (!userId) {
            alert("Please log in again.");
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:8000/activity/stats', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    start_date: dateRange.start,
                    end_date: dateRange.end
                }
            });

            const aggregatedData = aggregateData(response.data.stats, selectedPeriod);

            setTotalTime({
                hours: response.data.total_hours,
                minutes: response.data.total_minutes
            });

            // Prepare chart data
            const labels = aggregatedData.map(item => item.key);
            const dataPoints = aggregatedData.map(item => item.duration);

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: `Time Spent (${selectedPeriod.replace('by ', '')})`,
                        data: dataPoints,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4,
                    }
                ]
            });

            // Aggregated data by month and day of week
            const monthlyAggregated = aggregateData(response.data.stats, 'by month');
            const weeklyAggregated = aggregateData(response.data.stats, 'by day of week');

            // Set monthly and weekly data
            setMonthlyData(monthlyAggregated);
            setWeeklyData(weeklyAggregated);

        } catch (error) {
            console.error("Error fetching activity stats:", error);
            alert("There was an error fetching your activity stats. Please try again later.");
        }
    };

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchActivityStats();
        }
    }, [dateRange, selectedPeriod]);

    const chartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const rawDuration = tooltipItem.raw;
                        const hours = Math.floor(rawDuration / 60);
                        const minutes = rawDuration % 60;
                        return `${hours}h ${minutes}m`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Time Spent (minutes)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: selectedPeriod === 'by week' ? 'Week' : 'Date'
                }
            }
        }
    };

    return (
        <>
            <EventsNavigation />
            <h1>My Activity</h1>
            <h3>Activity Insights</h3>
            <p>Keep track of your learning activity, and progress toward your goals. Use the date filter for activity in different time frames.</p>

            <DateFilter setDateRange={setDateRange} setSelectedPeriod={setSelectedPeriod} />

            <div>
                <h3>Total Time: {totalTime.hours} hours {totalTime.minutes} minutes</h3>
            </div>

            <div>
                {chartData.labels ? (
                    <Line data={chartData} options={chartOptions} />
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>

            {/* New Graphs: Activity by Month */}
            <div>
                <h3>Activity by Month</h3>
                {monthlyData.length > 0 && (
                    <Bar
                        data={{
                            labels: monthlyData.map(item => item.key),
                            datasets: [
                                {
                                    label: 'Time Spent (minutes)',
                                    data: monthlyData.map(item => item.duration),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Monthly Activity'
                                }
                            }
                        }}
                    />
                )}
            </div>

            {/* New Graphs: Activity by Day of Week */}
            <div>
                <h3>Activity by Day of Week</h3>
                {weeklyData.length > 0 && (
                    <Bar
                        data={{
                            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                            datasets: [
                                {
                                    label: 'Time Spent (minutes)',
                                    data: weeklyData.map(item => item.duration),
                                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Weekly Activity'
                                }
                            }
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default ActivityPage;
