import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Tabs,
  Row,
  Col,
  Badge,
  Select,
  Switch,
} from "antd";
import {
  EditOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";

import "./parametrage.css";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import PropTypes from "prop-types"; // Importer PropTypes depuis react

import ReactSelect, { components } from "react-select";
import countryList from "react-select-country-list";

const { Option } = Select;
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

const Parametrage = () => {
  const [parametrages, setParametrages] = useState([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [selectedParametrage, setSelectedParametrage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form] = Form.useForm();
  const [phonenumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [parametreStatusFilter, setParametreStatusFilter] = useState("all");
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const idProfil = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  const fetchUser = () => {
    axios
      .get("http://localhost:5000/api/users/" + idProfil)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des données de user :", error)
      );
  };

  useEffect(() => {
    fetchUser();
    console.log("user", user);
  }, [idProfil]);

  const handleParametreStatusChange = (value) => {
    setParametreStatusFilter(value);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Mise à jour de la valeur du pays lors de la sélection dans la liste déroulante
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };
  useEffect(() => {
    form.setFieldsValue({ pays: selectedCountry });
  }, [selectedCountry]);

  useEffect(() => {
    fetchParametrages();
  }, [searchQuery]);

  const fetchParametrages = async () => {
    try {
      let url = "http://localhost:5000/api/parametrage";
      if (searchQuery) {
        url += `/search/${searchQuery}`;
      }
      const response = await axios.get(url);
      let filteredParametrages = response.data;
      if (role === "financier") {
        filteredParametrages = response.data.filter(
          (parametrage) => parametrage.status === true
        );
      }
      setParametrages(filteredParametrages);
    } catch (error) {
      console.error("Erreur lors de la récupération des paramétrages :", error);
    }
  };

  const handleAddParametrage = async (values) => {
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
      const response = await axios.post(
        "http://localhost:5000/api/parametrage/company",
        values
      );

      if (response.status === 201) {
        fetchParametrages();
        setVisibleDrawer(false);
        message.success("Paramétrage ajouté avec succès !");

        form.resetFields(); // Réinitialiser le formulaire après 50 secondes
      } else {
        console.error(
          "Erreur lors de l'ajout du paramétrage : Statut de réponse inattendu",
          response.status
        );
        message.error(
          "Erreur lors de l'ajout du paramétrage. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du paramétrage :", error);
      message.error(
        "Erreur lors de l'ajout du paramétrage. Veuillez réessayer."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/parametrage/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: false }),
        }
      );
      if (response.ok) {
        message.success("Les données ont été supprimées avec succès");
        fetchParametrages();
      } else {
        throw new Error("Échec de la suppression des données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Échec de la suppression des données");
    }
  };

  const handleUpdateParametrage = async (values) => {
    try {
      await form.validateFields();

      // Créer une copie des valeurs pour éviter les modifications indésirées
      const updatedValues = { ...values };
      updatedValues.status = status;

      // Formater le numéro de téléphone uniquement pour le paramétrage sélectionné
      if (selectedParametrage && selectedParametrage._id === values._id) {
        const formattedPhoneNumber = `+${countryCode} ${phonenumber}`;

        // Vérifier si le code de pays est répété dans le numéro de téléphone
        const phoneNumberWithoutRepeatedCountryCode =
          formattedPhoneNumber.replace(new RegExp(`\\+${countryCode} `), "+");

        // Ajouter un espace entre le code de pays et le numéro
        updatedValues.phonenumber = phoneNumberWithoutRepeatedCountryCode;
      }

      // Ajouter le pays sélectionné aux valeurs
      updatedValues.pays = selectedCountry ? selectedCountry.label : "";

      // Envoyer la requête PUT pour mettre à jour le paramétrage spécifique
      const response = await axios.put(
        `http://localhost:5000/api/parametrage/${selectedParametrage._id}`,
        updatedValues
      );

      if (response.status === 200) {
        fetchParametrages(); // Actualiser la liste des paramétrages
        setVisibleDrawer(false); // Cacher le formulaire de modification
        message.success("Paramétrage mis à jour avec succès !");
        form.resetFields(); // Réinitialiser les champs du formulaire
        setSelectedCountry(null); // Réinitialiser le pays sélectionné
      } else {
        console.error(
          "Erreur lors de la mise à jour du paramétrage : Statut de réponse inattendu",
          response.status
        );
        message.error(
          "Erreur lors de la mise à jour du paramétrage. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paramétrage :", error);
      message.error(
        "Erreur lors de la mise à jour du paramétrage. Veuillez réessayer."
      );
    }
  };

  const showDrawer = async (record) => {
    setSelectedParametrage(record);
    setIsAdding(false);
    setVisibleDrawer(true);
    setSelectedCountry(true);
    setStatus(record.status); // Mettre à jour le statut local avec le statut du paramétrage sélectionné

    // Définir les valeurs du formulaire
    form.setFieldsValue({
      ...record,
    });

    // Définir le pays sélectionné dans l'état selectedCountry
    setSelectedCountry({
      label: record.pays,
    });
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
    setSelectedParametrage(null);
    setIsAdding(false);
    setSelectedCountry(true);

    form.resetFields();
  };
  const columns = [
    role === "admin"
      ? {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: 80,
          render: (status) => (
            <Badge
              status={status ? "success" : "error"}
              text={status ? "Actif" : "Inactif"}
              style={{ fontWeight: "bold" }}
              icon={status ? <CheckOutlined /> : <StopOutlined />}
            />
          ),
          sorter: (a, b) => a.status - b.status,
        }
      : null,
    {
      title: "M.F",
      dataIndex: "matriculefiscal",
      key: "matriculefiscal",
    },
    {
      title: "Entreprise",
      dataIndex: "nomEntreprise",
      key: "nomEntreprise",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Numéro de Téléphone",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },

    { title: "Pays", dataIndex: "pays", key: "pays" },

    {
      title: "Adresse",
      dataIndex: "adresseEntreprise",
      key: "adresseEntreprise",
    },

    { title: "Ville", dataIndex: "ville", key: "ville" },
    { title: "Code Postale", dataIndex: "codePostal", key: "codePostal" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showDrawer(record)}
            style={{
              backgroundColor: "#1890ff", // Couleur de fond bleue
              border: "none", // Supprimer la bordure
              borderRadius: "40%", // Coins arrondis
              width: "45px",
            }}
          ></Button>

          {role === "financier" && (
            <Popconfirm
              title="Êtes-vous sûr de vouloir désactiver ce paramètre ?"
              onConfirm={() => handleDelete(record._id)}
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
          )}
        </Space>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="parametrage-management-container" style={{ marginTop: 30 }}>
      <Tabs
        defaultActiveKey="1"
        style={{ width: "100%" }}
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
                setVisibleDrawer(true);
                setIsAdding(true);
              }}
              icon={<PlusOutlined style={{ fontSize: 18 }} />}
              style={{
                display: "flex",
                alignItems: "center",
                height: 35,
                paddingLeft: 10,
                paddingRight: 5,
                borderRadius: 5,
                width: "190px",
                backgroundColor: "#232492", // Couleur de fond personnalisée
                border: "none",

                color: "#fff", // Couleur du texte
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: 14, marginTop: -3 }}>
                Ajouter une entreprise
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
                  fontFamily: "Poppins",
                  fontSize: 15,
                  color: "#342f2f",
                }}
              >
                Fiche Entreprise
              </span>
            </div>
          }
          key="1"
        >
          {role === "admin" && (
            <Select
              defaultValue="all"
              style={{
                width: 150,
                marginBottom: 20,
                backgroundColor: "#f0f2f5",
                fontFamily: "Arial, sans-serif",
              }}
              onChange={handleParametreStatusChange}
            >
              <Option value="all">Tous</Option>
              <Option value="activated">Activé</Option>
              <Option value="inactivated">Désactivé</Option>
            </Select>
          )}

          <Table
            dataSource={parametrages.filter(
              (item) =>
                parametreStatusFilter === "all" ||
                item.status === (parametreStatusFilter === "activated")
            )}
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
        title={
          isAdding
            ? "Ajouter un paramètre de l'entreprise"
            : "Modifier un paramètre de l'entreprise "
        }
        width={700}
        onClose={onCloseDrawer}
        visible={visibleDrawer}
        destroyOnClose
      >
        <Form
          form={form}
          onFinish={isAdding ? handleAddParametrage : handleUpdateParametrage}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="matriculefiscal"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le matricule fiscale",
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
                  placeholder="Matricule Fiscale"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nomEntreprise"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le nom de l'entreprise",
                  },
                ]}
              >
                <Input
                  placeholder="Nom de l'entreprise"
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
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                style={{ marginLeft: 5 }}
                name="email"
                className="form-item"
                rules={[
                  {
                    required: true,

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
            <Col span={12}>
              <Form.Item
                style={{ marginTop: 10 }}
                name="phonenumber"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le numéro de téléphone  ",
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
                    width: "220px",
                    marginLeft: "50px",
                    fontFamily: "Poppins",
                    fontWeight: "normal",
                    color: "#5f5e5e",
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
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
                style={{ marginTop: 12 }}
                name="adresseEntreprise"
                rules={[
                  { required: true, message: "Veuillez saisir l'adresse" },
                ]}
              >
                <Input
                  placeholder="Adresse"
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
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                style={{ marginLeft: 5 }}
                name="ville"
                rules={[
                  { required: true, message: "Veuillez saisir la ville" },
                ]}
              >
                <Input
                  placeholder="Ville"
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
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="codePostal"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le code postal",
                  },
                ]}
              >
                <Input
                  placeholder="Code Postale"
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
                />
              </Form.Item>
            </Col>
          </Row>
          {!isAdding && (
            // Dans le retour de votre composant Parametrage
            <Row>
              <Col span={24}>
                {role === "admin" && (
                  <Form.Item
                    name="status"
                    label="Statut"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner le statut!",
                      },
                    ]}
                    initialValue={false}
                  >
                    <Switch
                      checked={status}
                      onChange={(checked) => setStatus(checked)}
                      checkedChildren="Activé"
                      unCheckedChildren="Désactivé"
                      checkedColor="#52c41a" // Vert pour Activé
                      unCheckedColor="#f5222d" // Rouge pour Désactivé
                      style={{ fontSize: 16 }}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              onClick={onCloseDrawer}
              style={{
                marginRight: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "90px",
                height: "28px",
              }}
            >
              Annuler
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "90px",
                height: "28px",
              }}
            >
              {isAdding ? "Ajouter" : "Modifier"}
            </Button>
          </div>
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

export default Parametrage;
