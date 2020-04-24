import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav>
      <div className="nav-wrapper">
        <NavLink to="/" activeClassName="active" className="brand-logo">
          Chat Ware
        </NavLink>
        <ul className="right">
          <li>
            <NavLink to="/shop" activeClassName="active">
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeClassName="active">
              About us
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
