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
  Badge,
  Select,
  Switch,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Categorie = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editItem, setEditItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [CategorieStatusFilter, setCategorieStatusFilter] = useState("all");
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const { Option } = Select;
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

  const handleCategorieStatusChange = (value) => {
    setCategorieStatusFilter(value);
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const fetchCategories = async () => {
    try {
      let url = "http://localhost:5000/api/categorie";
      if (searchQuery) {
        url += `/search/${searchQuery}`;
      }
      const response = await axios.get(url);
      let filteredCategories = response.data;
      if (role === "financier") {
        filteredCategories = response.data.filter(
          (category) => category.status === true
        );
      }
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const handleAddOrUpdateCategorie = (values) => {
    const url = editItem
      ? `http://localhost:5000/api/categorie/${editItem._id}`
      : "http://localhost:5000/api/categorie";
    const method = editItem ? "put" : "post";

    axios[method](url, values)
      .then(() => {
        message.success(
          `${editItem ? "Mise à jour" : "Ajout"} de la catégorie réussi !`
        );
        setModalVisible(false);
        fetchCategories();
        form.resetFields();
      })
      .catch((error) => {
        message.error(
          `Erreur lors de ${
            editItem ? "la mise à jour" : "l'ajout"
          } de la catégorie : ${error.message}`
        );
      });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/categorie/${id}`,
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
        fetchCategories();
      } else {
        throw new Error("Échec de la suppression des données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Échec de la suppression des données");
    }
  };

  const handleEditCategorie = (record) => {
    setStatus(record.status); // Mettre à jour le statut local avec le statut du paramétrage sélectionné
    setEditItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 16,
          width: "100%",
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: "#8f8fa1" }} />}
          placeholder="Rechercher ..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: 250,
            height: 35,
            borderRadius: 10,
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            marginRight: 10,
          }}
        />

        <Button
          type="primary"
          style={{
            height: 35,
            paddingLeft: 10,
            paddingRight: 5,
            borderRadius: 5,
            width: "175px",
            backgroundColor: "#232492",
            border: "none",
            color: "#fff",
          }}
          onClick={() => {
            setModalVisible(true);
            setEditItem(null);
          }}
          icon={<PlusOutlined />}
        >
          <span style={{ fontWeight: "bold", fontSize: 14 }}>
            Ajouter Catégorie
          </span>
        </Button>
      </div>
      {role === "admin" && (
        <Select
          defaultValue="all"
          style={{
            width: 150,
            marginBottom: 20,
            backgroundColor: "#f0f2f5",
            fontFamily: "Arial, sans-serif",
          }}
          onChange={handleCategorieStatusChange}
        >
          <Option value="all">Tous</Option>
          <Option value="activated">Activé</Option>
          <Option value="inactivated">Désactivé</Option>
        </Select>
      )}
      <Table
        dataSource={categories.filter(
          (item) =>
            CategorieStatusFilter === "all" ||
            item.status === (CategorieStatusFilter === "activated")
        )}
        bordered
        pagination={{ pageSize: 10 }}
        style={{
          borderRadius: 8,
          border: "1px solid #e8e8e8",
        }}
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
          { title: "Titre", dataIndex: "titre", key: "titre" },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEditCategorie(record)}
                  style={{
                    backgroundColor: "#1890ff", // Couleur de fond bleue
                    border: "none", // Supprimer la bordure
                    borderRadius: "40%", // Coins arrondis
                    width: "45px",
                  }}
                ></Button>

                {role === "financier" && (
                  <Popconfirm
                    title="Êtes-vous sûr de vouloir désactiver  cette catégorie ?"
                    onConfirm={() => handleDelete(record._id)}
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
                    >
                      {" "}
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ].filter(Boolean)}
      />
      <Modal
        title={`${editItem ? "Modifier" : "Ajouter"} une catégorie`}
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
            style={{ backgroundColor: "#232492", border: "none" }}
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  handleAddOrUpdateCategorie(values);
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
            name="titre"
            label="Titre"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le titre de la catégorie",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Veuillez saisir la description de la catégorie",
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
                  initialValue={editItem.status}
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

export default Categorie;
