import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  message,
  Space,
  Popconfirm,
  Switch,
  Row,
  Col,
  Select,
  Badge,
} from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
  EditOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Option } from "antd/es/mentions";

const Devise = () => {
  const [deviseData, setDeviseData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editItem, setEditItem] = useState(null);

  const [deviseStatusFilter, setDeviseStatusFilter] = useState("all");
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

  const handleDeviseStatusChange = (value) => {
    setDeviseStatusFilter(value);
  };

  useEffect(() => {
    fetchDeviseData();
  }, []);

  const fetchDeviseData = () => {
    axios
      .get("http://localhost:5000/api/devise")
      .then((response) => {
        let filteredDevises = response.data;

        // Si le rôle est "financier", filtrer les devises avec un statut "true"
        if (role === "financier") {
          filteredDevises = filteredDevises.filter(
            (devise) => devise.status === true
          );
        }

        setDeviseData(filteredDevises);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des devises :", error)
      );
  };

  const handleAddOrUpdateDevise = (values) => {
    const url = editItem
      ? `http://localhost:5000/api/devise/${editItem._id}`
      : "http://localhost:5000/api/devise";
    const method = editItem ? "put" : "post";

    axios[method](url, values)
      .then(() => {
        message.success(
          `${editItem ? "Mise à jour" : "Ajout"} de la devise réussi !`
        );
        setModalVisible(false);
        fetchDeviseData();
        setTimeout(() => {
          form.resetFields(); // Réinitialiser le formulaire après 2 secondes
        }, 50000);
      })

      .catch((error) => {
        message.error(
          `Erreur lors de ${
            editItem ? "la mise à jour" : "l'ajout"
          } de la devise : ${error.message}`
        );
      });
  };

  const handleDeleteActv = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/devise/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: false }),
      });
      if (response.ok) {
        // Effectuez les actions nécessaires après la suppression réussie

        message.success("Les données ont été supprimées avec succès");
        fetchDeviseData();
      } else {
        throw new Error("Échec de la suppression des données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Échec de la suppression des données");
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
    setTimeout(() => {
      form.resetFields(); // Réinitialiser le formulaire après 2 secondes
    }, 50000);
  };

  return (
    <div>
      <Button
        type="primary"
        style={{
          float: "right",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          height: 35,
          paddingLeft: 10,
          paddingRight: 5,
          borderRadius: 5,
          width: "175px",
          backgroundColor: "#232492", // Couleur de fond personnalisée
          border: "none",

          color: "#fff",
        }}
        onClick={() => {
          setModalVisible(true);
          setEditItem(null);
        }}
        icon={<PlusOutlined style={{ fontSize: 18 }} />}
      >
        <span style={{ fontWeight: "bold", fontSize: 14 }}>Ajouter Devise</span>
      </Button>
      {role === "admin" && (
        <Select
          defaultValue="all"
          style={{
            width: 150,
            marginBottom: 20,
            backgroundColor: "#f0f2f5",
            fontFamily: "Arial, sans-serif",
          }}
          onChange={handleDeviseStatusChange}
        >
          <Option value="all">Tous</Option>
          <Option value="activated">Activé</Option>
          <Option value="inactivated">Désactivé</Option>
        </Select>
      )}
      <Table
        bordered
        pagination={{ pageSize: 10 }}
        style={{
          borderRadius: 8,
          border: "1px solid #e8e8e8",
        }}
        dataSource={deviseData.filter(
          (item) =>
            deviseStatusFilter === "all" ||
            item.status === (deviseStatusFilter === "activated")
        )}
        columns={[
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

          { title: "Nom", dataIndex: "name", key: "name" },
          { title: "Symbole", dataIndex: "symbole", key: "symbole" },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  style={{
                    backgroundColor: "#1890ff", // Couleur de fond bleue
                    border: "none", // Supprimer la bordure
                    borderRadius: "40%", // Coins arrondis
                    width: "45px",
                  }}
                ></Button>

                {role === "financier" && (
                  <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer ce devise ?"
                    onConfirm={() => handleDeleteActv(record._id)}
                    okText="Oui"
                    cancelText="Non"
                  >
                    <Button
                      type="danger"
                      icon={<CloseCircleOutlined />}
                      className="delete-icon"
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
                    ></Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ].filter(Boolean)}
      />
      <Modal
        title={`${editItem ? "Modifier" : "Ajouter"} une devise`}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditItem(null);
          form.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalVisible(false);
              setEditItem(null);
              form.resetFields();
            }}
          >
            Annuler
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={{
              backgroundColor: "#232492",
              border: "none",
            }}
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  handleAddOrUpdateDevise(values);
                })
                .catch((errorInfo) => {
                  console.log("Validation failed:", errorInfo);
                });
            }}
          >
            {editItem ? "Mettre à jour" : "Ajouter"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nom"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le nom de la devise",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="symbole"
            label="Symbole"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le symbole de la devise",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row>
            <Col span={24}>
              {editItem && role === "admin" && (
                <Form.Item
                  name="status"
                  label="Statut"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner le statut!",
                    },
                  ]}
                  initialValue={editItem ? editItem.status : false} // Utiliser editItem.status
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
        </Form>
      </Modal>
    </div>
  );
};

export default Devise;
