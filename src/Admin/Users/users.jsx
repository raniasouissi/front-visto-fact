import React, { useState, useEffect } from "react";
import {
  Tabs,
  Table,
  Button,
  Input,
  Drawer,
  Form,
  message,
  Row,
  Col,
  Select,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import apiusers from "./apiusers";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

import { Popconfirm } from "antd";
//import { parsePhoneNumberFromString } from "libphonenumber-js";
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

const { TabPane } = Tabs;
const { Option } = Select;

const Users = () => {
  const [activeTab, setActiveTab] = useState("clients");
  const [users, setUsers] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [userType, setUserType] = useState("client");
  const [editingUser, setEditingUser] = useState(null);
  const [phonenumber, setPhoneNumber] = useState("");

  const [isMatriculeFiscaleOptional, setIsMatriculeFiscaleOptional] =
    useState(false);
  const [countryCode, setCountryCode] = useState("");

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [matriculeFiscaleFilter, setMatriculeFiscaleFilter] = useState("all");

  // Mise à jour de la valeur du pays lors de la sélection dans la liste déroulante
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };
  useEffect(() => {
    form.setFieldsValue({ pays: selectedCountry });
  }, [selectedCountry]);

  useEffect(() => {
    fetchUsers(activeTab);
  }, [activeTab, matriculeFiscaleFilter]);
  // Regrouper les dépendances

  const fetchUsers = async (type, searchQuery = "") => {
    try {
      let data = [];
      if (type === "clients") {
        data = await apiusers.fetchClients(searchQuery);

        let filteredClients = data;

        if (matriculeFiscaleFilter === "with") {
          filteredClients = data.filter((client) => !!client.matriculeFiscale);
        } else if (matriculeFiscaleFilter === "without") {
          filteredClients = data.filter((client) => !client.matriculeFiscale);
        }

        setUsers(filteredClients);
      } else if (type === "financiers") {
        data = await apiusers.fetchFinanciers(searchQuery);
        setUsers(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleSearch = (value) => {
    fetchUsers(activeTab, value);
  };
  const handleDeleteUser = async (userId) => {
    try {
      if (activeTab === "clients") {
        await apiusers.deleteClient(userId);
      } else if (activeTab === "financiers") {
        await apiusers.deleteFinancier(userId);
      }
      fetchUsers(activeTab); // Re-fetch les utilisateurs après la suppression
      message.success("Utilisateur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      message.error(
        "Erreur lors de la suppression de l'utilisateur. Veuillez réessayer."
      );
    }
  };
  // Dans votre composant
  const handleEditUser = (record) => {
    setUserType(activeTab === "clients" ? "client" : "financier");
    setEditingUser(record);
    setDrawerVisible(true);

    // Définir les valeurs du formulaire
    form.setFieldsValue({
      ...record,
    });

    // Définir le pays sélectionné dans l'état selectedCountry
    setSelectedCountry({
      label: record.pays,
    });
  };

  const handleUpdateUser = async () => {
    try {
      // Valider les champs du formulaire
      const values = await form.validateFields();

      // Construction des données utilisateur à mettre à jour
      const userDataToUpdate = {
        ...editingUser, // Conserver les anciennes valeurs de l'utilisateur
        ...values, // Mettre à jour avec les nouvelles valeurs du formulaire
      };

      // Formater le numéro de téléphone
      const formattedPhoneNumber = `+${countryCode} ${phonenumber}`;

      // Vérifier si le code de pays est répété dans le numéro de téléphone
      const phoneNumberWithoutRepeatedCountryCode =
        formattedPhoneNumber.replace(new RegExp(`\\+${countryCode} `), "+");

      // Ajouter un espace entre le code de pays et le numéro
      const phoneNumberWithSpace =
        phoneNumberWithoutRepeatedCountryCode.replace(
          `${countryCode}`,
          `${countryCode} `
        );

      // Mettre à jour la valeur du numéro de téléphone dans les données utilisateur
      userDataToUpdate.phonenumber = phoneNumberWithSpace;
      userDataToUpdate.pays = selectedCountry ? selectedCountry.label : "";

      // Envoyer une requête de mise à jour à l'API
      if (activeTab === "clients") {
        await apiusers.updateClient(editingUser._id, userDataToUpdate);
      } else if (activeTab === "financiers") {
        await apiusers.updateFinancier(editingUser._id, userDataToUpdate);
      }

      // Afficher un message de succès
      message.success("Utilisateur mis à jour avec succès !");

      // Réinitialiser le formulaire et les états
      setDrawerVisible(false);
      form.resetFields();
      fetchUsers(activeTab);
      setEditingUser(null);
      setSelectedCountry(null);

      form.resetFields(); // Réinitialiser le formulaire après 2 secondes
    } catch (error) {
      // Gérer les erreurs de validation du formulaire
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      message.error(
        "Erreur lors de la mise à jour de l'utilisateur. Veuillez réessayer."
      );
    }
  };

  const handleAddUser = async (values) => {
    try {
      // Réinitialiser selectedCountry à null
      setSelectedCountry(null);

      // Vider manuellement le champ du pays dans le formulaire
      form.setFieldsValue({
        ...values,
        pays: null,
      });

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
      values.pays = selectedCountry ? selectedCountry.label : "";
      if (!values.matriculeFiscale) {
        delete values.matriculeFiscale;
      }

      if (userType === "client") {
        await apiusers.addClient(values);
      } else if (userType === "financier") {
        await apiusers.addFinancier(values);
      }
      message.success("Utilisateur ajouté avec succès !");
      setDrawerVisible(false);
      setTimeout(() => {
        form.resetFields(); // Réinitialiser le formulaire après 50 secondes
      }, 50000);

      fetchUsers(activeTab);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      message.error(
        "Erreur lors de l'ajout de l'utilisateur. Veuillez réessayer."
      );
    }
  };

  const columns = [
    {
      title: "Référence",
      dataIndex: "reference",
      key: "reference",
      render: (text) => text || "N/A",
    },
    {
      title: "Matricule Fiscale",
      dataIndex: "matriculeFiscale",
      key: "matriculeFiscale",
      render: (text) => text || "N/A",
    },
    {
      title: "Nom de l'entreprise",
      dataIndex: "namecompany",
      key: "namecompany",
      render: (text) => text || "N/A",
    },
    { title: "Nom", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Téléphone", dataIndex: "phonenumber", key: "phonenumber" },
    { title: "Adresse", dataIndex: "address", key: "address" },
    { title: "Pays", dataIndex: "pays", key: "pays" },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => text || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          ></Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce client ?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className="delete-icon"
            ></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const financiersColumns = [
    { title: "Nom", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },

    { title: "Téléphone", dataIndex: "phonenumber", key: "phonenumber" },

    { title: "Adresse", dataIndex: "address", key: "address" },
    { title: "Pays", dataIndex: "pays", key: "pays" },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          ></Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce financier ?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              className="delete-icon"
            ></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="clients"
        onChange={handleTabChange}
        tabBarExtraContent={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              prefix={<SearchOutlined style={{ color: "#5e5e62" }} />}
              placeholder="Rechercher ..."
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 400, marginRight: 8, height: 35 }}
            />
            <Button
              type="primary"
              onClick={() => {
                setDrawerVisible(true);
                form.resetFields();
                setEditingUser(null);
              }}
              icon={<PlusOutlined />}
              style={{ backgroundColor: "#0a0a85" }}
            >
              Ajouter un utilisateur
            </Button>
          </div>
        }
      >
        <TabPane tab="Clients" key="clients">
          <Select
            defaultValue="all"
            style={{ width: 180, marginBottom: 16 }}
            onChange={setMatriculeFiscaleFilter}
          >
            <Option value="all">Tous</Option>
            <Option value="with">Client morale</Option>
            <Option value="without">Client physique</Option>
          </Select>
          <Table dataSource={users} columns={columns} />
        </TabPane>
        <TabPane tab="Financiers" key="financiers">
          <Table dataSource={users} columns={financiersColumns} />
        </TabPane>
      </Tabs>
      <Drawer
        title={
          editingUser
            ? `Modifier un ${userType === "client" ? "client" : "financier"}`
            : `Ajouter un ${userType === "client" ? "client" : "financier"}`
        }
        placement="right"
        width={720}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
      >
        <Form
          form={form}
          onFinish={editingUser ? handleUpdateUser : handleAddUser}
          layout="vertical"
        >
          <Form.Item style={{ width: 200 }}>
            {!editingUser && (
              <Select
                defaultValue="client"
                onChange={(value) => setUserType(value)}
                style={{
                  width: "300px",
                  fontSize: "16px",
                  borderRadius: "2px",
                  fontFamily: "Poppins",
                  color: "#121477",
                }}
              >
                <Option value="client">Client</Option>
                <Option value="financier">Financier</Option>
              </Select>
            )}
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                style={{ marginLeft: 5 }}
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
                  className="custom-input"
                  style={{
                    border: "none", // Retirer toutes les bordures
                    borderRadius: 0, // Retirer le rayon de bordure
                    borderBottom: "2px solid #9e9ea3",
                    padding: "10px 0", // Ajuster le padding
                    fontSize: 20, // Réduire légèrement la taille de la police
                    width: "270px", // Augmenter la largeur du champ
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
                style={{ marginLeft: 5 }}
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
                  className="custom-input"
                  style={{
                    border: "none", // Retirer toutes les bordures
                    borderRadius: 0, // Retirer le rayon de bordure
                    borderBottom: "2px solid #9e9ea3",
                    padding: "10px 0", // Ajuster le padding
                    fontSize: 20, // Réduire légèrement la taille de la police
                    width: "270px", // Augmenter la largeur du champ
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
          <Row gutter={16}>
            {userType === "client" && (
              <Col span={12}>
                <Form.Item
                  style={{ marginLeft: 5 }}
                  name="namecompany"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer le nom de l'entreprise",
                    },
                  ]}
                >
                  <Input
                    className="custom-input"
                    style={{
                      border: "none", // Retirer toutes les bordures
                      borderRadius: 0, // Retirer le rayon de bordure
                      borderBottom: "2px solid #9e9ea3",
                      padding: "10px 0", // Ajuster le padding
                      fontSize: 22, // Réduire légèrement la taille de la police
                      width: "270px", // Augmenter la largeur du champ
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
            )}
            <Col span={12}>
              <Form.Item
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
                    width: "225px",
                    marginLeft: "50px",
                    fontFamily: "Poppins",
                    fontWeight: "normal",
                    color: "#5f5e5e",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
                  {/* Affichez le pays sélectionné à l'aide de selectedCountry */}
                  <ReactSelect
                    options={countryOptions}
                    components={{ Option: CountryOption }}
                    placeholder="Sélectionnez un pays"
                    value={selectedCountry} // Utilisez selectedCountry pour définir la valeur sélectionnée
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
                style={{ marginLeft: 5 }}
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
                  className="custom-input"
                  style={{
                    border: "none", // Retirer toutes les bordures
                    borderRadius: 0, // Retirer le rayon de bordure
                    borderBottom: "2px solid #9e9ea3",
                    padding: "10px 0", // Ajuster le padding
                    fontSize: 23, // Réduire légèrement la taille de la police
                    width: "280px", // Augmenter la largeur du champ
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
          {userType === "client" && (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  style={{ marginBottom: 15, marginLeft: 10, marginTop: -25 }}
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
                    style={{ marginLeft: 5 }}
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
                        width: "270px",
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
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                background: "linear-gradient(to right, #0f116c, #0f116c)",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "4px",
                textAlign: "center",
                width: "120px",
                height: "40px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                fontFamily: "Poppins",
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              {editingUser ? "Mettre à jour" : "Ajouter"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
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

export default Users;
