import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaBars } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo1 from "../../assets/images/logo1.png";
import "./Header.css";
import Logout from "../../auth/logout/logout";

const Header = ({ isLoggedIn }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isDashboardAdmin = location.pathname === "/dashboard-admin";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isSetpasswordpage = location.pathname.startsWith("/set-password");
  const isResetPassword = location.pathname === "/reset-password";

  const headerClass = isDashboardAdmin ? "header dashboard-header" : "header";

  if (isDashboardAdmin) {
    return (
      <header className={headerClass} style={{ background: "transparent" }}>
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-container">
              <img src={logo1} alt="Logo Visto Fact" className="app-logo" />
            </div>
            <span className="visto">Visto</span>
            <span className="fact">Fact</span>
          </Link>

          <div className="menu-icon" onClick={toggleMenu}>
            <FaBars />
          </div>

          <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <li className="nav-item">
              <Logout />
            </li>
          </ul>
        </div>
      </header>
    );
  }

  if (isSetpasswordpage || isResetPassword) {
    return (
      <header className={headerClass}>
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-container">
              <img src={logo1} alt="Logo Visto Fact" className="app-logo" />
            </div>
            <span className="visto">Visto</span>
            <span className="fact">Fact</span>
          </Link>
        </div>
      </header>
    );
  }

  if (isLoginPage || isRegisterPage || isSetpasswordpage) {
    return null;
  }

  return (
    <header className={headerClass}>
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-container">
            <img src={logo1} alt="Logo Visto Fact" className="app-logo" />
          </div>
          <span className="visto">Visto</span>
          <span className="fact">Fact</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/devis" className="nav-link bordered-button devis">
              Devis
            </Link>
          </li>
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link bordered-button connect">
                  Se Connecter
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className="nav-link bordered-button register"
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
