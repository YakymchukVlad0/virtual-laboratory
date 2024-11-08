import { NavLink, Outlet } from "react-router-dom";
import '../Styles/Navbar.css'
import userLogo from '../Images/user-logo-png.png'
import lablogo from '../Images/logo192.png'

const Navbar = () => {
    return ( 
      <>
        <nav className="navbar">
        <div className="navbar-logo">
         
          <img src={lablogo} alt="logo"/>
          <h2>Virtual study laboratory</h2>
        </div>
        <ul className="navbar-links">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/module">Stats and Analytics</NavLink>
          </li>
          <li>
            <NavLink to="/m2">Development</NavLink>
          </li>
          <li>
            <NavLink to="/testing">Testing</NavLink>
          </li>
          <li>
            <NavLink to="/export">Export</NavLink>
          </li>
        </ul>
        <div className="user-info">
            <img src={userLogo} alt="user"></img>
            <p>Student username</p>
        </div>
        
      </nav>
      <Outlet/>
      </>
      
     );
}
 
export default Navbar;