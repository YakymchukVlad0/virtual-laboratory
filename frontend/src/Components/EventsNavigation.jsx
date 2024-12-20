import '../Styles/EventsNavigation.css';
import { NavLink } from 'react-router-dom';

function EventsNavigation() {
  return (
    <header className="header">
      <nav>
        <ul className="list">
        <li>
            <NavLink
              to="/module/activity"
              className={({ isActive }) =>
                isActive ? `active list` : "list"
              }
              end
            >
              My activity
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/module/stats"
              className={({ isActive }) =>
                isActive ? `active list` : "list"
              }
              end
            >
              My statistic
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/module/leaderboard"
              className={({ isActive }) =>
                isActive ? `active list` : "list"
              }
            >
              Leaderboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/module/analytics"
              className={({ isActive }) =>
                isActive ? `active list` : "list"
              }
            >
              Analytics
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default EventsNavigation;
