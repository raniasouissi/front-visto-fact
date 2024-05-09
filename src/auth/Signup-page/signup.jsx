import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  LockOutlined,
  UserOutlined,
  MailOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Button, Input, Form, Checkbox, message, Row, Col } from "antd";
//Importez les composants CountryDropdown et RegionDropdown
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import "./signup.css";
import PropTypes from "prop-types"; // Importer PropTypes depuis react

import ReactSelect, { components } from "react-select";
import countryList from "react-select-country-list";

const CountryOption = (props) => {
  return (
    <components.Option {...props}>
      <img
        alt={`Flag of ${props.data.label}`}
        src={`https://flagcdn.com/16x12/${props.data.value.toLowerCase()}.png`}
        style={{ marginRight: 10, float: "left" }}
      />
      {props.data.label}
    </components.Option>
  );
};

// Options de la liste déroulante des pays
const countryOptions = countryList().getData();

const Signup = () => {
  const history = useNavigate();

  const [isMatriculeFiscaleOptional, setIsMatriculeFiscaleOptional] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [phonenumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Mise à jour de la valeur du pays lors de la sélection dans la liste déroulante
  const handleCountryChange = (value) => {
    setSelectedCountry(value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [error, success]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formattedPhoneNumber = `+${countryCode} ${phonenumber}`;

      // Vérifier si le code de pays est répété dans le numéro de téléphone
      const phoneNumberWithoutRepeatedCountryCode =
        formattedPhoneNumber.replace(new RegExp(`\\+${countryCode} `), "+");

      // Ajouter un espace entre le code de pays et le numéro
      const phoneNumberWithSpace =
        phoneNumberWithoutRepeatedCountryCode.replace(
          `+${countryCode}`,
          `+${countryCode} `
        );

      // Mettre à jour la valeur du numéro de téléphone dans les valeurs
      values.phonenumber = phoneNumberWithSpace;
      const countryValue = selectedCountry ? selectedCountry.label : "";

      const requestBody = {
        ...values,
        roles: ["client"],
        pays: countryValue, // Inclure la valeur du pays dans les valeurs du formulaire

        phonenumber: phoneNumberWithSpace,
      };

      if (!values.matriculeFiscale) {
        delete requestBody.matriculeFiscale;
      }

      await axios.post("http://localhost:5000/api/auth/signup", requestBody);
      message.success("Inscription réussie !");
      setTimeout(() => {
        history(`/verification?email=${values.email}`);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      if (error.response && error.response.status === 409) {
        message.error("L'adresse e-mail est déjà utilisée.");
      } else {
        message.error("Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Link to="/" className="custom-home-button">
        <ArrowLeftOutlined />
      </Link>
      <div className="signup-card">
        <div className="headerb">
          <h1 className="welcome-text">
            Bienvenue sur <span className="v">V</span>
            <span className="b">Bill</span>
            <span className="fv"> ! </span>
          </h1>
          <p className="subtitle">Créez un compte gratuitement</p>
        </div>

        <div className="content">
          <Form
            name="signup-form"
            onFinish={handleSubmit}
            layout="vertical"
            className="signup-form"
          >
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer votre nom et prénom",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="icon-style" />}
                    className="custom-input"
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 20, // Réduire légèrement la taille de la police
                      width: "340px", // Augmenter la largeur du champ
                      marginBottom: 10,
                      color: "#5f5e5e",
                      fontfamily: "Poppins",
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                      e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                      e.target.style.borderBottomColor = "#0a579f"; // Changer la couleur de la bordure du bas en cas de focus
                    }}
                    placeholder="Nom et Prénom"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Veuillez entrer une adresse e-mail valide",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="icon-style" />}
                    className="custom-input"
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 20, // Réduire légèrement la taille de la police
                      width: "340px", // Augmenter la largeur du champ
                      marginBottom: 10,
                      color: "#5f5e5e",
                      fontfamily: "Poppins",
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                      e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                      e.target.style.borderBottomColor = "#0a579f"; // Changer la couleur de la bordure du bas en cas de focus
                    }}
                    placeholder="Email"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      min: 8,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="icon-style" />}
                    className="custom-input"
                    placeholder="Mot de passe"
                    style={{
                      border: "none",
                      borderRadius: 0,
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0",
                      fontSize: 20,
                      width: "340px",
                      marginBottom: 10,
                      color: "#5f5e5e",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  className="form-item"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez confirmer votre mot de passe",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
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
                    prefix={<LockOutlined className="icon-style" />}
                    className="custom-input"
                    style={{
                      border: "none",
                      borderRadius: 0,
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0",
                      fontSize: 20,
                      width: "340px",
                      marginBottom: 18,
                      color: "#5f5e5e",
                      fontFamily: "Poppins",
                    }}
                    placeholder="Confirmer Mot de Passe" // Modifier le placeholder ici
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  style={{ marginTop: -10 }}
                  name="namecompany"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer votre Nom de l'entreprise",
                    },
                  ]}
                >
                  <Input
                    prefix={<BankOutlined className="icon-style" />}
                    className="custom-input"
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 22, // Réduire légèrement la taille de la police
                      width: "340px", // Augmenter la largeur du champ
                      marginBottom: 10,
                      marginTop: -7,
                      color: "#5f5e5e",
                      fontWeight: "normal",
                      fontfamily: "Poppins",
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                      e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                      e.target.style.borderBottomColor = "#0a579f"; // Changer la couleur de la bordure du bas en cas de focus
                    }}
                    placeholder="Nom de l'entreprise"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ marginLeft: 55 }}
                  name="phonenumber"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer votre numéro de téléphone",
                    },
                  ]}
                >
                  <PhoneInput
                    country={countryCode} // Affiche le code de pays dans le champ de saisie
                    value={phonenumber} // Valeur du numéro de téléphone
                    onChange={(phone, country) => {
                      setPhoneNumber(phone);
                      setCountryCode(country.dialCode);
                    }}
                    enableSearch={true} // Activer la fonction de recherche
                    preferredCountries={["fr"]} // Afficher les pays en français en premier
                    localization={{ searchPlaceholder: "Rechercher un pays" }} // Placeholder pour la barre de recherche
                    inputProps={{
                      required: true,
                      placeholder: "Numéro de Téléphone",
                      className: "placeholder-style",
                    }}
                    inputStyle={{
                      border: "none",
                      borderRadius: 0,
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0",
                      fontSize: 18,
                      width: "290px",
                      marginLeft: "50px",
                      fontFamily: "Poppins",
                      fontWeight: "normal",
                      color: "#5f5e5e",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  style={{ marginTop: 12 }}
                  name="pays"
                  className="form-item"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (value || selectedCountry) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Veuillez sélectionner votre pays")
                        );
                      },
                    },
                  ]}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #9e9ea3",
                      marginBottom: 30,
                      width: 340,
                    }}
                  >
                    <ReactSelect
                      options={countryOptions}
                      components={{ Option: CountryOption }}
                      placeholder="Sélectionnez un pays"
                      onChange={handleCountryChange}
                      styles={{
                        control: (base) => ({
                          ...base,
                          border: "none",
                          boxShadow: "none",
                          fontSize: 20,
                          color: "#5f5e5e",
                          fontFamily: "Poppins",
                          borderBottom: "none",
                        }),
                        indicatorSeparator: (base) => ({
                          ...base,
                          display: "none",
                          maxHeight: 150,
                          overflowY:
                            countryOptions.length > 8 ? "auto" : "hidden",
                        }),
                        dropdownIndicator: (base) => ({
                          ...base,
                          color: "#9e9ea3",
                          fontSize: 20,
                        }),
                        menu: (base) => ({
                          ...base,
                          maxHeight: 150,
                          overflowY:
                            countryOptions.length > 8 ? "auto" : "hidden",
                        }),
                      }}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  style={{ marginTop: 2 }}
                  name="address"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer votre adresse",
                    },
                  ]}
                >
                  <Input
                    prefix={<EnvironmentOutlined className="icon-style" />}
                    className="custom-input"
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 23, // Réduire légèrement la taille de la police
                      width: "340px", // Augmenter la largeur du champ
                      marginBottom: 30,
                      color: "#5f5e5e",
                      fontfamily: "Poppins",
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = "none"; // Retirer le contour lorsqu'il est en focus

                      e.target.style.boxShadow = "none"; // Retirer l'ombre lorsqu'il est en focus
                      e.target.style.borderBottomColor = "#0a579f"; // Changer la couleur de la bordure du bas en cas de focus
                    }}
                    placeholder="Adresse"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: 15, marginLeft: 55, marginTop: -25 }}
                >
                  <Checkbox
                    checked={isMatriculeFiscaleOptional}
                    onChange={(e) =>
                      setIsMatriculeFiscaleOptional(e.target.checked)
                    }
                    style={{
                      fontSize: 19,
                      color: " #454444",
                      borderRadius: 4,
                      padding: "12px 16px", // Augmentation de la taille du checkbox
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#0a579f";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#464748";
                    }}
                  >
                    <span style={{ fontSize: 18, marginLeft: 4 }}>
                      Matricule Fiscale
                    </span>
                  </Checkbox>
                </Form.Item>
              </Col>
              {isMatriculeFiscaleOptional && (
                <Col span={12}>
                  <Form.Item
                    name="matriculeFiscale"
                    className="form-item"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez entrer votre matricule fiscale",
                      },
                    ]}
                  >
                    <Input
                      className="custom-input"
                      style={{
                        border: "none",
                        borderRadius: 0,
                        borderBottom: "2px solid #9e9ea3",
                        padding: "10px 0",
                        fontSize: 22,
                        width: "340px",
                        color: "#5f5e5e",
                        fontfamily: "Poppins",

                        marginTop: -60,
                      }}
                      onFocus={(e) => {
                        e.target.style.outline = "none";
                        e.target.style.boxShadow = "none";
                        e.target.style.borderBottomColor = "#0a579f";
                      }}
                      placeholder="Matricule Fiscale"
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Form.Item style={{ marginLeft: 50, marginBottom: -25 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: "120px", // Ajustez la largeur selon vos besoins
                  height: "40px", // Ajustez la hauteur selon vos besoins
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  borderRadius: "4px",
                  marginTop: "10px",
                  background: "linear-gradient(to right, #0f116c, #0f116c)", // Dégradé de couleur
                  border: "none", // Retirer la bordure
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                S&apos;inscrire
              </Button>
            </Form.Item>

            <div className="mt-4">
              <p className="signin-t">
                Vous avez déjà un compte?{" "}
                <Link to="/login" className="signin-link">
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

// Valider les prop types pour CountryOption
CountryOption.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
};

export default Signup;
