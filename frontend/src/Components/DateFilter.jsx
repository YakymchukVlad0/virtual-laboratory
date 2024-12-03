import React, { useState, useRef, useEffect } from 'react';
import '../Styles/DateFilter.css';

const DateFilter = ({ setDateRange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-12-31');
    const [selectedPeriod, setSelectedPeriod] = useState('1 year');
    const [error, setError] = useState(null);
    const modalRef = useRef(null);

    const toggleModal = () => setIsOpen(!isOpen);

    // Оновлення дат залежно від вибраного періоду
    useEffect(() => {
        const today = new Date();
        let newStartDate, newEndDate;

        switch (selectedPeriod) {
            case '1 year':
                newStartDate = `${today.getFullYear()}-01-01`;
                newEndDate = `${today.getFullYear()}-12-31`;
                break;
            case '6 months':
                const sixMonthsAgo = new Date(today);
                sixMonthsAgo.setMonth(today.getMonth() - 6);
                newStartDate = sixMonthsAgo.toISOString().split('T')[0];
                newEndDate = today.toISOString().split('T')[0];
                break;
            case '3 months':
                const threeMonthsAgo = new Date(today);
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                newStartDate = threeMonthsAgo.toISOString().split('T')[0];
                newEndDate = today.toISOString().split('T')[0];
                break;
            case '1 week':
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(today.getDate() - 7);
                newStartDate = oneWeekAgo.toISOString().split('T')[0];
                newEndDate = today.toISOString().split('T')[0];
                break;
            case 'custom':
                // Кастомний режим, залишаємо поточні дати
                return;
            default:
                return;
        }

        setStartDate(newStartDate);
        setEndDate(newEndDate);
    }, [selectedPeriod]);

    // Валідація кастомного діапазону
    const validateDates = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            setError("Start date cannot be later than end date.");
            return false;
        }

        setError(null);
        return true;
    };

    // Застосування фільтра
    const applyFilter = () => {
        if (selectedPeriod === 'custom' && !validateDates()) return;

        setDateRange({ start: startDate, end: endDate });
        toggleModal();
    };

    // Закриття модального вікна кліком поза межами
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="filter-container">
            <button className="filter-button" onClick={toggleModal}>Date Filter</button>

            {isOpen && (
                <div className="dropdown" ref={modalRef}>
                    <div className="dropdown-content" style={{ position: 'relative', width: '400px',marginLeft: '50%', display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                        <h3>Select Date Range</h3>

                        {/* Поля введення дат */}
                        {selectedPeriod === 'custom' && (
                            <div className="date-inputs">
                                <label htmlFor="startDate">From:</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    placeholder="YYYY-MM-DD"
                                />
                                <label htmlFor="endDate">To:</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    placeholder="YYYY-MM-DD"
                                />
                            </div>
                        )}

                        {/* Швидкий вибір періоду */}
                        <div className="calendar">
                            <label>Quick Select</label>
                            <div>
                            <div>
                                <input
                                    type="radio"
                                    name="period"
                                    id="lastWeek"
                                    value="1 week"
                                    checked={selectedPeriod === "1 week"}
                                    onChange={() => setSelectedPeriod("1 week")}
                                />
                                <label htmlFor="lastWeek">Last week</label>
                            </div>
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
                            </div>
                            <div>
                            <div>
                                <input
                                    type="radio"
                                    name="period"
                                    id="last6months"
                                    value="6 months"
                                    checked={selectedPeriod === "6 months"}
                                    onChange={() => setSelectedPeriod("6 months")}
                                />
                                <label htmlFor="last6months">Last 6 months</label>
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
                            <div>
                                <input
                                    type="radio"
                                    name="period"
                                    id="custom"
                                    value="custom"
                                    checked={selectedPeriod === "custom"}
                                    onChange={() => setSelectedPeriod("custom")}
                                />
                                <label htmlFor="custom">Custom Range</label>
                            </div>
                            </div>
                        </div>

                        {/* Помилка валідації */}
                        {error && <p className="error">{error}</p>}

                        {/* Кнопки */}
                        <div className="buttons">
                            <button style={{marginLeft: '35px', width: '130px'}} onClick={applyFilter}>Apply</button>
                            <button style={{marginLeft: '0px', width: '130px'}} onClick={toggleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateFilter;
