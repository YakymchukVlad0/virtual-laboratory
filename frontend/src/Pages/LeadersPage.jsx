import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventsNavigation from '../Components/EventsNavigation';
import '../Styles/LeadersPage.css';

const LeaderboardPage = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [filters, setFilters] = useState({
        SkillLevel: '',
        ProgrammingLanguage: '',
        TaskCategory: '',
        group: '',
        course_name: '',
    });
    const [authUsername, setAuthUsername] = useState(null);

    // Завантаження студентів та отримання авторизованого username
    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            const authUser = JSON.parse(localStorage.getItem('user')); // Авторизований користувач

            if (authUser) setAuthUsername(authUser.username);

            try {
                const response = await axios.get('http://127.0.0.1:8000/students', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStudents(response.data);
                setFilteredStudents(response.data);
                console.log("Students fetched successfully:", response.data);
                console.log("Active user: ", authUser.username);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    // Оновлення фільтрів
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Обчислення середнього значення для PercentageScore
    const getAverage = (tasks, key) => {
        const validTasks = tasks.filter(task => task[key] !== undefined && task[key] !== null);
        if (validTasks.length === 0) return 0;
        const total = validTasks.reduce((sum, task) => sum + parseFloat(task[key]), 0);
        return total / validTasks.length;
    };

    const getTotalTasksCompleted = (tasks) => {
        if (!Array.isArray(tasks)) {
            return 0;
        }
    
        const completedTasks = tasks.filter((task) => {
            if (!task.hasOwnProperty('TasksCompleted')) {
                console.warn("Task missing tasksCompleted field:", task);
                return false;
            }
            const completed = Number(task.TasksCompleted);
            return completed > 0;
        });
    
        console.log("Filtered completed tasks:", completedTasks);
        return completedTasks.length;
    };
    
    const getTotalErrors = (tasks) => {
        let totalErrors = 0;
        if (Array.isArray(tasks)) {
            tasks.forEach((task) => {
                totalErrors += task.Errors || 0; // Перевірка на NaN
            });
        }
        return totalErrors;
    };

    const getTotalAttemps = (tasks) => { // Оновлення функції для getTotalAttemps
        let totalAttemps = 0;
        if (Array.isArray(tasks)) {
            tasks.forEach((task) => {
                totalAttemps += task.Attempts || 0; // Перевірка на NaN
            });
        }
        return totalAttemps;
    }

    // Обчислення суми TimeSpent
    const getTotalTimeSpent = (tasks) => {
        const validTasks = tasks.filter(task => task.TimeSpent !== undefined && task.TimeSpent !== null);
        return validTasks.reduce((sum, task) => sum + parseFloat(task.TimeSpent), 0);
    };


    const [sortConfig, setSortConfig] = useState({
        key: 'PercentageScore',
        direction: 'ascending', // або 'descending'
    });
    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
    
        setSortConfig({ key, direction });
    
        const sortedStudents = [...filteredStudents].sort((a, b) => {
            const aValue = a[key] || 0;
            const bValue = b[key] || 0;
    
            if (direction === 'ascending') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    
        setFilteredStudents(sortedStudents);
    };
    
    // Застосування фільтрів
    useEffect(() => {
        let filtered = students;

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                filtered = filtered.filter((student) => {
                    // Перевірка фільтрів для групи, курсів і задач
                    if (key === 'group') return student.group === value;
                    if (key === 'course_name') {
                        return student.courses.some(
                            (course) => course.course_name === value
                        );
                    }
                    if (['SkillLevel', 'ProgrammingLanguage', 'TaskCategory'].includes(key)) {
                        return student.tasks.some((task) => task[key] === value);
                    }
                    return true;
                });
            }
        });

        setFilteredStudents(filtered);
    }, [filters, students]);

    return (
        <>
        <EventsNavigation/>
        <div className="leaderboard">
            <h1>Student Leaderboard</h1>
            <div className="filters">
                <select name="SkillLevel" onChange={handleFilterChange} value={filters.SkillLevel}>
                    <option value="">Select Skill Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>

                <select name="ProgrammingLanguage" onChange={handleFilterChange} value={filters.ProgrammingLanguage}>
                    <option value="">Select Language</option>
                    <option value="Python">Python</option>
                    <option value="C++">C++</option>
                    <option value="C#">C#</option>
                    <option value="C">C</option>
                    <option value="Java">Java</option>
                    <option value="JavaScript">JavaScript</option>

                </select>

                <select name="TaskCategory" onChange={handleFilterChange} value={filters.TaskCategory}>
                    <option value="">Select Task Category</option>
                    <option value="recursion">Recursion</option>
                    <option value="loops">Loops</option>
                    <option value="file handling">File Handling</option>
                </select>

                <select name="group" onChange={handleFilterChange} value={filters.group}>
                    <option value="">Select Group</option>
                    <option value="PZ-47">PZ-47</option>
                    <option value="PZ-48">PZ-48</option>
                </select>

                <select name="course_name" onChange={handleFilterChange} value={filters.course_name}>
                    <option value="">Select Course</option>
                    <option value="Developing">Developing</option>
                    <option value="Designing">Designing</option>
                </select>
            </div>
            {filteredStudents.length === 0 ? (
                <p>No students have completed tasks with the selected filters.</p>
            ) : (
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Group</th>
                        <th>Course</th>
                        <th>Tasks Completed</th>
                        <th onClick={() => sortTable('Attempts') }>Attempts</th>
                        <th onClick={() => sortTable('Errors') }>Errors</th>
                        <th onClick={() => sortTable('PercentageScore') }>Percentage Score</th>
                        <th onClick={() => sortTable('TimeSpent') }>Time Spent (hours)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents
                        .sort((a, b) => {
                            const aScore = getAverage(a.tasks, "PercentageScore");
                            const bScore = getAverage(b.tasks, "PercentageScore");
                            return bScore - aScore; // Сортуємо за спаданням
                        })
                        .map((student, index) => {
                            const isAuthUser = student.name === authUsername; // Перевірка по username
                            const avgScore = getAverage(student.tasks, "PercentageScore");
                            const totalTasksCompleted = getTotalTasksCompleted(student.tasks);
                            const totalTimeSpent = getTotalTimeSpent(student.tasks);
                            const totalAttemps = getTotalAttemps(student.tasks); // Оновлення функції для getTotalAttemps
                            const totalErrors = getTotalErrors(student.tasks);

                            return (
                                <tr key={student._id} className={isAuthUser ? 'highlight-row' : ''}>
                                    <td>{index + 1}</td>
                                    <td>{student.name}</td>
                                    <td>{student.group}</td>
                                    <td>{student.courses[0]?.course_name}</td>
                                    <td>{totalTasksCompleted}</td>
                                    <td>{totalAttemps}</td>
                                    <td>{totalErrors}</td>
                                    <td>{avgScore ? avgScore.toFixed(2) + "%" : "N/A"}</td>
                                    <td>{totalTimeSpent ? totalTimeSpent.toFixed(2) : "N/A"}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
            )}
        </div>
        </>
    );
};

export default LeaderboardPage;
