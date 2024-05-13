import React, { useState, useEffect, useRef } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { Form, Input, Button, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserOutlined } from "@ant-design/icons";

import emailImage from "../../assets/images/reee.jpg";
import codeImage from "../../assets/images/vr4.jpg";
import successImage from "../../assets/images/vrm.jpg";
import "./ResetPasswordComponent.css";

const { Title, Paragraph } = Typography;

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [canResendCode, setCanResendCode] = useState(true); // Défaut: peut renvoyer le code
  const [resendTimer, setResendTimer] = useState(60); // Initialiser le timer à 60 secondes
  const history = useNavigate();

  const codeInputsRef = useRef([]);

  useEffect(() => {
    let intervalId;

    if (resendTimer > 0 && !canResendCode) {
      intervalId = setInterval(() => {
        setResendTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            setCanResendCode(true);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [resendTimer, canResendCode]);
  const handleCodeKeyDown = (index, event) => {
    const key = event.key;

    if (key === "Backspace" && index > 0) {
      event.preventDefault();
      const newCode = [...code];
      newCode[index] = ""; // Effacer le contenu du champ
      setCode(newCode);
      codeInputsRef.current[index - 1].focus(); // Déplacer le focus vers le champ précédent
    } else if (key === "Delete" && index < code.length - 1) {
      event.preventDefault();
      const newCode = [...code];
      newCode[index] = ""; // Effacer le contenu du champ
      setCode(newCode);
      codeInputsRef.current[index + 1].focus(); // Déplacer le focus vers le champ suivant
    } else if (key.match(/[0-9]/)) {
      // Gérer l'entrée de chiffres
      const newCode = [...code];
      newCode[index] = key;
      setCode(newCode);
      // Déplacer le focus vers le champ suivant s'il existe
      if (index < code.length - 1) {
        codeInputsRef.current[index + 1].focus();
      }
    } else if (key === "ArrowLeft" && index > 0) {
      // Gérer le déplacement vers la gauche
      event.preventDefault(); // Empêcher le déplacement du curseur du navigateur
      codeInputsRef.current[index - 1].focus();
    } else if (key === "ArrowRight" && index < code.length - 1) {
      // Gérer le déplacement vers la droite
      event.preventDefault(); // Empêcher le déplacement du curseur du navigateur
      codeInputsRef.current[index + 1].focus();
    }
  };

  const handleInputChange = (index, value) => {
    // Vérifier si la valeur entrée est un seul chiffre ou une chaîne vide
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError(""); // Réinitialiser l'erreur lorsqu'un champ est modifié
    }
  };

  const sendResetEmail = async () => {
    try {
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
        setStep(2);
        setCanResendCode(false);
        setResendTimer(60);
        message.success("Email de réinitialisation envoyé avec succès");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error.message || "Quelque chose s'est mal passé.");
      setError(error.message || "Quelque chose s'est mal passé.");

      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/resend-password-reset-code",
        { email }
      );
      message.success("Nouveau code envoyé avec succès");
      setCanResendCode(false);
      setResendTimer(60);
      setCode(Array(code.length).fill(""));
    } catch (error) {
      console.error(error.message || "Quelque chose s'est mal passé.");
      setError(error.message || "Quelque chose s'est mal passé.");
      setTimeout(() => {
        setError(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };
  const verifyCode = async () => {
    try {
      setLoading(true);
      const fullCode = code.join("");
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-reset-code",
        { email, code: fullCode }
      );

      if (response.data.success) {
        setError(null);
        setStep(3);
        message.success("Code envoyé avec succès");
      } else {
        setError(response.data.message);
        setTimeout(() => {
          setError(null);
        }, 3000); // Supprimer le message d'erreur après 3 secondes
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Quelque chose s'est mal passé.";
      setError(errorMessage);
      setTimeout(() => {
        setError(null);
      }, 3000); // Supprimer le message d'erreur après 3 secondes
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword }
      );

      if (
        response.data.message === "Réinitialisation du mot de passe réussie"
      ) {
        setError(null);
        message.success("Réinitialisation du mot de passe réussie");
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

  return (
    <div className="reset-password-page">
      <div className={`reset-pass step-${step}`}>
        <div className="image-container">
          {step === 1 && (
            <img
              src={emailImage}
              alt="Reset Password"
              className="reset-image"
            />
          )}
          {step === 2 && (
            <img
              src={codeImage}
              alt="Verification Code"
              className="reset-image"
            />
          )}
          {step === 3 && (
            <img src={successImage} alt="Success" className="reset-image" />
          )}
        </div>
        <div className="reset-form-container">
          {step === 1 && (
            <Title className="forgot-password-title">
              Mot <span>de</span> passe <span>oublié ?</span>
            </Title>
          )}

          {step === 1 && (
            <>
              {error && (
                <Paragraph className="error-message">{error}</Paragraph>
              )}
              <Form onFinish={sendResetEmail} className="reset-form">
                <Paragraph className="reset-info">
                  Entrez votre adresse e-mail pour recevoir un lien de
                  réinitialisation.
                </Paragraph>
                <Form.Item
                  name="email"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer votre email",
                    },
                    {
                      type: "email",
                      message: "Veuillez entrer un email valide",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined
                        className="site-form-item-icon"
                        style={{ marginRight: 10 }}
                      />
                    }
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #D1D1D4", // Ajouter uniquement la bordure du bas par défaut
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 20, // Réduire légèrement la taille de la police
                      width: "420px", // Augmenter la largeur du champ
                      marginBottom: 15,
                      marginLeft: -38,
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                      e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                      e.target.style.borderBottomColor = "#0a579f"; // Changer la couleur de la bordure du bas en cas de focus
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="reset-button"
                    style={{
                      background: "linear-gradient(to right, #0f12a4, #121477)",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      borderRadius: "4px",
                      width: "100%",
                      fontSize: "16px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      fontFamily: "Poppins",
                    }}
                  >
                    {loading
                      ? "Envoi en cours..."
                      : "Envoyer l'e-mail de réinitialisation"}
                  </Button>
                </Form.Item>
                <div className="custom-mt-2">
                  <span className="custom-reset-text">
                    Se souvenir du mot de passe ?{" "}
                    <Link to="/login" className="custom-reset-link">
                      Connectez-vous ici
                    </Link>
                  </span>
                </div>
              </Form>
            </>
          )}

          {step === 2 && (
            <>
              <Form onFinish={verifyCode} className="reset-form">
                <Form.Item
                  style={{ marginLeft: 10 }}
                  className="verification-code"
                >
                  <span
                    style={{
                      color: "#333",
                      fontWeight: "bold",
                      fontSize: "18px",
                      fontFamily: "Poppins",
                      marginBottom: "30px", // Ajouter une marge inférieure pour séparer le label des champs d'entrée
                    }}
                  >
                    Entrez le code de vérification
                  </span>
                  <Paragraph className="verification-info">
                    Un code de vérification a été envoyé à votre adresse e-mail.
                    Temps restant :
                    <span className="resend-timer">
                      {" "}
                      {resendTimer} secondes.
                    </span>
                  </Paragraph>
                  <div className="verification-input-container">
                    {code.map((value, index) => (
                      <Input
                        key={index}
                        value={value}
                        maxLength={1}
                        className="verification-input"
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        ref={(inputRef) =>
                          (codeInputsRef.current[index] = inputRef)
                        }
                        required // Ajoutez simplement cet attribut pour le rendre obligatoire
                      />
                    ))}
                  </div>
                </Form.Item>

                <Form.Item style={{ marginLeft: 13 }}>
                  <Button
                    className="verif-b"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    style={{
                      width: "180px",
                      height: "40px",
                      borderRadius: "3px",
                      backgroundColor: "#74787e",
                      color: "white",
                      border: "none",
                      fontSize: "17px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      padding: "10px",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {loading ? "Vérification en cours..." : "Vérifier le Code"}
                  </Button>
                </Form.Item>

                {canResendCode && (
                  <span
                    className="resend-code-button"
                    onClick={resendVerificationCode}
                    disabled={!canResendCode || loading} // Désactiver le bouton lors du chargement
                  >
                    Renvoyer le Code de vérification
                  </span>
                )}

                {!canResendCode && (
                  <Paragraph className="resend-code-message">
                    Vous devez attendre la fin du délai pour renvoyer le code.
                  </Paragraph>
                )}

                {error && <div className="error-message">{error}</div>}
              </Form>
            </>
          )}
          {step === 3 && (
            <>
              <Paragraph className="reset-message">
                Le code est valide. Vous pouvez maintenant réinitialiser votre
                mot de passe.
              </Paragraph>
              <Form onFinish={resetPassword} className="reset-form">
                <Form.Item
                  name="newPassword"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer un nouveau mot de passe",
                    },
                    {
                      min: 8,
                      message:
                        "Le mot de passe doit faire au moins 8 caractères",
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
                    },
                  ]}
                >
                  <Input.Password
                    placeholder="Entrez votre nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    iconRender={(visible) =>
                      visible ? (
                        <RiEyeFill style={{ color: "#b4b5b9" }} />
                      ) : (
                        <RiEyeOffFill style={{ color: "#b4b5b9" }} />
                      )
                    }
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #a6a6aa", // Ajouter uniquement la bordure du bas par défaut
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 18, // Réduire légèrement la taille de la police
                      width: "370px", // Augmenter la largeur du champ
                      marginBottom: 0,
                      marginLeft: 15,
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                      e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="confirmNewPassword"
                  className="form-item"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez confirmer votre nouveau mot de passe",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "Les mots de passe ne correspondent pas"
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirmez votre nouveau mot de passe"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    iconRender={(visible) =>
                      visible ? (
                        <RiEyeFill style={{ color: "#b4b5b9" }} />
                      ) : (
                        <RiEyeOffFill style={{ color: "#b4b5b9" }} />
                      )
                    }
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #a6a6aa", // Ajouter uniquement la bordure du bas par défaut
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 18, // Réduire légèrement la taille de la police
                      width: "370px", // Augmenter la largeur du champ
                      marginBottom: 20,
                      marginLeft: 15,
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                      e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    className="reset-buttonp"
                    style={{
                      width: "280px",
                      height: "40px",
                      borderRadius: "3px",
                      backgroundColor: "#74787e",
                      color: "white",
                      border: "none",
                      fontSize: "17px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      padding: "10px",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      marginLeft: 70,
                    }}
                  >
                    {loading
                      ? "Réinitialisation en cours..."
                      : "Réinitialiser le Mot de Passe"}
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
