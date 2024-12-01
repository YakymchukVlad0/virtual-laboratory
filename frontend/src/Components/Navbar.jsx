import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import '../Styles/Navbar.css';
import userLogo from '../Images/user-logo-png.png';
import lablogo from '../Images/logo192.png';

const Navbar = () => {
  const { auth, logout } = useAuth(); // Get auth state from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
    }
};

useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

  const handleLogout = () => {
    logout(); // Викликаємо вихід
    setIsDropdownOpen(false); // Закриваємо меню
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>Virtual Study Laboratory</h2>
          <img src={lablogo} alt="logo" />
        </div>
        <ul className="navbar-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/module/activity">Stats and Analytics</NavLink></li>
          <li><NavLink to="/m2">Development</NavLink></li>
          <li><NavLink to="/testing">Testing</NavLink></li>
          <li><NavLink to="/export">Designing</NavLink></li>
        </ul>
        <div className="user-info" onClick={toggleDropdown} ref={dropdownRef}>
            <img src={userLogo} alt="user" />
            {/* Відображаємо ім'я користувача, якщо авторизовано */}
            <p>{auth ? auth.username : 'Student Username'}</p>
            {/* Меню випадає залежно від стану авторизації */}
            {isDropdownOpen && (
                <ul className="dropdown-menu">
                    {auth ? (
                        <>
                            <li><NavLink to="/profile">Profile</NavLink></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <li><NavLink to="/login">Login</NavLink></li>
                    )}
                </ul>
            )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
