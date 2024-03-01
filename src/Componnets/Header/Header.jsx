// Header.jsx
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo1 from "../../assets/images/logo1.png";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const hideMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Vérifie si la page est soit signin ou signup
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Si c'est une page de connexion, ne pas afficher le Header
  if (isLoginPage) {
    return null;
  }

  return (
    // Le reste de votre composant Header
    <header className={`header ${mobileMenuOpen ? "active" : ""}`}>
      <div className="header-container">
        <Link to="/" className="logo" onClick={hideMobileMenu}>
          <div className="logo-container">
            <img src={logo1} alt="Logo Visto Fact" className="app-logo" />
          </div>
          <span className="visto">Visto</span>
          <span className="fact">Fact</span>
        </Link>

        <div
          className={`menu-icon ${mobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link
              to="/devis"
              className="nav-link bordered-button devis"
              onClick={hideMobileMenu}
            >
              Devis
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/login"
              className="nav-link bordered-button connect"
              onClick={hideMobileMenu}
            >
              Se Connecter
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/register"
              className="nav-link bordered-button register"
              onClick={hideMobileMenu}
            >
              Inscription
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
