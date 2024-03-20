// VerificationPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./verification.css";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userEmail = searchParams.get("email");
    if (userEmail) {
      setEmail(userEmail);
    } else {
      // Rediriger vers la page d'inscription si l'email n'est pas fourni
      navigate("/register");
    }
  }, [location, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      if (timeRemaining === 0) {
        setError(
          "Le temps pour la vérification est écoulé. Redirection vers la page d'inscription."
        );
        setTimeout(() => {
          navigate("/register");
        }, 3000);
      }
    };
  }, [timeRemaining, navigate]);

  const handleVerification = async () => {
    try {
      setLoading(true);
      if (!email) {
        setError("Veuillez fournir une adresse e-mail.");
        return;
      }

      // Validation du champ code
      if (!code) {
        setError("Veuillez entrer le code de vérification.");
        return;
      }

      if (!/^\d{6}$/.test(code)) {
        setError("Le code doit contenir 6 chiffres.");
        return;
      }
      if (timeRemaining === 0) {
        setError(
          "Le temps pour la vérification est écoulé. Veuillez réessayer."
        );
        navigate("/register");
        return;
      }

      // Faites votre appel API pour la vérification
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        {
          email,
          verificationCode: code,
        }
      );

      // Si la vérification est réussie, redirigez l'utilisateur vers la page de connexion
      if (response.data.success) {
        navigate("/login");
      } else {
        // Gérez l'erreur de vérification
        setError(
          response.data.message ||
            "Code de vérification incorrect. Veuillez réessayer."
        );
        setTimeout(() => {
          navigate("/register");
        }, 3000);
      }
    } catch (error) {
      // Gérez les erreurs d'API ou autres erreurs ici
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <Link to="/register" className="back-button">
        <FaArrowLeft />
      </Link>
      <div className="spacer" />
      <div className="form-container">
        <h2>Vérification d&apos;Email</h2>

        {error && <p className="error-message">{error}</p>}

        <p>
          Veuillez entrer le code de vérification envoyé à {email} Temps restant
          :{" "}
          <span className="time-span">
            {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, "0")}
          </span>
        </p>
        <div className="form-group">
          <label htmlFor="verificationCode" className="form-label">
            Code de Vérification:
          </label>
          <input
            type="text"
            id="verificationCode"
            className="form-input"
            placeholder="Entrez le code de vérification"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleVerification}
          className="submit-button"
          disabled={loading || timeRemaining === 0}
        >
          {loading ? "Vérification en cours..." : "Vérifier le Code"}
        </button>
      </div>
      <div className="spacer" />
    </div>
  );
};

export default VerificationPage;
