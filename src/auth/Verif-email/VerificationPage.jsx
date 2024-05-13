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
  const [form] = Form.useForm();

  // Extraction de l'email de l'URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userEmail = searchParams.get("email");
    if (userEmail) {
      setEmail(userEmail);
    } else {
      // Redirection vers la page d'inscription si l'email n'est pas fourni
      navigate("/register");
    }
  }, [location, navigate]);

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
        navigate("/login");
      } else {
        message.error(
          "Le code de vérification est incorrect. Veuillez réessayer."
        );
      }
    } catch (error) {
      message.error("Une erreur s'est produite. Veuillez réessayer.");
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
        <p>
          Veuillez entrer le code de vérification envoyé à{" "}
          <span className="email-text">{email}</span>
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
              style={{ height: 40 }}
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
      </div>
      <div className="spacer" />
    </div>
  );
};

export default VerificationPage;
