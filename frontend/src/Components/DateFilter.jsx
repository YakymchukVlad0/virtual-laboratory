import React, { useState, useRef } from 'react';
import '../Styles/DateFilter.css';

const DateFilter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('1 year');
    const buttonRef = useRef(null);

    const toggleModal = () => setIsOpen(!isOpen);

    // Застосування фільтра
    const applyFilter = () => {
        if (startDate && endDate) {
            alert(`Selected custom date range: From ${startDate} to ${endDate}`);
        } else {
            alert(`Selected period: ${selectedPeriod}`);
        }
        toggleModal();
    };

    return (
        <div className="filter-container" ref={buttonRef}>
            <button className="filter-button" onClick={toggleModal}>Last Year</button>

            {isOpen && (
                <div className="dropdown">
                    <div className="dropdown-content">
                        <h3>Select Date Range</h3>

                        {/* Поля введення дати початку і кінця */}
                        <div className="date-inputs">
                            <label htmlFor="startDate">From:</label>
                            <input 
                                type="month" 
                                id="startDate" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                                placeholder="YYYY-MM"
                            />
                            <label htmlFor="endDate">To:</label>
                            <input 
                                type="month" 
                                id="endDate" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                                placeholder="YYYY-MM"
                            />
                        </div>

                        {/* Швидкий вибір періоду */}
                        <div className="calendar">
                            <label>Quick select</label>
                            <div>
                                <input 
                                    type="radio" 
                                    name="period" 
                                    id="last30" 
                                    value="30 days" 
                                    checked={selectedPeriod === "30 days"}
                                    onChange={() => setSelectedPeriod("30 days")}
                                />
                                <label htmlFor="last30">Last 30 days</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="period" 
                                    id="last3months" 
                                    value="3 months" 
                                    checked={selectedPeriod === "3 months"}
                                    onChange={() => setSelectedPeriod("3 months")}
                                />
                                <label htmlFor="last3months">Last 3 months</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="period" 
                                    id="lastYear" 
                                    value="1 year" 
                                    checked={selectedPeriod === "1 year"}
                                    onChange={() => setSelectedPeriod("1 year")}
                                />
                                <label htmlFor="lastYear">Last year</label>
                            </div>

                            <label>Custom</label>
                            <div>
                                <input 
                                    type="radio" 
                                    name="period" 
                                    id="byDay" 
                                    value="by day" 
                                    checked={selectedPeriod === "by day"}
                                    onChange={() => setSelectedPeriod("by day")}
                                />
                                <label htmlFor="byDay">By day</label>
                            </div>
                            <div>
                                <input 
                                    type="radio" 
                                    name="period" 
                                    id="byMonth" 
                                    value="by month" 
                                    checked={selectedPeriod === "by month"}
                                    onChange={() => setSelectedPeriod("by month")}
                                />
                                <label htmlFor="byMonth">By month</label>
                            </div>
                        </div>

                        {/* Кнопки застосування/скасування */}
                        <div className="buttons">
                            <button onClick={applyFilter}>Apply</button>
                            <button onClick={toggleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateFilter;
