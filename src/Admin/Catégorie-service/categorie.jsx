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

const Categorie = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categorie");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  const handleDeleteCategorie = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categorie/${id}`);
      fetchCategories();
      message.success("Catégorie supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie :", error);
      message.error(
        "Erreur lors de la suppression de la catégorie. Veuillez réessayer."
      );
    }
  };

  const handleEditCategorie = (record) => {
    setEditItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  return (
    <div>
      <Button
        type="primary"
        style={{ float: "right", marginBottom: 16, backgroundColor: "#0a0a85" }}
        onClick={() => {
          setModalVisible(true);
          setEditItem(null);
        }}
        icon={<PlusOutlined />}
      >
        Ajouter une catégorie
      </Button>
      <Table
        dataSource={categories}
        columns={[
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
                <EditOutlined
                  className="action-icon edit-icon"
                  onClick={() => handleEditCategorie(record)}
                />
                <Popconfirm
                  title="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
                  onConfirm={() => handleDeleteCategorie(record._id)}
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
        </Form>
      </Modal>
    </div>
  );
};

export default Categorie;
