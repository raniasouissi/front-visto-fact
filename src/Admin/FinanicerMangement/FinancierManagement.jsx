import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Table,
  Input,
  Form,
  Space,
  message,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import "./FinancierManagement.css";

const FinancierManagement = () => {
  const [financiers, setFinanciers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFinancier, setSelectedFinancier] = useState(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFinanciers();
  }, [searchQuery]);

  const fetchFinanciers = async () => {
    try {
      let url = "http://localhost:5000/api/financiers";
      if (searchQuery) {
        url += `/search/${searchQuery}`;
      }
      const response = await axios.get(url);
      setFinanciers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des financiers :", error);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleAddFinancier = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup-with-generated-password",
        { ...values, roles: ["financier"] }
      );

      if (response.status === 201) {
        fetchFinanciers();
        closeModal();
        message.success("Financier ajouté avec succès !");
        form.resetFields();
      } else {
        console.error(
          "Erreur lors de l'ajout du financier : Statut de réponse inattendu",
          response.status
        );
        message.error(
          "Erreur lors de l'ajout du financier. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du financier :", error);
      message.error("Erreur lors de l'ajout du financier. Veuillez réessayer.");
    }
  };

  const handleUpdateFinancier = async (values) => {
    try {
      const url = `http://localhost:5000/api/financiers/${selectedFinancier._id}`;
      const response = await axios.put(url, values);

      if (response.status === 200) {
        fetchFinanciers();
        closeModal();
        message.success("Financier mis à jour avec succès !");
      } else {
        console.error(
          "Erreur lors de la mise à jour du financier : Statut de réponse inattendu",
          response.status
        );
        message.error(
          "Erreur lors de la mise à jour du financier. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du financier :", error);
      message.error(
        "Erreur lors de la mise à jour du financier. Veuillez réessayer."
      );
    }
  };

  const handleDeleteFinancier = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/financiers/${id}`);
      fetchFinanciers();
      message.success("Financier supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du financier :", error);
      message.error(
        "Erreur lors de la suppression du financier. Veuillez réessayer."
      );
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    setSelectedFinancier(null);
    form.resetFields();
  };

  const openEditModal = (financier) => {
    setSelectedFinancier(financier);
    setModalIsOpen(true);
    form.setFieldsValue({
      name: financier.name,
      email: financier.email,
      phonenumber: financier.phonenumber,
      codepostale: financier.codepostale,
      address: financier.address,
      pays: financier.pays,
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFinancier(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
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
    {
      title: "Code Postal",
      dataIndex: "codepostale",
      key: "codepostale",
    },
    {
      title: "Adresse",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Pays",
      dataIndex: "pays",
      key: "pays",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            className="action-icon edit-icon"
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce financier ?"
            onConfirm={() => handleDeleteFinancier(record._id)}
            okText="Oui"
            cancelText="Non"
          >
            <DeleteOutlined className="action-icon delete-icon" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="financier-management-container">
      <Input
        className="search-input"
        prefix={<SearchOutlined className="search-icon" />}
        placeholder="Rechercher ..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Button
        type="primary"
        onClick={openModal}
        className="add-financier-button"
      >
        Ajouter un Financier
      </Button>

      <Table
        dataSource={financiers}
        columns={columns}
        pagination={{
          pageSize: 12,
          showTotal: (total) => `Total ${total} financiers`,
        }}
      />
      <Modal
        title={
          selectedFinancier ? "Modifier un Financier" : "Ajouter un Financier"
        }
        visible={modalIsOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={
            selectedFinancier ? handleUpdateFinancier : handleAddFinancier
          }
        >
          <Form.Item
            label="Nom"
            name="name"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Veuillez entrer le nom du financier !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Veuillez entrer l'email du financier !",
              },
              { type: "email", message: "Veuillez entrer un email valide !" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Numéro de Téléphone"
            name="phonenumber"
            hasFeedback
            rules={[
              {
                required: true,
                message:
                  "Veuillez entrer le numéro de téléphone du financier !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Code Postal"
            name="codepostale"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Veuillez entrer le code postal du financier !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Adresse"
            name="address"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Veuillez entrer l'adresse du financier !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Pays"
            name="pays"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Veuillez entrer le pays du financier !",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item className="centered-button">
            <Button type="primary" htmlType="submit">
              {selectedFinancier ? "Modifier" : "Ajouter"}
            </Button>
            <Button onClick={closeModal} style={{ marginLeft: "8px" }}>
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FinancierManagement;
