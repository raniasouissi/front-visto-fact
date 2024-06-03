import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo1 from "../../assets/images/vbil2.png";
import "./Header.css";
//import Logout from "../../auth/logout/logout";

const Header = ({ isLoggedIn }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Fermer le menu
  };

  const isDashboardAdmin = location.pathname === "/dashboard";

  const isDashboardFinancier = location.pathname === "/dashboard-financier";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isSetpasswordpage = location.pathname.startsWith("/set-password");
  const isResetPassword = location.pathname === "/reset-password";

  const headerClass = isDashboardAdmin ? "header dashboard-header" : "header";

  if (isSetpasswordpage || isResetPassword) {
    return (
      <header className={headerClass}>
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-container">
              <img src={logo1} alt="Logo Visto Fact" className="app-logo" />
            </div>
            <span className="v">V</span>
            <span className="b">Bill</span>
          </Link>
        </div>
      </header>
    );
  }

  if (
    isLoginPage ||
    isRegisterPage ||
    isSetpasswordpage ||
    isDashboardAdmin ||
    isDashboardFinancier
  ) {
    return null;
  }

  return (
    <header className={headerClass}>
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-container">
            <img src={logo1} alt="Logo Visto Fact" className="app-logo" />
          </div>
          <div className="logoname">
            <span className="visto">V</span>
            <span className="fact">Bill</span>
          </div>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link
              to="/devis"
              className="nav-link bordered-button devis"
              onClick={closeMenu}
            >
              Devis
            </Link>
          </li>
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-link bordered-button connect"
                  onClick={closeMenu}
                >
                  Se Connecter
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className="nav-link bordered-button register"
                  onClick={closeMenu}
                >
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Header;
