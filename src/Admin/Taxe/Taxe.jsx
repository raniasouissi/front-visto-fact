import React, { useState, useEffect } from "react";
import {
  Tabs,
  Table,
  Modal,
  Form,
  Input,
  Button,
  message,
  Popconfirm,
  Space,
  Select,
  Switch,
  Badge,
} from "antd";
import axios from "axios";
import {
  PlusOutlined,
  CloseCircleOutlined,
  EditOutlined,
  CheckOutlined,
  StopOutlined
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const { TabPane } = Tabs;

const Taxe = () => {
  const [tvaData, setTvaData] = useState([]);
  const [timbreData, setTimbreData] = useState([]);
  const [selectedTaxe, setSelectedTaxe] = useState("tva");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editItem, setEditItem] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusT, setStatusT] = useState(null);
  const [TvaStatusFilter, setTvaStatusFilter] = useState("all");
  const [TimbreStatusFilter, setTimbreStatusFilter] = useState("all");

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

  const handleTvaStatusChange = (value) => {
    setTvaStatusFilter(value);
  };

  const handleTimbreStatusChange = (value) => {
    setTimbreStatusFilter(value);
  };

  useEffect(() => {
    fetchTvaData();
    fetchTimbreData();
  }, []);

  const fetchTvaData = () => {
    axios
      .get("http://localhost:5000/api/tva")
      .then((response) => {
        // Filtrer les données de TVA pour ne conserver que celles avec un statut true
        let filteredTva = response.data;

        if (role === "financier") {
          filteredTva = filteredTva.filter((item) => item.status === true);
        }

        setTvaData(filteredTva);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des données de TVA :", error)
      );
  };

  const fetchTimbreData = () => {
    axios
      .get("http://localhost:5000/api/timbre")
      .then((response) => {
        // Filtrer les données de timbre pour ne conserver que celles avec un statut true
        let filteredTimbres = response.data;

        if (role === "financier") {
          filteredTimbres = filteredTimbres.filter(
            (item) => item.status === true
          );
        }

        setTimbreData(filteredTimbres);
      })
      .catch((error) =>
        console.error(
          "Erreur lors du chargement des données de timbre :",
          error
        )
      );
  };

  const handleAddOrUpdateTaxe = (values) => {
    const endpoint = selectedTaxe === "tva" ? "tva" : "timbre";
    const url = editItem
      ? `http://localhost:5000/api/${endpoint}/${editItem._id}`
      : `http://localhost:5000/api/${endpoint}`;
    const method = editItem ? "put" : "post";

    axios[method](url, values)
      .then(() => {
        message.success(
          `${selectedTaxe.toUpperCase()} ${
            editItem ? "mis à jour" : "ajouté"
          } avec succès !`
        );
        setModalVisible(false);
        if (selectedTaxe === "tva") {
          fetchTvaData();
        } else {
          fetchTimbreData();
        }
        setTimeout(() => {
          form.resetFields();
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          message.error("Erreur lors de l'ajout. Veuillez réessayer.");
        } else {
          message.error(
            `Erreur lors de ${
              editItem ? "la mise à jour" : "l'ajout"
            } de ${selectedTaxe.toUpperCase()} : ${error.message}`
          );
        }
      });
  };

  const handleDeleteTvad = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tva/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: false }),
      });
      if (response.ok) {
        // Effectuez les actions nécessaires après la suppression réussie
        fetchTvaData();
        message.success("Les données ont été supprimées avec succès");
      } else {
        throw new Error("Échec de la suppression des données");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression des données:", error);
      message.error("Échec de la suppression des données");
    }
  };

  const handleDeleteTimbred = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/timbre/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: false }),
      });
      if (response.ok) {
        // Effectuez les actions nécessaires après la suppression réussie
        fetchTimbreData();
        message.success("Les données ont été supprimées avec succès");
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
    if (record.taxe === "tva") {
      setSelectedTaxe("tva");
      setStatus(record.status);
      setStatusT(null);
    } else if (record.taxe === "timbre") {
      setSelectedTaxe("timbre");
      setStatus(null);
      setStatusT(record.status);
    }
    setModalVisible(true);
    form.setFieldsValue(record);

    setTimeout(() => {
      form.resetFields();
    }, 50000);
  };

  const handleTaxeChange = (value) => {
    setSelectedTaxe(value);
    setEditItem(null);
    form.resetFields();
  };

  return (
    <div>
      <Tabs
        defaultActiveKey="tva"
        activeKey={selectedTaxe}
        onChange={handleTaxeChange}
        tabBarExtraContent={
          <Button
            onClick={() => {
              setModalVisible(true);
              setEditItem(null);
            }}
            icon={<PlusOutlined />}
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
              Ajouter taxe
            </span>
          </Button>
        }
      >
        <TabPane tab="TVA" key="tva">
          {role === "admin" && (
            <Select
              defaultValue="all"
              style={{ width: 150, marginBottom: 20 }}
              onChange={handleTvaStatusChange}
            >
              <Option value="all">Tous</Option>
              <Option value="activated">Activé</Option>
              <Option value="inactivated">Désactivé</Option>
            </Select>
          )}
          <Table
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
            }}
            bordered
            pagination={{ pageSize: 10 }}
            dataSource={tvaData.filter(
              (item) =>
                TvaStatusFilter === "all" ||
                item.status === (TvaStatusFilter === "activated")
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
              {
                title: "Taux de TVA",
                dataIndex: "rate",
                key: "rate",
                render: (rate) => `${rate.toFixed(2)}%`,
              },
              {
                title: "Action",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
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
                        title="Êtes-vous sûr de vouloir supprimer cette TVA ?"
                        onConfirm={() => handleDeleteTvad(record._id)}
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
        </TabPane>
        <TabPane tab="Timbre Fiscal" key="timbre">
          {role === "admin" && (
            <Select
              defaultValue="all"
              style={{ width: 150, marginBottom: 20 }}
              onChange={handleTimbreStatusChange}
            >
              <Option value="all">Tous</Option>
              <Option value="activated">Activé</Option>
              <Option value="inactivated">Désactivé</Option>
            </Select>
          )}
          <Table
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
            }}
            bordered
            pagination={{ pageSize: 10 }}
            dataSource={timbreData.filter(
              (item) =>
                TimbreStatusFilter === "all" ||
                item.status === (TimbreStatusFilter === "activated")
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
                        dot
                        style={{ backgroundColor: status ? "green" : "red" }}
                      />
                    ),
                  }
                : null,

              {
                title: "Valeur",
                dataIndex: "value",
                key: "value",
              },

              {
                title: "Action",
                dataIndex: "action",
                key: "action",
                render: (text, record) => (
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
                        title="Êtes-vous sûr de vouloir supprimer ce timbre ?"
                        onConfirm={() => handleDeleteTimbred(record._id)}
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
        </TabPane>
      </Tabs>

      <Modal
        title={`${editItem ? "Modifier" : "Ajouter"} ${
          selectedTaxe === "tva" ? "TVA" : "Timbre"
        }`}
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
            style={{ backgroundColor: "#232492", border: "none" }}
            key="submit"
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => {
                  handleAddOrUpdateTaxe(values);
                })
                .catch((info) => {
                  console.log("Validation failed:", info);
                });
            }}
          >
            {editItem ? "Mettre à jour" : "Ajouter"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ padding: "20px", background: "transparent" }}
          initialValues={{ taxe: selectedTaxe }}
        >
          {selectedTaxe === "tva" ? (
            <>
              <Form.Item
                name="rate"
                label="Taux de TVA"
                rules={[
                  { required: true, message: "Veuillez saisir la valeur " },
                ]}
              >
                <Input addonAfter="%" />
              </Form.Item>
              {editItem && selectedTaxe === "tva" && role === "admin" && (
                <Form.Item
                  name="status"
                  label="Statut"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner le statut!",
                    },
                  ]}
                  initialValue={status}
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
            </>
          ) : (
            selectedTaxe === "timbre" && (
              <Form.Item
                name="value"
                label="Valeur"
                rules={[
                  { required: true, message: "Veuillez saisir la valeur" },
                ]}
              >
                <Input />
              </Form.Item>
            )
          )}

          {editItem && selectedTaxe === "timbre" && role === "admin" && (
            <Form.Item
              name="status"
              label="Statut"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner le statut!",
                },
              ]}
              initialValue={statusT}
            >
              <Switch
                checked={statusT}
                onChange={(checked) => setStatusT(checked)}
                checkedChildren="Activé"
                unCheckedChildren="Désactivé"
                checkedColor="#52c41a"
                unCheckedColor="#f5222d"
                style={{ fontSize: 16 }}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Taxe;
