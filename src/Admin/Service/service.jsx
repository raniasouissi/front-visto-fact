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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const ServiceList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [clients, setClients] = useState([]);
  const [tvaList, setTvaList] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [devise, setDevise] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDevise, setSelectedDevise] = useState(null);
  const [editingService, setEditingService] = useState(null);

  // Fonction de gestionnaire de changement de devise
  const handleDeviseChange = (value) => {
    if (value) {
      const selected = devise.find((dev) => dev._id === value);
      setSelectedDevise(selected);
    } else {
      setSelectedDevise(null); // Si aucune devise n'est sélectionnée, réinitialiser selectedDevise à null
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des services :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
    }
  };

  const fetchTvaList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tva");
      setTvaList(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la TVA :", error);
    }
  };

  const fetchDevise = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/devise");
      setDevise(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des devises :", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categorie");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  useEffect(() => {
    fetchDevise();
    fetchCategories();
    fetchClients();
    fetchTvaList();
    fetchServices();
  }, []);

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
      clientId: record.client?._id,
      categoriesId: record.categories?._id,
      quantite: record.quantite,
      prix_unitaire: record.prix_unitaire,
      montant_HT: record.montant_HT,
      tvaId: record.tva?._id,
      deviseId: record.devise?._id,
      montant_TTC: record.montant_TTC,
    });
  };

  const calculateTTC = (montantHT, tvaId) => {
    const selectedTva = tvaList.find((tva) => tva._id === tvaId);

    if (!selectedTva || !montantHT) {
      console.error("TVA non trouvée ou Montant HT invalide");
      form.setFieldsValue({ montant_TTC: null });
      return;
    }

    const tvaRate = selectedTva.rate;

    const montantTTC = montantHT * (1 + tvaRate / 100);

    form.setFieldsValue({
      montant_TTC: montantTTC.toFixed(2),
    });

    // Envoi du montant TTC au backend
    form.setFieldsValue({
      montant_TTC_backend: montantTTC.toFixed(2),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      message.success("Service supprimé avec succès !");
      fetchServices(); // Fetch updated list after deletion
    } catch (error) {
      console.error("Erreur lors de la suppression du service :", error);
    }
  };

  const columns = [
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
      title: "Client",
      dataIndex: ["client", "name"],
      key: "client_name",
    },
    {
      title: "Catégorie",
      dataIndex: ["categories", "titre"],
      key: "categories_titre",
    },
    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
    },
    {
      title: "Prix unitaire",
      dataIndex: "prix_unitaire",
      key: "prix_unitaire",
    },
    {
      title: "Montant HT",
      dataIndex: "montant_HT",
      key: "montant_HT",
    },
    {
      title: "Montant TTC",
      dataIndex: "montant_TTC",
      key: "montant_TTC",
    },

    {
      title: "Devise",
      dataIndex: "devise",
      key: "devise_name",
      render: (devise) => `${devise.name} (${devise.symbole})`,
    },
    {
      title: "TVA",
      dataIndex: "tva",
      key: "tva_rate",
      render: (tva) => <span>{tva ? tva.rate + "%" : ""}</span>,
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
            />
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        icon={<PlusOutlined />}
        style={{ float: "right", backgroundColor: "#022452" }}
      >
        Nouveau service
      </Button>
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
                name="clientId"
                label="Client"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un client !",
                  },
                ]}
              >
                <Select placeholder="Sélectionnez un client">
                  {clients.map((client) => (
                    <Option key={client._id} value={client._id}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: 8 }}>{client.name}</div>
                        <div style={{ fontSize: 12, color: "#999" }}>
                          {client.email}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
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
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="quantite"
                label="Quantité"
                rules={[
                  { required: true, message: "Veuillez entrer la quantité !" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Entrez la quantité"
                  onChange={(value) => {
                    const prixUnitaire = form.getFieldValue("prix_unitaire");
                    const montantHT =
                      value && prixUnitaire ? value * prixUnitaire : 0;
                    form.setFieldsValue({
                      montant_HT: montantHT.toFixed(2),
                    });
                    calculateTTC();
                  }}
                />
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
                  onChange={(value) => {
                    const quantite = form.getFieldValue("quantite");
                    const montantHT = quantite && value ? quantite * value : 0;
                    form.setFieldsValue({
                      montant_HT: montantHT.toFixed(2),
                    });
                    calculateTTC();
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="montant_HT"
                label={`Montant HT ${
                  selectedDevise
                    ? `(${selectedDevise.name} - ${selectedDevise.symbole})`
                    : ""
                }`}
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le montant HT !",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Montant HT"
                  onChange={(value) => {
                    form.setFieldsValue({ montant_HT: value });
                    calculateTTC(value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tvaId"
                label="TVA"
                rules={[
                  { required: true, message: "Veuillez sélectionner une TVA" },
                ]}
              >
                <Select
                  placeholder="Sélectionnez une TVA"
                  onChange={(value) => {
                    calculateTTC(form.getFieldValue("montant_HT"), value);
                  }}
                >
                  {tvaList.map((tva) => (
                    <Option key={tva._id} value={tva._id}>
                      {`${tva.rate}%`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="montant_TTC"
                label={`Montant TTC ${
                  selectedDevise
                    ? `(${selectedDevise.name} - ${selectedDevise.symbole})`
                    : ""
                }`}
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le montant TTC !",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Montant TTC"
                  readOnly
                />
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
        </Form>
      </Modal>

      <Table
        style={{ marginTop: "80px" }}
        columns={columns}
        dataSource={services}
        loading={loading}
      />
    </>
  );
};

export default ServiceList;
