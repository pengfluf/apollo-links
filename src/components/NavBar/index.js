import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

import { AUTH_TOKEN } from '../Login/constants';

import './style.css';

function NavBar() {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="navbar">

      <NavLink
        to="/"
        className="navbar__link"
      >
        New
      </NavLink>

      <NavLink
        to="/top"
        className="navbar__link"
      >
        Top
      </NavLink>

      {
        authToken && (
          <NavLink
            to="/create"
            className="navbar__link"
          >
              Create New Link
          </NavLink>
        )
      }

      <NavLink
        to="/search"
        className="navbar__link"
      >
        Search
      </NavLink>

      {
        authToken ? (
          <NavLink
            to="/"
            className="navbar__link"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
            }}
          >
            Logout
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className="navbar__link"
          >
            Login
          </NavLink>
        )
      }

    </div>
  );
}

export default withRouter(NavBar);
