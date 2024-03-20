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

import "./ClientManagement.css";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClients();
  }, [searchQuery]);

  const fetchClients = async () => {
    try {
      let url = "http://localhost:5000/api/clients";
      if (searchQuery) {
        url += `/search/${searchQuery}`;
      }
      const response = await axios.get(url);
      setClients(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleAddClient = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/clients/signup",
        { ...values, roles: ["client"] }
      );

      if (response.status === 201) {
        fetchClients();
        closeModal();
        message.success("Client ajouté avec succès !");
        form.resetFields();
      } else {
        console.error(
          "Erreur lors de l'ajout du client : Statut de réponse inattendu",
          response.status
        );
        message.error("Erreur lors de l'ajout du client. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du client :", error);
      message.error("Erreur lors de l'ajout du client. Veuillez réessayer.");
    }
  };

  const handleUpdateClient = async (values) => {
    try {
      const url = `http://localhost:5000/api/clients/${selectedClient._id}`;
      const response = await axios.put(url, values);

      if (response.status === 200) {
        fetchClients();
        closeModal();
        message.success("Client mis à jour avec succès !");
      } else {
        console.error(
          "Erreur lors de la mise à jour du client : Statut de réponse inattendu",
          response.status
        );
        message.error(
          "Erreur lors de la mise à jour du client. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);
      message.error(
        "Erreur lors de la mise à jour du client. Veuillez réessayer."
      );
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      fetchClients();
      message.success("Client supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      message.error(
        "Erreur lors de la suppression du client. Veuillez réessayer."
      );
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    setSelectedClient(null);
    form.resetFields();
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setModalIsOpen(true);
    form.setFieldsValue({
      ...client,
      type: client.type, // Initialise le champ "type" avec la valeur actuelle du type du client
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedClient(null);
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
      title: "Type d'utilisateur",
      dataIndex: "type",
      key: "type",
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
      title: "Code Postal",
      dataIndex: "codepostale",
      key: "codepostale",
    },
    {
      title: "Matricule Fiscale",
      dataIndex: "matriculeFiscale",
      key: "matriculeFiscale",
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
            title="Êtes-vous sûr de vouloir supprimer ce client ?"
            onConfirm={() => handleDeleteClient(record._id)}
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
    <div className="client-management-container">
      <Input
        className="search-input"
        prefix={<SearchOutlined className="search-icon" />}
        placeholder="Rechercher par nom ou email"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Button type="primary" onClick={openModal} className="add-client-button">
        Ajouter un Client
      </Button>

      <Table
        dataSource={clients}
        columns={columns}
        pagination={{
          pageSize: 12,
          showTotal: (total) => `Total ${total} clients`,
        }}
      />
      <Modal
        title={selectedClient ? "Modifier un Client" : "Ajouter un Client"}
        visible={modalIsOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={selectedClient ? handleUpdateClient : handleAddClient}
        >
          <Form.Item
            label="Nom"
            name="name"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le nom du client !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Veuillez entrer l'email du client !",
              },
              { type: "email", message: "Veuillez entrer un email valide !" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Numéro de Téléphone"
            name="phonenumber"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le numéro de téléphone du client !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Adresse" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Pays" name="pays">
            <Input />
          </Form.Item>
          <Form.Item label="Code Postal" name="codepostale">
            <Input />
          </Form.Item>
          <Form.Item label="Matricule Fiscale" name="matriculeFiscale">
            <Input />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Input disabled={!selectedClient} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {selectedClient ? "Modifier" : "Ajouter"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientManagement;
