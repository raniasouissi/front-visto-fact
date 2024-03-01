import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import Select from "react-select";
import "./signup.css";

const Signup = () => {
  const history = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phonenumber, setPhoneNumber] = useState("");
  const [codepostale, setCodePostale] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isButtonVisible, setButtonVisibility] = useState(true);

  const countryOptions = [
    "Tunisie",
    "France",
    "États-Unis",
    "Japon",
    "Allemagne",
    "Espagne",
    "Italie",
    "Brésil",
    "Inde",
    "Chine",
    "Australie",
    "Canada",
    "Mexique",
    "Royaume-Uni",
    "Russie",
    "Corée du Sud",
    "Afrique du Sud",
    "Turquie",
    "Arabie saoudite",
    "Égypte",
    "Nigeria",
    "Argentine",
    "Suisse",
  ].map((country) => ({ value: country, label: country }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roles = ["client"];

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !selectedCountry ||
      !phonenumber ||
      !codepostale
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    } else {
      setError("");
    }

    if (!email.includes("@")) {
      setError("Adresse e-mail invalide");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      setError(
        "Le mot de passe doit faire au moins 8 caractères, contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    } else {
      setError("");
    }

    const phoneRegex = /^\d{8}$/;
    if (!phonenumber.match(phoneRegex)) {
      setError("Numéro de téléphone invalide (8 chiffres)");
      return;
    } else {
      setError("");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
          address,
          pays: selectedCountry.value,
          phonenumber,
          codepostale,
          roles,
        }
      );

      setName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setSelectedCountry(null);
      setPhoneNumber("");
      setCodePostale("");
      setSuccess(true);

      document.cookie = `AuthenticationToken=${response.data.token}; path=/`;
      history("/login");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setButtonVisibility(true);
  };

  const handleCountryOpen = () => {
    setButtonVisibility(false);
  };

  useEffect(() => {
    let timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError("");
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [error]);

  return (
    <div className="signup-container">
      <Link to="/" className="back-button">
        <FaArrowLeft /> Retour
      </Link>

      <form className="signup-form" onSubmit={handleSubmit}>
        {loading && (
          <div className="loading-container">
            <FaSpinner className="loading-icon" />
            <p>Chargement en cours...</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <p className="success-message">
            Inscription réussie ! Redirection vers la page de connexion...
          </p>
        )}
        <h2 className="text-fade-in">
          Créez votre compte chez <span className="orange-text">Visto</span>
          <span className="blue-text">Fact</span>
        </h2>
        <div className="form-row">
          <div className="form-group">
            <label>Nom et Prénom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Mot de Passe</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Pays</label>
            <Select
              value={selectedCountry}
              onChange={handleCountryChange}
              options={countryOptions}
              onMenuOpen={handleCountryOpen}
            />
          </div>
          <div className="form-group">
            <label>Numéro de Téléphone</label>
            <input
              type="text"
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Code Postal</label>
            <input
              type="text"
              value={codepostale}
              onChange={(e) => setCodePostale(e.target.value)}
            />
          </div>
        </div>
        {isButtonVisible && (
          <div className="center-button">
            <button type="submit" className="submit-button">
              S&apos;inscrire
            </button>
          </div>
        )}
        <div className="mt-3">
          <p>
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="signin-link">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
