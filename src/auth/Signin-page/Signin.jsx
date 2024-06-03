import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Modal } from "antd";

import { FaArrowLeft } from "react-icons/fa";

import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import "./signin.css";
import "./mediasigin.css";
import signinImage from "../../assets/images/pm.jpg";
import appLogo from "../../assets/images/vbil2.png";

const { Title, Text } = Typography;

const CustomSignin = () => {
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const showSuccessModal = (userName) => {
    Modal.success({
      title: "Connexion réussie !",
      content: `Bienvenue, ${userName} !`,

      style: {
        color: "#52c41a", // Couleur du texte
      },
    });

    // Fermer le modal après 3 secondes
    setTimeout(() => {
      Modal.destroyAll(); // Ferme tous les modaux
    }, 2000);
  };

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message || "Erreur lors de la connexion");
        setLoading(false);
        return;
      }

      if (!data.token || !data.user) {
        console.error("Champs manquants dans la réponse :", data);
        message.error("Erreur lors de la connexion");
        setLoading(false);
        return;
      }

      console.log("Utilisateur connecté :", data.user);
      console.log("Token d'authentification :", data.token);

      // Stocker le token dans le sessionStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("UserEmail", data.user.email);
      localStorage.setItem("Username", data.user.name);
      localStorage.setItem("role", data.user.roles);
      localStorage.setItem("id", data.user._id);

      const currentTime = Date.now();
      const expireTime = currentTime + 3 * 60 * 60 * 1000;
      localStorage.setItem("expireTime", expireTime);

      showSuccessModal(data.user.name);

      switch (data.user.roles[0]) {
        case "admin":
          history("/dashboard");
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

      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      message.error("Erreur lors de la connexion");
      setLoading(false);
    }
  };

  return (
    <div className="custom-signin-container">
      <Link to="/" className="custom-home-button">
        <FaArrowLeft />
      </Link>

      <div className="custom-signin-content">
        <div className="custom-form-container">
          <div className="logo-titlee-container">
            <img
              src={appLogo}
              alt="Logo de l'application"
              className="app-logo1"
            />
            <Title level={2} className="custom-title1">
              <span className="visto">V</span>
              <span className="fact">Bill</span>
            </Title>
          </div>
          <div className="subtitle-container">
            <Text className="custom-subtitle">
              Connectez-vous à votre compte
            </Text>
          </div>{" "}
          <Form
            name="custom-signin"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            size="large"
            className="custom-form"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Veuillez entrer votre email" },
                { type: "email", message: "Adresse e-mail invalide" },
              ]}
              className="custom-form-item"
              hasFeedback
            >
              <Input
                prefix={
                  <UserOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: 10 }}
                  />
                } // Ajouter un espace à droite de l'icône
                placeholder="Adresse e-mail"
                style={{
                  border: "none", // Retirer toutes les bordures
                  borderRadius: 0, // Retirer le rayon de bordure
                  borderBottom: "2px solid #D1D1D4", // Ajouter uniquement la bordure du bas par défaut
                  padding: "10px 0", // Ajuster le padding
                  fontSize: 16, // Réduire légèrement la taille de la police
                  width: "340px", // Augmenter la largeur du champ
                  marginBottom: 5,
                }}
                onFocus={(e) => {
                  e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                  e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                  e.target.style.borderBottomColor = "#0a579f"; // Changer la couleur de la bordure du bas en cas de focus
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer votre mot de passe",
                },
                {
                  min: 8,
                  message: "Le mot de passe doit faire au moins 8 caractères",
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
                },
              ]}
              className="custom-form-item"
            >
              <Input.Password
                prefix={
                  <LockOutlined
                    className="site-form-item-icon"
                    style={{ marginRight: 10 }}
                  />
                }
                placeholder=" Mot de passe"
                style={{
                  border: "none", // Retirer toutes les bordures
                  borderRadius: 0, // Retirer le rayon de bordure
                  borderBottom: "2px solid #D1D1D4", // Ajouter uniquement la bordure du bas par défaut
                  padding: "10px 0", // Ajuster le padding
                  fontSize: 16, // Réduire légèrement la taille de la police
                  width: "340px", // Augmenter la largeur du champ
                  marginBottom: 0,
                }}
                onFocus={(e) => {
                  e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                  e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                }}
              />
            </Form.Item>
            <div className="custom-forgot-password-container">
              <Link to="/reset-password" className="custom-forgot-password">
                Mot de passe oublié ?
              </Link>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={`custom-submit-butto ${loading ? "loading" : ""}`}
                loading={loading}
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
                Connexion
              </Button>
            </Form.Item>

            <div className="custom-mt-3">
              <span className="custom-signup-text">
                Pas encore de compte?{" "}
                <Link to="/register" className="custom-signup-link">
                  Inscrivez-vous ici
                </Link>
              </span>
            </div>
          </Form>
        </div>
        <div className="custom-image-container">
          <img
            src={signinImage}
            alt="Image de connexion"
            className="custom-signin-image"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomSignin;
