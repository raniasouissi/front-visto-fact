import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Avatar,
  Row,
  Col,
  Modal,
} from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import PropTypes from "prop-types";
import apiusers from "../Admin/Users/apiusers";
import "./ModifierProfil.css";
import ReactSelect, { components } from "react-select";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  BankOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";

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

const countryOptions = countryList().getData();

CountryOption.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
};

const ModifierProfil = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const idProfil = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  const fetchUser = () => {
    axios
      .get("http://localhost:5000/api/users/" + idProfil)
      .then((response) => {
        setUser(response.data);
        // Utilisation de la fonction de rappel pour garantir que les valeurs du formulaire sont définies après la mise à jour de l'état
        form.setFieldsValue(response.data);
        setSelectedCountry(response.data.pays); // Mettre à jour le pays sélectionné
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des données de user :", error)
      );
  };

  useEffect(() => {
    form.setFieldsValue({ pays: selectedCountry });
  }, [selectedCountry]);

  useEffect(() => {
    fetchUser();
    console.log("user", user);
  }, [form, idProfil]);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };
  useEffect(() => {
    form.setFieldsValue({ pays: selectedCountry });
  }, [selectedCountry]);

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();

      if (values && values.phonenumber) {
        const userDataToUpdate = {
          ...values,
          pays: selectedCountry,
        };

        // Formater le numéro de téléphone
        const formattedPhoneNumber = `+${values.countryCode} ${values.phonenumber}`;
        const phoneNumberWithoutRepeatedCountryCode =
          formattedPhoneNumber.replace(
            new RegExp(`\\+${values.countryCode} `),
            "+"
          );
        const phoneNumberWithSpace =
          phoneNumberWithoutRepeatedCountryCode.replace(
            `${values.countryCode}`,
            `${values.countryCode} `
          );
        userDataToUpdate.codepostal = "ffff";

        userDataToUpdate.phonenumber = phoneNumberWithSpace;
        userDataToUpdate.pays = selectedCountry ? selectedCountry.label : "";

        // Envoyer une requête de mise à jour à l'API
        if (user) {
          if (role === "client") {
            await apiusers.updateClient(userDataToUpdate, imageName);
          } else if (role === "financier") {
            console.log("ffff", userDataToUpdate);
            await apiusers.updateFinancier(idProfil, userDataToUpdate);
            fetchUser();
          }

          message.success("Utilisateur mis à jour avec succès !");
          setModalVisible(false);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      message.error(
        "Erreur lors de la mise à jour de l'utilisateur. Veuillez réessayer."
      );
    }
  };

  const handleImageChange = (info) => {
    if (info.fileList.length > 0) {
      setImageName(info.fileList[0].originFileObj.name);
      setImagePreview(info.fileList[0].originFileObj);
    } else {
      setImageName("");
      setImagePreview(null);
    }
  };

  return (
    <div className="modifier-profil-container">
      {user && (
        <>
          <Row gutter={[16, 16]} justify="center">
            <Col span={24}>
              <div>
                <div>
                  <h2
                    style={{
                      fontSize: "27px",
                      marginBottom: "10px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      textAlign: "center",
                      borderBottom: "2px solid #121477",
                    }}
                  >
                    <span style={{ color: "#ea4848" }}>Mes </span>
                    <span style={{ color: " #121477" }}>Informations</span>
                  </h2>
                </div>
              </div>
              <div
                className="user-info"
                style={{
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    src={imagePreview}
                  />
                  <div
                    className="user-name"
                    style={{
                      marginLeft: "20px",
                      fontSize: "24px",
                      color: "#333",
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                  >
                    {user.name}
                  </div>
                </div>
                <div className="user-details">
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "20px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <MailOutlined
                      style={{
                        color: "#888",
                        marginRight: "15px",
                        fontSize: "20px",
                      }}
                    />{" "}
                    <span
                      style={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      Email:
                    </span>{" "}
                    {user.email}
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "20px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <PhoneOutlined
                      style={{
                        color: "#888",
                        marginRight: "15px",
                        fontSize: "20px",
                      }}
                    />{" "}
                    <span
                      style={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      Numéro de Téléphone:
                    </span>{" "}
                    {user.phonenumber}
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "20px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <EnvironmentOutlined
                      style={{
                        color: "#888",
                        marginRight: "15px",
                        fontSize: "20px",
                      }}
                    />{" "}
                    <span
                      style={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      Pays:
                    </span>{" "}
                    {user.pays}
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "20px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <EnvironmentOutlined
                      style={{
                        color: "#888",
                        marginRight: "15px",
                        fontSize: "20px",
                      }}
                    />{" "}
                    <span
                      style={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      Adresse:
                    </span>{" "}
                    {user.address}
                  </p>
                  {role === "client" && (
                    <p
                      style={{
                        fontSize: "18px",
                        marginBottom: "20px",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      <IdcardOutlined
                        style={{
                          color: "#888",
                          marginRight: "15px",
                          fontSize: "20px",
                        }}
                      />{" "}
                      <span
                        style={{
                          color: "#333",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                      >
                        Code Postale:
                      </span>{" "}
                      {user.codepostal}
                    </p>
                  )}

                  {role === "client" && (
                    <p
                      style={{
                        fontSize: "18px",
                        marginBottom: "20px",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      <BankOutlined
                        style={{
                          color: "#888",
                          marginRight: "15px",
                          fontSize: "20px",
                        }}
                      />{" "}
                      <span
                        style={{
                          color: "#333",
                          fontWeight: "bold",
                          fontSize: "20px",
                        }}
                      >
                        Entreprise:
                      </span>{" "}
                      {user.namecompany}
                    </p>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <Modal
            title="Modifier Profil"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={handleUpdateUser}
          >
            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Nom et Prénom"
                    initialValue={user.name}
                    rules={[
                      {
                        required: true,
                        message: "Veuillez entrer votre nom et prénom",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    initialValue={user.email}
                    rules={[
                      {
                        required: true,
                        message: "Veuillez entrer votre email",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phonenumber"
                    label="Numéro de Téléphone"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez entrer votre numéro de téléphone",
                      },
                    ]}
                  >
                    <PhoneInput
                      defaultCountry={"fr"}
                      inputStyle={{ width: "100%" }}
                      enableSearch={true}
                      inputProps={{
                        name: "phonenumber",
                        required: true,
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    style={{ marginLeft: 5 }}
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
                        marginTop: 20,
                        width: 280,
                      }}
                    >
                      {/* Afficher le pays sélectionné à l'aide de selectedCountry */}
                      <ReactSelect
                        options={countryOptions}
                        components={{ Option: CountryOption }}
                        placeholder="Sélectionnez un pays"
                        value={selectedCountry} // Utiliser selectedCountry pour définir la valeur sélectionnée
                        onChange={handleCountryChange}
                        styles={
                          {
                            // Styles personnalisés pour le sélecteur de pays
                          }
                        }
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="address"
                    label="Adresse"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez entrer votre adresse",
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
              {role === "client" && (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="codepostal"
                      label="Code Postal"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre code postal",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="matriculeFiscale"
                      label="Matricule Fiscale"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer votre matricule fiscale",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              {role === "client" && (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="namecompany"
                      label="Nom de l'Entreprise"
                      rules={[
                        {
                          required: true,
                          message: "Veuillez entrer le nom de l'entreprise",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Téléverser une image" name="image">
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="/upload"
                        onChange={handleImageChange}
                      >
                        {imagePreview ? (
                          <img
                            src={URL.createObjectURL(imagePreview)}
                            alt="avatar"
                            style={{ width: "100%" }}
                          />
                        ) : imageName ? (
                          <Avatar
                            size={64}
                            src={URL.createObjectURL(imageName)}
                            alt="avatar"
                          />
                        ) : (
                          <Button>Choisir une image</Button>
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Form>
          </Modal>

          <Row>
            <Col span={12}>
              <Button
                className="update-button"
                type="primary"
                onClick={() => setModalVisible(true)}
              >
                <EditOutlined /> Modifier Profil
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ModifierProfil;
