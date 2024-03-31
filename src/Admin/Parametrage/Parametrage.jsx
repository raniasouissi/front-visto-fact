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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import "./parametrage.css";

const Parametrage = () => {
  const [parametrages, setParametrages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedParametrage, setSelectedParametrage] = useState(null);
  const [form] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchParametrages();
  }, []);

  const fetchParametrages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/parametrage");
      setParametrages(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des paramétrages :", error);
    }
  };

  const handleAddParametrage = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/parametrage/company",
        values
      );

      if (response.status === 201) {
        fetchParametrages();
        closeModal();
        message.success("Paramétrage ajouté avec succès !");
        form.resetFields();
      } else {
        console.error(
          "Erreur lors de l'ajout du paramétrage : Statut de réponse inattendu",
          response.status
        );
        message.error(
          "Erreur lors de l'ajout du paramétrage. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du paramétrage :", error);
      message.error(
        "Erreur lors de l'ajout du paramétrage. Veuillez réessayer."
      );
    }
  };

  const handleUpdateParametrage = async (values) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/parametrage/${selectedParametrage._id}`,
        values
      );

      if (response.status === 200) {
        fetchParametrages();
        closeModal();
        message.success("Paramétrage mis à jour avec succès !");
      } else {
        console.error(
          "Erreur lors de la mise à jour du paramétrage : Statut de réponse inattendu",
          response.status
        );
        message.error(
          "Erreur lors de la mise à jour du paramétrage. Veuillez réessayer."
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paramétrage :", error);
      message.error(
        "Erreur lors de la mise à jour du paramétrage. Veuillez réessayer."
      );
    }
  };

  const handleDeleteParametrage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/parametrage/${id}`);
      fetchParametrages();
      message.success("Paramétrage supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du paramétrage :", error);
      message.error(
        "Erreur lors de la suppression du paramétrage. Veuillez réessayer."
      );
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    setSelectedParametrage(null);
    setIsAdding(true);
    form.resetFields();
  };

  const openEditModal = (parametrage) => {
    setSelectedParametrage(parametrage);
    setModalIsOpen(true);
    setIsAdding(false);
    form.setFieldsValue({
      matriculefiscal: parametrage.matriculefiscal,
      pays: parametrage.pays,
      nomEntreprise: parametrage.nomEntreprise,
      adresseEntreprise: parametrage.adresseEntreprise,
      ville: parametrage.ville,
      codePostal: parametrage.codePostal,
      identreprise: parametrage.identreprise,
      tva: parametrage.tva,
      phonenumber: parametrage.phonenumber,
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedParametrage(null);
    setIsAdding(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Matricule Fiscale",
      dataIndex: "matriculefiscal",
      key: "matriculefiscal",
    },

    {
      title: "Nom de l'entreprise",
      dataIndex: "nomEntreprise",
      key: "nomEntreprise",
    },
    {
      title: "Identreprise",
      dataIndex: "identreprise",
      key: "identreprise",
    },
    {
      title: "Numéro de Téléphone",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "TVA",
      dataIndex: "tva",
      key: "tva",
    },
    {
      title: "Adresse",
      dataIndex: "adresseEntreprise",
      key: "adresseEntreprise",
    },
    {
      title: "Pays",
      dataIndex: "pays",
      key: "pays",
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
    },
    {
      title: "Code Postale",
      dataIndex: "codePostal",
      key: "codePostal",
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
            title="Êtes-vous sûr de vouloir supprimer ce paramétrage ?"
            onConfirm={() => handleDeleteParametrage(record._id)}
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
    <div className="parametrage-management-container">
      <Button
        type="primary"
        onClick={openModal}
        className="add-parametrage-button"
      >
        Ajouter un Paramétrage
      </Button>

      <Table
        dataSource={parametrages}
        columns={columns}
        pagination={{
          pageSize: 12,
          showTotal: (total) => `Total ${total} paramétrages`,
        }}
      />
      <Modal
        title={
          isAdding
            ? "Ajouter un Paramétrage"
            : selectedParametrage
            ? "Modifier un Paramétrage"
            : ""
        }
        visible={modalIsOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={isAdding ? handleAddParametrage : handleUpdateParametrage}
        >
          <Form.Item
            name="matriculefiscal"
            label="Matricule Fiscale"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le matricule fiscal",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nomEntreprise"
            label="Nom de l'entreprise"
            rules={[
              {
                required: true,
                message: "Veuillez saisir le nom de l'entreprise",
              },
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
            name="tva"
            label="TVA"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner une TVA",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pays"
            label="Pays"
            rules={[{ required: true, message: "Veuillez saisir le pays" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="adresseEntreprise"
            label="Adresse"
            rules={[{ required: true, message: "Veuillez saisir l'adresse" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ville"
            label="Ville"
            rules={[{ required: true, message: "Veuillez saisir la ville" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="codePostal"
            label="Code Postale"
            rules={[
              { required: true, message: "Veuillez saisir le code postal" },
            ]}
          >
            <Input />
          </Form.Item>

          {!isAdding && (
            <Form.Item
              name="identreprise"
              label="Identreprise"
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir l'identreprise",
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item className="centered-button">
            <Button type="primary" htmlType="submit">
              {isAdding ? "Ajouter" : "Modifier"}
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

export default Parametrage;
