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
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/services",
        values
      );
      if (response.status === 201) {
        form.resetFields();
        message.success("Service créé avec succès !");
        setModalVisible(false);
        fetchServices();
      } else {
        throw new Error("Échec de la création du service.");
      }
    } catch (error) {
      console.error("Erreur lors de la création du service :", error);
    }
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

  const columns = [
    {
      title: "Ref",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Désignation",
      dataIndex: "libelle",
      key: "libelle",
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
      title: "Client",
      dataIndex: ["client", "name"],
      key: "client_name",
    },
    {
      title: "TVA",
      dataIndex: "tva",
      key: "tva_rate",
      render: (tva) => <span>{tva ? tva.rate + "%" : ""}</span>,
    },
    {
      title: "Devise",
      dataIndex: "devise",
      key: "devise_name",
      render: (devise) => `${devise.name} (${devise.symbole})`,
    },
    {
      title: "Catégories",
      dataIndex: ["categories", "titre"],
      key: "categories_titre",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      key: "actions",
      render: (_, record) => (
        <>
          <Space style={{ float: "left" }}>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Êtes-vous sûr de vouloir supprimer ce service ?"
              onConfirm={() => handleDelete(record._id)}
              okText="Oui"
              cancelText="Non"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>{" "}
          </Space>
        </>
      ),
    },
  ];

  const handleEdit = (record) => {
    console.log("Modification du service :", record);
  };

  const handleDelete = async (serviceId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/services/${serviceId}`
      );
      if (response.status === 200) {
        fetchServices();
        message.success("Service supprimé avec succès !");
      } else {
        throw new Error("Échec de la suppression du service.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du service :", error);
    }
  };

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
            Ajouter un nouveau service
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
            Ajouter
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 10 }}
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
                label="Catégories"
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
                label={`Prix unitaire ${
                  selectedDevise
                    ? `(${selectedDevise.name} - ${selectedDevise.symbole})`
                    : ""
                }`}
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
                  defaultValue="663520018fd0c36ddc4fbdb4"
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
