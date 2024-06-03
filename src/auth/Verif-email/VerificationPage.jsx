import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import "./verification.css";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // Nouvel état pour le temps restant
  const [canResendCode, setCanResendCode] = useState(false); // Nouvel état pour gérer la possibilité de renvoyer le code
  const [error, setError] = useState(""); // Nouvel état pour stocker le message d'erreur
  const [form] = Form.useForm();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userEmail = searchParams.get("email");
    if (userEmail) {
      setEmail(userEmail);
    } else {
      navigate("/register");
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingTime]);

  useEffect(() => {
    setRemainingTime(60); // Initialiser le temps restant à 60 secondes au chargement de l'interface
    setTimeout(() => setCanResendCode(true), 60000); // Activer le bouton de renvoi après 1 minute
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        {
          email,
          verificationCode: values.verificationCode,
        }
      );

      if (response.data.success) {
        message.success("La vérification est réussie.");
        navigate("/login"); // Rediriger vers la page de connexion après succès
      } else {
        setError(response.data.message); // Afficher le message d'erreur renvoyé par le backend
      }
    } catch (error) {
      if (error.response) {
        // Erreur de réponse du serveur
        setError(error.response.data.message); // Afficher le message d'erreur renvoyé par le backend
      } else {
        // Erreur autre (ex: problème de connexion)
        message.error("Une erreur s'est produite. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/resend-verification-code",
        { email }
      );
      message.success("Le code de vérification a été renvoyé avec succès.");
      setRemainingTime(60); // Réinitialiser le temps restant à 60 secondes
      setCanResendCode(false); // Désactiver la possibilité de renvoyer le code
      setTimeout(() => setCanResendCode(true), 60000); // Réactiver après 1 minute
    } catch (error) {
      message.error(
        "Une erreur s'est produite lors de l'envoi du code de vérification."
      );
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
        <h2
          style={{
            color: "#30159f",
            fontWeight: "bold",
            fontFamily: "popines",
          }}
        >
          Vérification d&apos;email
        </h2>

        <p>
          Veuillez entrer le code de vérification envoyé à{" "}
          <span className="email-text">{email}</span>
          <br />
          {remainingTime > 0 && (
            <div
              style={{
                padding: "8px",
                borderRadius: "4px",
                display: "inline-block",
                marginTop: 10,
              }}
            >
              <span
                style={{
                  color: "#212122",
                  fontSize: "16px",
                  marginRight: "8px",
                  fontWeight: "bold",
                }}
              >
                Prochain envoi possible dans :
              </span>
              <span
                style={{
                  color: "#d74616",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {remainingTime} secondes
              </span>
            </div>
          )}
        </p>

        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ verificationCode: "" }}
        >
          <Form.Item
            name="verificationCode"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le code de vérification",
              },
              {
                len: 6,
                message: "Le code de vérification doit contenir 6 chiffres",
              },
            ]}
          >
            <Input
              placeholder="Code de vérification"
              autoComplete="off"
              maxLength={6}
              style={{ height: 50 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                background: "linear-gradient(to right, #0f12a4, #121477)",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "4px",
                width: "100%",
                height: 40,
                fontSize: "16px",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s",
                fontFamily: "Poppins",
              }}
            >
              Vérifier le Code
            </Button>
          </Form.Item>
        </Form>

        {/* Affichage du message d'erreur */}
        {error && <div className="error-message">{error}</div>}

        {/* Bouton de renvoi du code de vérification */}
        {remainingTime <= 0 && canResendCode && (
          <Button
            type="link"
            onClick={handleResendVerification}
            style={{
              color: "#262627",
              fontSize: "16px",
              textDecoration: "underline",
              padding: "0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Renvoyer le code de vérification
          </Button>
        )}
      </div>
      <div className="spacer" />
    </div>
  );
};

export default VerificationPage;
