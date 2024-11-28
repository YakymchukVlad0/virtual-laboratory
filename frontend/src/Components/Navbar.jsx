import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import '../Styles/Navbar.css';
import userLogo from '../Images/user-logo-png.png';
import lablogo from '../Images/logo192.png';

const Navbar = () => {
  const { auth, logout } = useAuth(); // Get auth state from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
          <li><NavLink to="/module">Stats and Analytics</NavLink></li>
          <li><NavLink to="/m2">Development</NavLink></li>
          <li><NavLink to="/testing">Testing</NavLink></li>
          <li><NavLink to="/export">Designing</NavLink></li>
        </ul>
        <div className="user-info" onClick={toggleDropdown}>
          <img src={userLogo} alt="user" />
          {/* Відображаємо ім'я користувача, якщо авторизовано */}
          <p>{auth ? auth.username : 'Student Username'}</p>
          {/* Меню випадає залежно від стану авторизації */}
          <ul
            className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {auth ? (
              <>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <li><NavLink to="/login">Login</NavLink></li>
            )}
          </ul>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;
