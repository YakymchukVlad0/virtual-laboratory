import classes from '../Styles/EventsNavigation.module.css';
import { NavLink } from 'react-router-dom';

function EventsNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="stats"
              className={({ isActive }) =>
                isActive ? `${classes.active} ${classes.list}` : classes.list
              }
              end
            >
              My statistic
            </NavLink>
          </li>
          <li>
            <NavLink
              to="analytics"
              className={({ isActive }) =>
                isActive ? `${classes.active} ${classes.list}` : classes.list
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
