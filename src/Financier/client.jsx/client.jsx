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
  Avatar,
  Space,
  Upload,
} from "antd";
import {
  UserAddOutlined,
  SearchOutlined,
  EditOutlined,
  CloseCircleOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import apiusers from "../../Admin/Users/apiusers";
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

const client = () => {
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

  const [imageP, setImage] = useState();
  const [imageName, setImageName] = useState("");

  /* const handleImageChange = (info) => {
    if (info.file.status === "done") {
      // Récupérer le nom de fichier de l'image téléchargée
      const uploadedFileName = info.file.response.filename;
      // Mettre à jour l'état avec le nom du fichier de l'image téléchargée
      setUploadedFile(uploadedFileName);
    }
  };*/

  const handleImageChange = (info) => {
    if (info.fileList.length > 0) {
      setImage(info.fileList[0].originFileObj);
      setImageName(info.fileList[0].originFileObj.name); // Capturer le nom du fichier
      console.log("imagep", imageP);
    } else {
      setImage(null);
      setImageName(null);
    }
  };
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

        // Filtrer les clients en fonction de la présence ou non du matricule fiscal
        let filteredClients = [];
        if (matriculeFiscaleFilter === "with") {
          filteredClients = data.filter((client) => !!client.matriculeFiscale);
        } else if (matriculeFiscaleFilter === "without") {
          filteredClients = data.filter((client) => !client.matriculeFiscale);
        } else {
          filteredClients = data; // Si aucun filtre n'est sélectionné, conserver tous les clients
        }

        // Filtrer les clients avec un statut true
        const clientsWithTrueStatus = filteredClients.filter(
          (client) => client.status === true
        );

        // Inclure le chemin de l'image dans les données du client
        const usersWithImage = clientsWithTrueStatus.map((client) => ({
          ...client,
          imagePath: `http://localhost:5000/uploads/${client.image}`, // Ajouter le chemin de l'image
        }));

        setUsers(usersWithImage);
        console.log("image", usersWithImage);
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

  const handleDeleteActv = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: false }),
      });
      if (response.ok) {
        // Effectuez les actions nécessaires après la suppression réussie

        message.success("Les données ont été supprimées avec succès");
        fetchUsers(activeTab);
      } else {
        throw new Error("Échec de la suppression des données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Échec de la suppression des données");
    }
  };

  const handleEditUser = (record) => {
    setUserType("client"); // Définit le type d'utilisateur sur "client"
    setEditingUser(record);
    setDrawerVisible(true);
    setImageName(record.image.toString());

    // Définit les valeurs du formulaire avec les données de l'utilisateur
    form.setFieldsValue({
      ...record,
    });

    // Définit le pays sélectionné dans l'état selectedCountry
    setSelectedCountry({
      label: record.pays,
    });
    console.log("record", record.image);
    console.log("record1", record);
  };

  const handleUpdateUser = async () => {
    try {
      // Valider les champs du formulaire
      const values = await form.validateFields();

      // Construction des données utilisateur à mettre à jour
      const userDataToUpdate = {
        ...editingUser,
        ...values,
        image: imageName,
      };

      // Formater le numéro de téléphone
      const formattedPhoneNumber = `+${countryCode} ${phonenumber}`;
      const phoneNumberWithoutRepeatedCountryCode =
        formattedPhoneNumber.replace(new RegExp(`\\+${countryCode} `), "+");
      const phoneNumberWithSpace =
        phoneNumberWithoutRepeatedCountryCode.replace(
          `${countryCode}`,
          `${countryCode} `
        );

      // Vérifier si le numéro de téléphone a été modifié
      if (
        editingUser.phonenumber !== phoneNumberWithSpace ||
        (editingUser.phonenumber === "" && phoneNumberWithSpace !== "")
      ) {
        userDataToUpdate.phonenumber = phoneNumberWithSpace;
      }
      userDataToUpdate.pays = selectedCountry ? selectedCountry.label : "";

      // Envoyer une requête de mise à jour à l'API
      await apiusers.updateClient(editingUser._id, userDataToUpdate, imageP);

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

      // Formater le numéro de téléphone
      const formattedPhoneNumber = `+${countryCode} ${phonenumber}`;
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

      // Ajouter un client
      await apiusers.addClient(values);

      // Afficher un message de succès
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
      title: "Logo",
      dataIndex: "image",
      key: "image",
      render: (imagePath) => {
        console.log("Chemin de l'image :", imagePath); // Ajout du console.log pour vérifier le chemin de l'image
        return (
          <>
            {imagePath ? (
              <Avatar
                src={`http://localhost:5000/uploads/${imagePath}`}
                alt="Client"
                style={{ width: 40, height: 40 }}
              />
            ) : (
              <Avatar
                icon={<UserOutlined />}
                alt="N/A"
                style={{ width: 40, height: 40 }}
              />
            )}
          </>
        );
      },
    },

    {
      title: "M.F",
      dataIndex: "matriculeFiscale",
      key: "matriculeFiscale",
      render: (text) => text || "N/A",
    },
    {
      title: "Entreprise",
      dataIndex: "namecompany",
      key: "namecompany",
      render: (text) => text || "N/A",
    },
    { title: "Nom", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Téléphone", dataIndex: "phonenumber", key: "phonenumber" },

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
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
              style={{
                backgroundColor: "#1890ff", // Couleur de fond bleue
                border: "none", // Supprimer la bordure
                borderRadius: "40%", // Coins arrondis
                width: "45px",
              }}
            />

            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce client ?"
              onConfirm={() => handleDeleteActv(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button
                type="danger"
                icon={<CloseCircleOutlined />}
                style={{
                  backgroundColor: "#f5222d",
                  color: "#fff",
                  border: "none",
                  width: "50px",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                  transition:
                    "background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s",
                }}
                className="delete-icon"
              ></Button>
            </Popconfirm>
          </Space>
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
              prefix={<SearchOutlined style={{ color: "#8f8fa1" }} />}
              placeholder="Rechercher ..."
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: 250,
                marginRight: 8,
                height: 35,
                borderRadius: 10, // Ajoute des coins arrondis pour un aspect plus moderne
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Ajoute une ombre subtile
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                setDrawerVisible(true);
                form.resetFields();
                setEditingUser(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                height: 35,
                paddingLeft: 10,
                paddingRight: 5,
                borderRadius: 5,
                width: "175px",
                backgroundColor: "#232492", // Couleur de fond personnalisée
                border: "none",

                color: "#fff", // Couleur du texte
              }}
            >
              <UserAddOutlined style={{ fontSize: 18 }} />{" "}
              {/* Icône modifiée */}
              <span style={{ fontWeight: "bold", fontSize: 14 }}>
                Ajouter Client
              </span>
            </Button>
          </div>
        }
      >
        <TabPane
          tab={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 17,
                  color: "#3a3838",
                }}
              >
                Clients
              </span>
            </div>
          }
          key="clients"
        >
          <Select
            defaultValue="all"
            style={{
              width: 150,
              marginBottom: 16,
              marginRight: 10,
              borderRadius: 8, // Coins arrondis
              border: "1px solid #ccc", // Bordure légère
              backgroundColor: "#fff", // Couleur de fond
              color: "#333", // Couleur du texte
              fontFamily: "Arial, sans-serif",
            }}
            onChange={setMatriculeFiscaleFilter}
            dropdownStyle={{
              borderRadius: 8, // Coins arrondis du menu déroulant
              backgroundColor: "#fff", // Couleur de fond du menu déroulant
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Ombre subtile
            }}
          >
            <Option value="all">Tous Clients</Option>
            <Option value="with">Client morale</Option>
            <Option value="without">Client physique</Option>
          </Select>

          <Table
            dataSource={users}
            columns={columns}
            bordered
            pagination={{ pageSize: 10 }}
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
            }}
          />
        </TabPane>
      </Tabs>
      <Drawer
        title={editingUser ? "Modifier un client" : "Ajouter un client"}
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
            {editingUser && userType === "client" && (
              <Form.Item name="uploadedFile" label="Image">
                <Upload
                  beforeUpload={() => false}
                  listType="picture"
                  onChange={handleImageChange}
                >
                  <Button icon={<UploadOutlined />}>Choisir une image</Button>
                </Upload>
                {imageName && (
                  <Avatar src={`http://localhost:5000/uploads/${imageName}`} />
                )}
              </Form.Item>
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
                height: 40,
                borderRadius: 8,
                width: 175,
                backgroundColor: "#1890ff", // Bleu primaire
                border: "none",
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "#fff", // Texte blanc
                marginRight: 10,
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

export default client;
