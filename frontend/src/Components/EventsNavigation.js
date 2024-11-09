import '../Styles/EventsNavigation.css';
import { NavLink } from 'react-router-dom';

function EventsNavigation() {
  return (
    <header className="header">
      <nav>
        <ul className="list">
          <li>
            <NavLink
              to="stats"
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
              to="my_activity"
              className={({ isActive }) =>
                isActive ? `${classes.active} ${classes.list}` : classes.list
              }
            >
              My activity
            </NavLink>
          </li>
          <li>
            <NavLink
              to="leaderboard"
              className={({ isActive }) =>
                isActive ? `${classes.active} ${classes.list}` : classes.list
              }
            >
              Leaderboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="analytics"
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
