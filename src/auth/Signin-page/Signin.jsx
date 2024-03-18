import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signin.css";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
//import Cookies from "js-cookie";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requiredFieldsError, setRequiredFieldsError] = useState("");
  const [loginError, setLoginError] = useState("");
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!email || !password) {
      setRequiredFieldsError("Veuillez remplir tous les champs");
      return;
    } else {
      setRequiredFieldsError("");
    }

    if (!email.includes("@")) {
      setEmailError("Adresse e-mail invalide");
      return;
    } else {
      setEmailError("");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      setPasswordError(
        "Le mot de passe doit faire au moins 8 caractères, contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setLoginError(data.message || "Erreur lors de la connexion");
        return;
      }

      const data = await response.json();

      if (!data.token || !data.user) {
        console.error("Champs manquants dans la réponse :", data);
        setLoginError("Erreur lors de la connexion");
        return;
      }

      console.log("Utilisateur connecté :", data.user);
      console.log("Token d'authentification :", data.token);

      // Enregistrez le token dans les cookies
      document.cookie = `AuthenticationToken=${data.token}; path=/`;

      // Utilisez history.push correctement
      switch (data.user.roles[0]) {
        case "admin":
          history("/dashboard-admin");
          break;
        case "client":
          history("/dashboard-client");
          break;
        case "financier":
          history("/dashboard-financier");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setLoginError("Erreur lors de la connexion");
    }
  };

  return (
    <div className="signin-container">
      <Link to="/" className="back-button">
        <FaArrowLeft />
      </Link>

      <div className="form-container">
        <h2>
          Bienvenue sur <span className="visto">Visto</span>
          <span className="fact">Fact</span>
        </h2>

        <form onSubmit={handleSubmit}>
          {requiredFieldsError && (
            <p className="error-message">{requiredFieldsError}</p>
          )}
          {loginError && <p className="error-message">{loginError}</p>}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-input ${emailError && "error-border"}`}
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de Passe
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-input ${passwordError && "error-border"}`}
                placeholder="Entrez votre mot de passe"
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
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
          <div className="mt-3">
            <p>
              <Link to="/reset-password" className="forgot-password-link">
                Mot de passe oublié? Réinitialisez-le ici
              </Link>
            </p>
          </div>
          <div className="center-button">
            <button type="submit" className="submit-button">
              Connexion
            </button>
          </div>
        </form>
        <div className="mt-3">
          <p>
            Vous n&apos;avez pas de compte?{" "}
            <Link to="/register" className="signup-link">
              Inscrivez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
