import { Link } from "react-router-dom";
import '../Styles/Navbar.css'
import userLogo from '../Images/user-logo-png.png'
import lablogo from '../Images/logo192.png'

const Navbar = () => {
    return ( 
        <nav className="navbar">
        <div className="navbar-logo">
         
          <img src={lablogo} alt="logo"/>
          <h2>Virtual study laboratory</h2>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/module">Stats and Analytics</Link>
          </li>
          <li>
            <Link to="/m2">Development</Link>
          </li>
          <li>
            <Link to="/testing">Testing</Link>
          </li>
          <li>
            <Link to="/export">Export</Link>
          </li>
        </ul>
        <div className="user-info">
            <img src={userLogo} alt="user"></img>
            <p>Student username</p>
        </div>
      </nav>
     );
}
 
export default Navbar;