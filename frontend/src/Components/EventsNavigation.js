<<<<<<< HEAD
import '../Styles/EventsNavigation.css';
=======
import React from "react";
import classes from '../Styles/EventsNavigation.module.css';
>>>>>>> c2f81cf2fba6fa797ea8c6254bc466ea0dbe312b
import { NavLink } from 'react-router-dom';

function EventsNavigation() {
  return (
    <header className="header">
      <nav>
        <ul className="list">
        <li>
            <NavLink
              to="/module"
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
              to="leaderboard"
              className={({ isActive }) =>
                isActive ? `active list` : "list"
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
