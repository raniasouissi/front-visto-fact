// Footer.jsx
import React from "react";
import {
  FaPhone,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <a href="/">
            <img src={logo} alt="Logo VistoFact" className="logo-footer" />
          </a>
          <p className="brand-name">
            <span className="orange">Visto</span>

            <span className="blue">Fact</span>
          </p>
          <p className="description">
            Votre partenaire intelligent pour une gestion financière efficace.
          </p>
        </div>
        <div className="footer-section">
          <h2>Liens Utiles</h2>

          <ul className="useful-links">
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/about">Qui-sommes-nous ?</a>
            </li>
            <li>
              <a href="/contact">Contactez-nous</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>Suivez-nous</h2>
          <ul className="social-icons">
            <li>
              <a href="#" className="social-icon">
                <FaFacebookF className="facebook" />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon">
                <FaInstagram className="instagram" />
              </a>
            </li>
            <li>
              <a href="#" className="social-icon">
                <FaLinkedinIn className="linkedin" />
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h2>Adresse</h2>
          <div className="address-links">
            <FaPhone />
            <span> +216 25937533</span>
            <a href="mailto:mail@1234567.com">
              <FaEnvelope />
              <span> contact@visto-fact.com</span>
            </a>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaMapMarkerAlt />
              <span>
                {" "}
                En face de la poste kalaa kbira, Kalaa El Kebira, Sousse, None
                Tunisie
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 VistoFact. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
