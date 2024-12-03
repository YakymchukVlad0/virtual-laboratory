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
            <img src={userLogo} alt="user" style={{
            width: '40px', 
            height: '40px', 
            borderRadius: '50%',
            
            marginRight: '10px', // Відступ між логотипом і ім'ям
        }} />
            {/* Відображаємо ім'я користувача, якщо авторизовано */}
            <p style={{paddingRight: '20px', marginTop: '15px', marginLeft: '0px'}}>{auth ? auth.username : 'Student Username'}</p>
            {/* Меню випадає залежно від стану авторизації */}
            {isDropdownOpen && (
                <ul className={`dropdown-menu1 ${isDropdownOpen ? 'open' : ''}`}>
                    {auth ? (
                        <>
                            <li><NavLink to="/profile" style={{fontSize: '19px', color: 'white', border: '1px', fontWeight: 'bold', textDecoration: 'none'}}>Profile</NavLink></li>
                            <li><button className='logout-button' onClick={handleLogout} style={{marginTop: '-50px', marginBottom: '-50px', marginLeft: '-57px', fontSize: '19px', color: 'white', border: '1px', height: '50px'}}>Logout</button></li>
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
