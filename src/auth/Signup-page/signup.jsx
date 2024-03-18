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
  const [matriculeFiscale, setMatriculeFiscale] = useState("");
  const [isMatriculeFiscaleOptional, setIsMatriculeFiscaleOptional] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isButtonVisible, setButtonVisibility] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const validatePhoneNumber = (phoneNumber) => {
    const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

    if (numericPhoneNumber.length < 8) {
      return false;
    }

    if (!/^\d+$/.test(numericPhoneNumber)) {
      return false;
    }

    return true;
  };
  useEffect(() => {
    // Efface les messages d'erreur et de succès après 5 secondes
    const timeout = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

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
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      setError(
        "Le mot de passe doit faire au moins 8 caractères, contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    if (!validatePhoneNumber(phonenumber)) {
      setError("Numéro de téléphone invalide");
      return;
    }

    try {
      setLoading(true);
      const requestBody = {
        name,
        email,
        password,
        address,
        pays: selectedCountry.value,
        phonenumber,
        codepostale,
        roles,
      };

      if (isMatriculeFiscaleOptional) {
        requestBody.matriculeFiscale = matriculeFiscale;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        requestBody
      );

      setName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setSelectedCountry(null);
      setPhoneNumber("");
      setCodePostale("");
      setMatriculeFiscale("");
      setIsMatriculeFiscaleOptional(false);
      setSuccess("Inscription réussie ! ");

      document.cookie = `AuthenticationToken=${response.data.token}; path=/`;
      setTimeout(() => {
        history(`/verification?email=${email}`);
      }, 3000); // Redirection après 3 secondes
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);

      if (error.response && error.response.status) {
        if (error.response.status === 409) {
          // 409 Conflict, l'adresse e-mail existe déjà
          setError("L'adresse e-mail est déjà utilisée.");
        } else {
          // Autres erreurs du serveur
          setError("Une erreur est survenue lors de l'inscription.");
        }
      } else {
        // Erreurs non gérées
        setError("Une erreur est survenue lors de l'inscription.");
      }
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
  const isValidEmail = (email) => {
    // Expression régulière pour valider une adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(!isValidEmail(newEmail));
  };

  return (
    <div className="signup-container">
      <Link to="/" className="back-button">
        <FaArrowLeft />
      </Link>
      <div className="spacer" />

      <form className="signup-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        {success && <p className="success-message">{success}</p>}
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
              className={error && !name ? "error-border" : ""}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`${
                (error && !email) || emailError ? "error-border" : ""
              }`}
            />
            {emailError && (
              <p className="error-message">
                Veuillez entrer une adresse e-mail valide.
              </p>
            )}
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
                className={error && !password ? "error-border" : ""}
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
            <label>Confirmer Mot de Passe</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={error && !confirmPassword ? "error-border" : ""}
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={error && !address ? "error-border" : ""}
            />
          </div>
          <div className="form-group">
            <label>Pays</label>
            <Select
              value={selectedCountry}
              onChange={handleCountryChange}
              options={countryOptions}
              onMenuOpen={handleCountryOpen}
              className={error && !selectedCountry ? "error-border" : ""}
            />
          </div>
          <div className="form-group">
            <label>Numéro de Téléphone</label>
            <input
              type="text"
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={error && !phonenumber ? "error-border" : ""}
            />
          </div>
          <div className="form-group">
            <label>Code Postal</label>
            <input
              type="text"
              value={codepostale}
              onChange={(e) => setCodePostale(e.target.value)}
              className={error && !codepostale ? "error-border" : ""}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="matriculeFiscaleCheckbox"
              className="checkbox-input"
              checked={isMatriculeFiscaleOptional}
              onChange={() =>
                setIsMatriculeFiscaleOptional(!isMatriculeFiscaleOptional)
              }
            />
            <label
              htmlFor="matriculeFiscaleCheckbox"
              className="checkbox-label"
            >
              Matricule Fiscale
            </label>
          </div>
          <div className="form-group">
            <label>Matricule Fiscale</label>
            <input
              type="text"
              value={matriculeFiscale}
              onChange={(e) => setMatriculeFiscale(e.target.value)}
              disabled={!isMatriculeFiscaleOptional}
            />
          </div>
        </div>
        {isButtonVisible && (
          <div className="center-button">
            <button type="submit" className="submit-button" disabled={loading}>
              S&apos;inscrire
              {loading && (
                <div className="loading-container">
                  <FaSpinner className="loading-icon" />
                  <p>Chargement en cours...</p>
                </div>
              )}
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
      <div className="spacer" />
    </div>
  );
};

export default Signup;
