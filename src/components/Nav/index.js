import React from "react";
import classNames from "classnames";
import * as Reach from "@reach/router";
import "./style.css";

const Nav = () => (
  <ul className="nav">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/lang">Lang</NavLink>
    <NavLink to="/region">Region</NavLink>
    <NavLink to="/video">Video</NavLink>
    <NavLink to="/video-map">Video on map</NavLink>
    <NavLink to="/team">Team</NavLink>
    <NavLink to="/users">Users</NavLink>
    <NavLink to="/orders">Orders</NavLink>
  </ul>
);

export default Nav;

const NavLink = ({ to, children }) => (
  <div className="nav__item">
    <Reach.Match path={to}>
      {({ match }) => (
        <Reach.Link
          className={classNames({
            nav__link: true,
            nav__link_state_current: match
          })}
          to={to}
        >
          {children}
        </Reach.Link>
      )}
    </Reach.Match>
  </div>
);
