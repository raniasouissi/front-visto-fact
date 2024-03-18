// Importez les composants nécessaires
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPasswordComponent.css";
import { FaArrowLeft } from "react-icons/fa";

const ResetPasswordComponent = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [timeLeft, setTimeLeft] = useState(59);
  const [codeExpired, setCodeExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (countdown && timeLeft === 0) {
      setCodeExpired(true);
      clearInterval(countdown);
    }
  }, [countdown, timeLeft]);

  const updateCode = (newValue, index) => {
    const newCode = [...code];
    newCode[index] = newValue;
    return newCode;
  };

  const handleInputChange = (event, setState, setErrorState) => {
    const value = event.target.value;
    setState(value);
    setErrorState("");

    if (setState === setEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        emailRegex.test(value)
          ? ""
          : "Veuillez entrer une adresse e-mail valide."
      );
    }

    if (setState === setCode) {
      setCodeError(
        value.length === 6 && /^\d+$/.test(value)
          ? ""
          : "Veuillez entrer un code à 6 chiffres."
      );
    }

    if (setState === setNewPassword) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setPasswordError(
        passwordRegex.test(value)
          ? ""
          : "Le mot de passe doit faire au moins 8 caractères, contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
    }

    if (setState === setConfirmNewPassword) {
      setPasswordError(
        value === newPassword ? "" : "Les mots de passe ne correspondent pas."
      );
    }
  };

  const sendResetEmail = async () => {
    try {
      if (!email || emailError) {
        setEmailError("Veuillez entrer une adresse e-mail valide.");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/send-password-reset-email",
        { email }
      );

      if (
        response.data.message ===
        "Email de réinitialisation du mot de passe envoyé avec succès"
      ) {
        setError(null);
        setEmailError("");
        setStep(2);
        startCountdown();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      if (code.some((value) => value.length !== 1) || codeError) {
        setCodeError("Veuillez entrer un code à 6 chiffres.");
        return;
      }

      setLoading(true);

      const fullCode = code.join("");
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-reset-code",
        { email, code: fullCode }
      );

      if (response.data.success) {
        setError(null);
        setCodeError("");
        setStep(3);
        resetCountdown();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);

      if (passwordError || !newPassword || !confirmNewPassword) {
        setPasswordError("Veuillez corriger les erreurs dans le formulaire.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword }
      );

      if (
        response.data.message === "Réinitialisation du mot de passe réussie"
      ) {
        setError(null);
        setPasswordError("");
        history("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    resetCountdown();
    const newCountdown = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    setCountdown(newCountdown);
  };

  const stopCountdown = () => {
    clearInterval(countdown);
  };

  const resetCountdown = () => {
    setTimeLeft(59);
    setCodeExpired(false);
  };

  const goToStep1 = () => {
    stopCountdown();
    setStep(1);
  };

  // Ajoutez cette fonction pour gérer le passage au champ suivant
  const handleCodeKeyDown = (index, event) => {
    if (event.key === "Enter" && index < codeRefs.length - 1) {
      event.preventDefault();
      codeRefs[index + 1].current.focus();
    }
  };

  // Ajoutez cette référence pour les champs de code
  const codeRefs = Array.from({ length: 6 }, () => useRef(null));

  return (
    <div className="reset-password-container">
      <Link to="/" className="back-button">
        <FaArrowLeft />
      </Link>
      <div className="spacer" />
      <div className="form-container">
        <h2>Réinitialisation du Mot de Passe</h2>

        {error && <p className="error-message">{error}</p>}

        {step === 1 && (
          <form>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${emailError && "error-border"}`}
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail, setEmailError)}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <button
              type="button"
              onClick={sendResetEmail}
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Envoi en cours..."
                : "Envoyer l'e-mail de réinitialisation"}
            </button>
          </form>
        )}

        {step === 2 && (
          <>
            <hr />
            <p>
              Merci de vérifier dans vos e-mails que vous avez reçu un message
              avec votre code. Celui-ci est composé de 6 chiffres.{" "}
              <span className="time-left">
                Temps restant : {timeLeft} secondes.
              </span>
            </p>
            <form>
              <div className="form-group">
                <label htmlFor="code" className="form-label">
                  Code de Vérification:
                </label>
                <div className="code-input-container">
                  {code.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          (val) => setCode(updateCode(val, index)),
                          setCodeError
                        )
                      }
                      maxLength="1"
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      ref={codeRefs[index]}
                    />
                  ))}
                </div>
                {codeError && <p className="error-message">{codeError}</p>}
              </div>
              <button
                type="button"
                onClick={verifyCode}
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Vérification en cours..." : "Vérifier le Code"}
              </button>
              {codeExpired && (
                <div className="code-expired-message">
                  <p>Le code a expiré.</p>
                  <button type="button" onClick={goToStep1}>
                    Retourner à l&apos;étape de vérification
                  </button>
                </div>
              )}
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <hr />
            <p>
              Le code est valide. Vous pouvez maintenant réinitialiser votre mot
              de passe.
            </p>
            <form>
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                  Nouveau Mot de Passe:
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    className={`form-input ${passwordError && "error-border"}`}
                    placeholder="Entrez votre nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) =>
                      handleInputChange(e, setNewPassword, setPasswordError)
                    }
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
                <label htmlFor="confirmNewPassword" className="form-label">
                  Confirmer le Nouveau Mot de Passe:
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmNewPassword"
                    className={`form-input ${passwordError && "error-border"}`}
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={confirmNewPassword}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setConfirmNewPassword,
                        setPasswordError
                      )
                    }
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {passwordError && (
                  <p className="error-message">{passwordError}</p>
                )}
              </div>
              <button
                type="button"
                onClick={resetPassword}
                disabled={
                  !!passwordError || !newPassword || !confirmNewPassword
                }
                className="submit-button"
              >
                {loading
                  ? "Réinitialisation en cours..."
                  : "Réinitialiser le Mot de Passe"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
