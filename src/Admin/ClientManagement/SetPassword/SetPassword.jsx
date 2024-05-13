import React, { useState } from "react";
import { Card, Form, Input, message, Row, Col } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import successImage from "../../../assets/images/vrm.jpg";
import "./SetPassword.css"; // Importation du fichier CSS

function SetPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState(""); // Nouvel état pour le mot de passe
  const [confirmNewPassword, setConfirmNewPassword] = useState(""); // Nouvel état pour la confirmation du mot de passe
  const [passwordError, setPasswordError] = useState("");
  const { token } = useParams();
  const history = useNavigate();

  const handleResetPasswordSubmit = async () => {
    setLoading(true);

    try {
      if (newPassword !== confirmNewPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      const response = await fetch(
        `http://localhost:5000/api/users/set-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      } else {
        message.success("Mot de passe réinitialisé avec succès");
        setTimeout(() => {
          history("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.message ||
          "Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer."
      );
      setTimeout(() => {
        history("/login");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordError(
      passwordRegex.test(value)
        ? ""
        : "Le mot de passe doit faire au moins 8 caractères, contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
    );
    setNewPassword(value); // Mettre à jour le nouvel état du mot de passe
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmNewPassword(value); // Mettre à jour le nouvel état de la confirmation du mot de passe

    // Vérifier si les mots de passe correspondent et mettre à jour l'état de l'erreur
    setPasswordError(
      newPassword !== value ? "Les mots de passe ne correspondent pas" : ""
    );
  };

  const customButtonStyle = {
    background: "linear-gradient(to right, #0f12a4, #121477)",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "4px",
    width: "82%",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontFamily: "Poppins",

    marginLeft: "58px",
  };

  return (
    <div className="container">
      <Card className="card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} className="col-left">
            <div className="image-container">
              <img src={successImage} alt="New Password" className="image" />
            </div>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form onFinish={handleResetPasswordSubmit}>
              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <p className="form-title">
                Veuillez saisir votre nouveau mot de passe :
              </p>
              <Form.Item
                name="newPassword"
                className="form-item"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre nouveau mot de passe!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  onChange={handlePasswordChange}
                  placeholder="Nouveau mot de passe"
                  className="input-field"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                className="form-item"
                dependencies={["newPassword"]}
                hasFeedback
                validateStatus={passwordError ? "error" : ""}
                help={passwordError}
                rules={[
                  {
                    required: true,
                    message: "Veuillez confirmer votre nouveau mot de passe",
                  },
                ]}
              >
                <Input.Password
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirmer le mot de passe"
                  className="input-field"
                />
              </Form.Item>

              <Form.Item>
                <button
                  type="submit"
                  style={customButtonStyle}
                  disabled={loading}
                >
                  {loading ? "Chargement..." : "Réinitialiser le mot de passe"}
                </button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default SetPassword;
