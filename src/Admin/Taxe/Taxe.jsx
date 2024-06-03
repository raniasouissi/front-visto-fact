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
} from "antd";
import axios from "axios";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const Taxe = () => {
  const [tvaData, setTvaData] = useState([]);
  const [timbreData, setTimbreData] = useState([]);
  const [selectedTaxe, setSelectedTaxe] = useState("tva"); // Utilisez cette variable pour suivre l'onglet sélectionné
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchTvaData();
    fetchTimbreData();
  }, []);

  const fetchTvaData = () => {
    axios
      .get("http://localhost:5000/api/tva")
      .then((response) => setTvaData(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des données de TVA :", error)
      );
  };

  const fetchTimbreData = () => {
    axios
      .get("http://localhost:5000/api/timbre")
      .then((response) => setTimbreData(response.data))
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
          fetchTvaData(); // Mettre à jour les données de TVA si l'onglet actif est TVA
        } else {
          fetchTimbreData(); // Mettre à jour les données de timbre si l'onglet actif est Timbre
        }
        setTimeout(() => {
          form.resetFields(); // Réinitialiser le formulaire après 2 secondes
        }, 2000);
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          message.error("Erreur lors de l'ajout . Veuillez réessayer.");
        } else {
          message.error(
            `Erreur lors de ${
              editItem ? "la mise à jour" : "l'ajout"
            } de ${selectedTaxe.toUpperCase()} : ${error.message}`
          );
        }
      });
  };

  const handleDeleteTva = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tva/${id}`);
      fetchTvaData();
      message.success("TVA supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la TVA :", error);
      message.error(
        "Erreur lors de la suppression de la TVA. Veuillez réessayer."
      );
    }
  };

  const handleDeleteTimbre = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/timbre/${id}`);
      fetchTimbreData();
      message.success("Timbre supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du timbre :", error);
      message.error(
        "Erreur lors de la suppression du timbre. Veuillez réessayer."
      );
    }
  };

  const handleEdit = (record) => {
    setEditItem(record);
    if (record.taxe === "tva") {
      setSelectedTaxe("tva");
    } else if (record.taxe === "timbre") {
      setSelectedTaxe("timbre");
    }
    setModalVisible(true);
    form.setFieldsValue(record);

    setTimeout(() => {
      form.resetFields(); // Réinitialiser le formulaire après 2 secondes
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
        defaultActiveKey="1"
        activeKey={selectedTaxe} // Utilisez l'onglet sélectionné comme clé active
        onChange={handleTaxeChange} // Gérer le changement d'onglet
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
              width: "175px",
              backgroundColor: "#232492", // Couleur de fond personnalisée
              border: "none",
              float: "right",
              color: "#fff", // Couleur du texte
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: 14 }}>
              Ajouter taxe
            </span>
          </Button>
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
                TVA
              </span>
            </div>
          }
          key="tva"
        >
          {/* Affichez le formulaire de mise à jour TVA */}
          <Table
            bordered
            pagination={{ pageSize: 10 }}
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
            }}
            dataSource={tvaData}
            columns={[
              {
                title: "Taux de TVA",
                dataIndex: "rate",
                key: "rate",
                render: (rate) => `${rate.toFixed(2)}%`, // Affichez avec deux décimales et ajoutez le symbole "%" à la fin
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
                      }}
                    ></Button>
                    <Popconfirm
                      title="Êtes-vous sûr de vouloir supprimer  cette TVA  ?"
                      onConfirm={() => handleDeleteTva(record._id)}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        className="delete-icon"
                      ></Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </TabPane>

        <TabPane
          tab={
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 15,
                  color: "#3a3838",
                }}
              >
                Timbre Fiscal
              </span>
            </div>
          }
          key="timbre"
        >
          <Table
            bordered
            pagination={{ pageSize: 10 }}
            style={{
              borderRadius: 8,
              border: "1px solid #e8e8e8",
            }}
            dataSource={timbreData}
            columns={[
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
                      }}
                    ></Button>
                    <Popconfirm
                      title="Êtes-vous sûr de vouloir supprimer  ce timbre  ?"
                      onConfirm={() => handleDeleteTimbre(record._id)}
                      okText="Oui"
                      cancelText="Non"
                    >
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        className="delete-icon"
                      ></Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
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
            style={{
              backgroundColor: "#232492", // Couleur de fond personnalisée
              border: "none",
            }}
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
        style={{ border: "none", borderRadius: "8px" }}
        className="custom-modal"
      >
        <Form
          form={form}
          layout="vertical"
          style={{
            padding: "20px",
            background: "transparent",
            borderRadius: "8px",
          }}
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
                <Input
                  style={{ borderRadius: "8px", paddingRight: "24px" }} // Ajouter un espace à droite pour le symbole
                  addonAfter="%"
                />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              name="value"
              label="Valeur"
              rules={[{ required: true, message: "Veuillez saisir la valeur" }]}
            >
              <Input style={{ borderRadius: "8px" }} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Taxe;
