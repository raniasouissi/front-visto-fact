import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Space,
  Select,
  InputNumber,
  Table,
  message,
  Popconfirm,
  Badge,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Service = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [devise, setDevise] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDevise, setSelectedDevise] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [ServiceStatusFilter, setServiceStatusFilter] = useState("all");
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

  const handleServiceStatusChange = (value) => {
    setServiceStatusFilter(value);
  };

  // Fonction de gestionnaire de changement de devise
  const handleDeviseChange = (value) => {
    if (value) {
      const selected = devise.find((dev) => dev._id === value);
      setSelectedDevise(selected);
    } else {
      setSelectedDevise(null); // Si aucune devise n'est sélectionnée, réinitialiser selectedDevise à null
    }
  };
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const fetchServices = () => {
    setLoading(true);
    let url = "http://localhost:5000/api/services";
    if (searchQuery) {
      url += `/search/${searchQuery}`;
    }

    axios
      .get(url)
      .then((response) => {
        let services = response.data.filter((e) => e.categories != null);

        // Log avant le filtre
        console.log("Services avant le filtre :", services);

        // Si le rôle est "financier", filtrer les services avec un statut "true"
        if (role === "financier") {
          services = services.filter((service) => service.status === true);
        }

        // Log après le filtre
        console.log("Services après le filtre :", services);

        // Mettre à jour l'état services avec les éléments filtrés
        setServices(services);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des services :", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchDevise = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/devise");
      const filteredDevise = response.data.filter(
        (devise) => devise.status === true
      );
      setDevise(filteredDevise);
    } catch (error) {
      console.error("Erreur lors de la récupération des devises :", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categorie");
      // Filtrer les catégories avec le statut "true"
      const filteredCategories = response.data.filter(
        (category) => category.status === true
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  useEffect(() => {
    fetchDevise();
    fetchCategories();
    fetchServices();
  }, [searchQuery]); // Ajoutez searchQuery comme dépendance

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedDevise(null); // Réinitialiser selectedDevise à null
    setEditingService(null); // Réinitialiser editingServiceId à null
  };

  const onFinish = async (values) => {
    try {
      let response;
      if (editingService) {
        // Si un service est en cours d'édition, mettre à jour ce service
        response = await axios.put(
          `http://localhost:5000/api/services/${editingService._id}`,
          values
        );
      } else {
        // Sinon, créer un nouveau service
        response = await axios.post(
          "http://localhost:5000/api/services",
          values
        );
      }

      if (response.status === 201 || response.status === 200) {
        form.resetFields();
        setSelectedDevise(null);
        setEditingService(null);
        message.success(
          editingService
            ? "Service mis à jour avec succès !"
            : "Service créé avec succès !"
        );
        setModalVisible(false);
        fetchServices();
      } else {
        throw new Error(
          `Échec de ${
            editingService ? "la mise à jour" : "la création"
          } du service.`
        );
      }
    } catch (error) {
      console.error(
        `Erreur lors de ${
          editingService ? "la mise à jour" : "la création"
        } du service :`,
        error
      );
    }
  };

  const handleEdit = async (record) => {
    setEditingService(record); // Enregistrer le service en cours d'édition dans l'état local
    setModalVisible(true); // Afficher le modal
    form.setFieldsValue({
      // Pré-remplir les champs du formulaire avec les détails du service en cours d'édition
      reference: record.reference,
      libelle: record.libelle,
      categoriesId: record.categories?._id,

      prix_unitaire: record.prix_unitaire,
      deviseId: record.devise?._id,
      status: record.status, // Ajoutez cette ligne pour pré-remplir le champ de statut
    });
  };

  const handleDeleteFin = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: false }),
      });
      if (response.ok) {
        message.success("Les données ont été supprimées avec succès");
        fetchServices();
      } else {
        throw new Error("Échec de la suppression des données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Échec de la suppression des données");
    }
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
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Désignation",
      dataIndex: "libelle",
      key: "libelle",
    },

    {
      title: "Catégorie",
      dataIndex: ["categories", "titre"],
      key: "categories_titre",
    },
    {
      title: "Unité",
      dataIndex: "unite",
      key: "unite",
    },
    {
      title: "Prix unitaire",
      dataIndex: "prix_unitaire",
      key: "prix_unitaire",
    },

    {
      title: "Devise",
      dataIndex: "devise",
      key: "devise_name",
      render: (devise) => `${devise.name} (${devise.symbole})`,
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Space style={{ float: "left" }}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{
                backgroundColor: "#1890ff", // Couleur de fond bleue
                border: "none", // Supprimer la bordure
                borderRadius: "40%", // Coins arrondis
                color: "white",
                width: "45px",
              }}
            />

            {role === "financier" && (
              <Popconfirm
                title="Êtes-vous sûr de vouloir  désactiver ce service ?"
                onConfirm={() => handleDeleteFin(record._id)}
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
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <div style={{ float: "right", alignItems: "center" }}>
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
          onClick={() => setModalVisible(true)}
          icon={<PlusOutlined />}
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
            float: "right",
            color: "#fff", // Couleur du texte
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 14 }}>
            Nouveau Service
          </span>
        </Button>
      </div>

      <div style={{ marginTop: 40 }}>
        {role === "admin" && (
          <Select
            defaultValue="all"
            style={{
              width: 150,
              backgroundColor: "#f0f2f5",
              fontFamily: "Arial, sans-serif",
            }}
            onChange={handleServiceStatusChange}
          >
            <Option value="all">Tous</Option>
            <Option value="activated">Activé</Option>
            <Option value="inactivated">Désactivé</Option>
          </Select>
        )}
      </div>

      <Modal
        title={
          <div
            style={{
              color: "#0a0a85",
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {editingService
              ? "Modifier un service"
              : "Ajouter un nouveau service"}
          </div>
        }
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Annuler
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: "#0a0a85" }}
            onClick={() => form.submit()}
          >
            {editingService
              ? "Modifier le service"
              : "Ajouter un nouveau service"}
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 10 }}
          initialValues={editingService || {}} // Pré-remplir le formulaire avec les détails du service en cours d'édition
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="reference"
                label="Référence"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer la référence !",
                  },
                ]}
              >
                <Input placeholder="Entrez la référence" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="libelle"
                label="Désignation"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer la désignation !",
                  },
                ]}
              >
                <Input placeholder="Entrez la désignation" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="categoriesId"
                label="Catégorie"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une catégorie !",
                  },
                ]}
              >
                <Select placeholder="Sélectionnez une catégorie">
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.titre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="prix_unitaire"
                label={
                  selectedDevise
                    ? `Prix unitaire (${selectedDevise.name} - ${selectedDevise.symbole})`
                    : "Prix unitaire"
                }
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le prix unitaire !",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Entrez le prix unitaire"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="unite"
                label="Unité"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une unité !",
                  },
                ]}
              >
                <Select
                  placeholder="Sélectionnez une unité"
                  style={{ width: "100%" }}
                >
                  <Option value="heure">Heure</Option>
                  <Option value="jour">Jour</Option>
                  <Option value="semaine">Semaine</Option>
                  <Option value="mois">Mois</Option>
                  <Option value="année">Année</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviseId"
                label="Devise"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une devise !",
                  },
                ]}
              >
                <Select
                  placeholder="Sélectionnez une devise"
                  onChange={handleDeviseChange}
                >
                  {devise.map((dev) => (
                    <Option key={dev._id} value={dev._id}>
                      {`${dev.name} (${dev.symbole})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              {editingService && role === "admin" && (
                <Form.Item
                  name="status"
                  label="Statut"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner le statut!",
                    },
                  ]}
                >
                  <Switch
                    checked={status}
                    onChange={(checked) => setStatus(checked)}
                    checkedChildren="Activé"
                    unCheckedChildren="Désactivé"
                    checkedColor="#52c41a"
                    unCheckedColor="#f5222d"
                    style={{ fontSize: 16 }}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>

      <Table
        columns={columns}
        dataSource={services.filter(
          (item) =>
            ServiceStatusFilter === "all" ||
            item.status === (ServiceStatusFilter === "activated")
        )}
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
        style={{
          marginTop: "60px",
          borderRadius: 8,
          border: "1px solid #e8e8e8",
        }}
      />
    </>
  );
};

export default Service;
