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
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const Devise = () => {
  const [deviseData, setDeviseData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchDeviseData();
  }, []);

  const fetchDeviseData = () => {
    axios
      .get("http://localhost:5000/api/devise")
      .then((response) => setDeviseData(response.data))
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/devise/${id}`);
      fetchDeviseData();
      message.success("Devise supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la devise :", error);
      message.error(
        "Erreur lors de la suppression de la devise. Veuillez réessayer."
      );
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
        style={{ float: "right", marginBottom: 16 }}
        onClick={() => {
          setModalVisible(true);
          setEditItem(null);
        }}
        icon={<PlusOutlined />}
      >
        Ajouter une devise
      </Button>
      <Table
        dataSource={deviseData}
        columns={[
          { title: "Nom", dataIndex: "name", key: "name" },
          { title: "Symbole", dataIndex: "symbole", key: "symbole" },
          {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <EditOutlined
                  className="action-icon edit-icon"
                  onClick={() => handleEdit(record)}
                />
                <Popconfirm
                  title="Êtes-vous sûr de vouloir supprimer cette devise ?"
                  onConfirm={() => handleDelete(record._id)}
                  okText="Oui"
                  cancelText="Non"
                >
                  <DeleteOutlined className="action-icon delete-icon" />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default Devise;
