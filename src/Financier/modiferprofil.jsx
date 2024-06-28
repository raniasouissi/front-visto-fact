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
  Card,
  Divider,
} from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import PropTypes from "prop-types";
import apiusers from "../Admin/Users/apiusers";
import "./ModifierProfil.css";
import ReactSelect, { components } from "react-select";
import { HomeOutlined } from "@ant-design/icons";

import {
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  BankOutlined,
  EditOutlined,
  KeyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { FaUser } from "react-icons/fa";

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
  const [imageFile, setImageFile] = useState(null); // État local pour stocker le fichier d'image sélectionné

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleP, setModalVisibleP] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [modalKey, setModalKey] = useState(0);

  const idProfil = localStorage.getItem("id");
  const role = localStorage.getItem("role");
  const type = localStorage.getItem("Type");

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          email: user.email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }
      );

      message.success(response.data.message);
      setModalVisibleP(false);
      setOldPassword(""); // Réinitialiser les valeurs du champ ancien mot de passe
      setNewPassword(""); // Réinitialiser les valeurs du champ nouveau mot de passe
      form.resetFields(); // Réinitialiser le formulaire
      // Incrémentez la clé du modal pour forcer sa réinitialisation
      setModalKey((prevKey) => prevKey + 1);
    } catch (error) {
      let errorMessage =
        "Une erreur est survenue lors de la modification du mot de passe. Veuillez vérifier que votre ancien mot de passe est correct et assurez-vous que votre nouveau mot de passe est différent de l'ancien.";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Utilisateur non trouvé";
        } else if (error.response.status === 401) {
          errorMessage = "Ancien mot de passe incorrect";
        } else if (error.response.status === 400) {
          errorMessage =
            "Le nouveau mot de passe ne peut pas être identique à l'ancien";
        }
      }

      setErrorMsg(errorMessage);

      // Effacer le message d'erreur après 5 secondes
      setTimeout(() => {
        setErrorMsg("");
      }, 10000);
    }
  };

  const fetchUser = () => {
    axios
      .get("http://localhost:5000/api/users/" + idProfil)
      .then((response) => {
        setUser(response.data);
        // Utilisation de la fonction de rappel pour garantir que les valeurs du formulaire sont définies après la mise à jour de l'état
        form.setFieldsValue(response.data);

        // Formatage de la valeur du pays pour correspondre à l'objet attendu
        const selectedCountryFromDB = response.data.pays;
        const selectedCountryOption = countryOptions.find(
          (option) => option.label === selectedCountryFromDB
        );
        setSelectedCountry(selectedCountryOption); // Mettre à jour le pays sélectionné
        setOriginalPhoneNumber(response.data.phonenumber);
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
      console.log("User Data to Update:", values);

      if (values && values.phonenumber) {
        const userDataToUpdate = {
          ...values,
          pays: selectedCountry,
          image: imageName,
        };

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

        if (
          values.phonenumber !== originalPhoneNumber || // Vérifier si le numéro de téléphone a été modifié
          (values.phonenumber === "" && originalPhoneNumber !== "") // Vérifier si le numéro de téléphone a été effacé
        ) {
          userDataToUpdate.phonenumber = phoneNumberWithSpace;
        }

        userDataToUpdate.pays = selectedCountry ? selectedCountry.label : "";

        if (user) {
          if (role === "client") {
            await apiusers.updateClient(userDataToUpdate, imageName);
          } else if (role === "financier") {
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
      const file = info.fileList[0].originFileObj; // Capturer le fichier complet
      const fileName = info.fileList[0].name; // Capturer le nom du fichier
      console.log("Nom du fichier :", fileName);
      setImageName(fileName); // Mettre à jour le nom de fichier avec le nouveau nom
      setImageFile(file);
    } else {
      setImageName(""); // Réinitialiser le nom de fichier si aucune image n'est sélectionnée
      setImageFile(null);
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
                      marginBottom: "30px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      textAlign: "center",
                      borderBottom: "2px solid #6c6c6f",
                    }}
                  >
                    <span style={{ color: "#ea4848" }}>Mon </span>
                    <span style={{ color: " #121477" }}>Profil</span>
                  </h2>
                </div>
              </div>
              <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                  <Card
                    style={{
                      textAlign: "center",
                      borderRadius: "8px",
                    }}
                  >
                    <div>
                      <Avatar
                        size={100}
                        icon={
                          <FaUser
                            style={{ fontSize: "48px", color: "#121477" }}
                          />
                        }
                        style={{
                          backgroundColor: "transparent",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }} // Ajouter une ombre douce à l'avatar
                      />
                    </div>
                    <Divider
                      style={{ margin: "10px 0", backgroundColor: "#535358" }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "23px",
                          color: "#333",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: "bold",
                        }}
                      >
                        {user.name}
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          marginBottom: "8px",
                          fontFamily: "Poppins, sans-serif",
                          marginLeft: -28,
                        }}
                      >
                        <MailOutlined
                          style={{
                            color: "#888",
                            marginRight: "8px",
                            fontSize: "20px",
                          }}
                        />
                        <span
                          style={{
                            color: "#333",

                            fontSize: "20px",
                          }}
                        >
                          Email:
                        </span>{" "}
                        {user.email}
                      </p>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={14} xl={14}>
                  <Card>
                    <div className="user-details">
                      <h2
                        style={{
                          fontSize: "21px",
                          marginBottom: "20px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: "bold",
                          borderBottom: "2px solid #919192",
                          color: "#121477",
                        }}
                      >
                        Mes Informations
                      </h2>
                      <p
                        style={{
                          fontSize: "15px",
                          marginBottom: "8px",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        <PhoneOutlined
                          style={{
                            color: "#888",
                            marginRight: "8px",
                            fontSize: "20px",
                          }}
                        />
                        <span
                          style={{
                            color: "#333",

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
                          marginBottom: "8px",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        <EnvironmentOutlined
                          style={{
                            color: "#888",
                            marginRight: "8px",
                            fontSize: "20px",
                          }}
                        />
                        <span
                          style={{
                            color: "#333",
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
                          marginBottom: "8px",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        <HomeOutlined
                          style={{
                            color: "#888",
                            marginRight: "8px",
                            fontSize: "20px",
                          }}
                        />
                        <span
                          style={{
                            color: "#333",

                            fontSize: "20px",
                          }}
                        >
                          Adresse:
                        </span>{" "}
                        {user.address}
                      </p>

                      <>
                        <p
                          style={{
                            fontSize: "18px",
                            marginBottom: "8px",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          <IdcardOutlined
                            style={{
                              color: "#888",
                              marginRight: "8px",
                              fontSize: "20px",
                            }}
                          />
                          <span
                            style={{
                              color: "#333",
                              fontSize: "20px",
                            }}
                          >
                            Code Postale:
                          </span>{" "}
                          {user.codepostale}
                        </p>

                        {role === "client" && (
                          <p
                            style={{
                              fontSize: "18px",
                              marginBottom: "20px",
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            <BankOutlined
                              style={{
                                color: "#888",
                                marginRight: "8px",
                                fontSize: "20px",
                              }}
                            />
                            <span
                              style={{
                                color: "#333",
                                fontSize: "20px",
                              }}
                            >
                              Entreprise:
                            </span>{" "}
                            {user.namecompany}
                          </p>
                        )}

                        {role === "client" && type === "client morale" && (
                          <p
                            style={{
                              fontSize: "18px",
                              marginBottom: "20px",
                              fontFamily: "Poppins, sans-serif",
                              marginTop: -15,
                            }}
                          >
                            <FileTextOutlined
                              style={{
                                color: "#888",
                                marginRight: "8px",
                                fontSize: "20px",
                              }}
                            />
                            <span
                              style={{
                                color: "#333",

                                fontSize: "20px",
                              }}
                            >
                              Matricule Fiscale
                            </span>{" "}
                            {user.matriculeFiscale}
                          </p>
                        )}
                      </>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <Modal
            title="Modifier Profil"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={handleUpdateUser}
            cancelText="Annuler"
            okText="Modifier"
            okButtonProps={{ style: { backgroundColor: "#121477" } }}
          >
            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Nom et Prénom"
                    initialValue={user.name}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    initialValue={user.email}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="phonenumber" label="Numéro de Téléphone">
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

                <Col span={12}>
                  <Form.Item
                    style={{ marginLeft: 5 }}
                    name="pays"
                    className="form-item"
                    initialValue={selectedCountry} // Utilisez la valeur sélectionnée
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
                        marginTop: 30,
                      }}
                    >
                      {/* Afficher le pays sélectionné à l'aide de selectedCountry */}
                      <ReactSelect
                        options={countryOptions}
                        components={{ Option: CountryOption }}
                        value={selectedCountry}
                        placeholder="Sélectionnez un pays"
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
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item name="address" label="Adresse">
                    <Input.TextArea />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="codepostale"
                    label="Code Postal"
                    initialValue={user.codepostale}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  {role === "client" && type === "client morale" && (
                    <Form.Item
                      name="matriculeFiscale"
                      label="Matricule Fiscale"
                    >
                      <Input />
                    </Form.Item>
                  )}
                </Col>
                {role === "client" && (
                  <Col span={12}>
                    <Form.Item name="namecompany" label="Nom de l'Entreprise">
                      <Input />
                    </Form.Item>
                  </Col>
                )}
              </Row>

              {role === "client" && (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Col span={12}>
                      <Form.Item label="Téléverser une image" name="image">
                        <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          onChange={handleImageChange} // Appeler la fonction handleImageChange lors du changement
                        >
                          {/* Afficher l'Avatar si imageName est défini */}
                          {imageName ? (
                            <Avatar
                              size={64}
                              alt="avatar"
                              src={
                                imageFile ? URL.createObjectURL(imageFile) : ""
                              }
                            />
                          ) : (
                            // Afficher le bouton "Choisir une image" si aucune image n'est sélectionnée
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>
                                Choisir une image
                              </div>
                            </div>
                          )}
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Col>
                </Row>
              )}
            </Form>
          </Modal>

          <Modal
            key={modalKey}
            title="Modifier Mot de Passe"
            visible={modalVisibleP}
            onCancel={() => {
              setModalVisibleP(false);
              setOldPassword(""); // Réinitialiser les valeurs du champ ancien mot de passe
              setNewPassword(""); // Réinitialiser les valeurs du champ nouveau mot de passe
              form.resetFields(); // Réinitialiser le formulaire
              // Incrémentez la clé du modal pour forcer sa réinitialisation
              setModalKey((prevKey) => prevKey + 1);
            }}
            footer={[
              <Button
                key="cancel"
                onClick={() => {
                  setModalVisibleP(false);
                  setOldPassword(""); // Réinitialiser les valeurs du champ ancien mot de passe
                  setNewPassword(""); // Réinitialiser les valeurs du champ nouveau mot de passe
                  form.resetFields(); // Réinitialiser le formulaire
                  // Incrémentez la clé du modal pour forcer sa réinitialisation
                  setModalKey((prevKey) => prevKey + 1);
                }}
              >
                Annuler
              </Button>,
              <Button
                key="submit"
                type="primary"
                style={{ backgroundColor: "#121477" }}
                onClick={handleChangePassword}
              >
                Modifier
              </Button>,
            ]}
          >
            <Form form={form}>
              <Form.Item
                label="Ancien Mot de Passe"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir votre ancien mot de passe!",
                  },
                ]}
              >
                <Input.Password
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Nouveau Mot de Passe"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir votre nouveau mot de passe!",
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
              >
                <Input.Password
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Confirmer le Nouveau Mot de Passe"
                name="confirmNewPassword"
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
                        new Error("Les mots de passe ne correspondent pas")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            </Form>
          </Modal>

          <Row style={{ marginTop: "20px" }} justify="space-between">
            <Col span={24}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  className="update-button"
                  type="primary"
                  style={{
                    backgroundColor: "#ea4848", // Couleur de fond personnalisée
                    borderColor: "#ea4848", // Couleur de la bordure personnalisée
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Ombre personnalisée
                    borderRadius: "10px", // Coins arrondis
                    marginRight: "15px", // Marge à droite
                    width: "45%", // Largeur du bouton
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setModalVisible(true)}
                >
                  <EditOutlined style={{ marginRight: "5px" }} /> Modifier
                  Profil
                </Button>
                <Button
                  className="update-button"
                  type="primary"
                  style={{
                    backgroundColor: "#121477", // Couleur de fond personnalisée
                    borderColor: "#121477", // Couleur de la bordure personnalisée
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Ombre personnalisée
                    borderRadius: "10px", // Coins arrondis
                    width: "45%", // Largeur du bouton
                    marginRight: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => setModalVisibleP(true)} // Définir l'état de modalVisible sur true lors du clic sur le bouton
                >
                  <KeyOutlined style={{ marginRight: "5px" }} /> Modifier Mot de
                  Passe
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ModifierProfil;
