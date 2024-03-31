import React, { useState } from "react";
import { Card, Form, Input, message, Row, Col } from "antd";
import { useParams, useNavigate } from "react-router-dom";

function SetPassword() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { token } = useParams();
  const history = useNavigate();

  const handleResetPasswordSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/set-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: values.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      message.success("Mot de passe réinitialisé avec succès");
      setTimeout(() => {
        history("/login"); // Redirection vers la page de connexion
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        error.message ||
          "Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer."
      );
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
  };

  const customButtonStyle = {
    background: "linear-gradient(to right, #f39c12, #e74c3c)",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    width: "100%",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontFamily: '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
    fontWeight: "bold",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily:
          '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
      }}
    >
      <Card
        title={
          <span
            style={{
              color: "rgb(223, 107, 6)",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            Réinitialisation du mot de passe
          </span>
        }
        style={{
          maxWidth: "550px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(182, 105, 3, 0.1)",
        }}
      >
        <Form onFinish={handleResetPasswordSubmit}>
          <Row gutter={[16, 16]} style={{ display: "flex", flexWrap: "wrap" }}>
            <Col span={24}>
              <p
                style={{
                  marginBottom: "16px",
                  fontSize: "20px",
                  color: "#333",
                }}
              >
                Veuillez saisir votre nouveau mot de passe :
              </p>
            </Col>
            <Col span={24}>
              <Form.Item
                name="newPassword"
                label="Nouveau mot de passe"
                labelCol={{ span: 24 }}
                style={{ marginBottom: "16px" }} // Ajouter de l'espace en bas
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer votre nouveau mot de passe!",
                  },
                ]}
                hasFeedback
              >
                <span style={{ marginRight: "8px" }}>
                  <Input.Password onChange={handlePasswordChange} />
                </span>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="confirmPassword"
                label="Confirmer le mot de passe"
                labelCol={{ span: 24 }}
                style={{ marginBottom: "16px", width: "100%" }} // Ajouter la largeur complète au label
                dependencies={["newPassword"]}
                hasFeedback
                validateStatus={passwordError ? "error" : ""}
                help={passwordError}
                rules={[
                  {
                    required: true,
                    message: "Veuillez confirmer votre nouveau mot de passe!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Les mots de passe ne correspondent pas!")
                      );
                    },
                  }),
                ]}
              >
                <span style={{ marginRight: "15px" }}>
                  <Input.Password />
                </span>
              </Form.Item>
            </Col>
          </Row>
          {errorMessage && (
            <p style={{ color: "red", marginTop: "16px" }}>{errorMessage}</p>
          )}
          <Row justify="center">
            <Col>
              <Form.Item>
                <button
                  type="submit"
                  style={customButtonStyle}
                  disabled={loading}
                >
                  {loading ? "Chargement..." : "Réinitialiser le mot de passe"}
                </button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default SetPassword;
