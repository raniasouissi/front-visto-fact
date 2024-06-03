import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Button,
  Table,
  DatePicker,
  Row,
  Col,
  Popconfirm,
} from "antd";
import axios from "axios";
import moment from "moment";
import "./facture.css";
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const Facture = () => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [devises, setDevises] = useState([]);
  const [timbres, setTimbres] = useState([]);
  const [parametrages, setParametrages] = useState([]);
  const [services, setServices] = useState([]);
  const [tvaRates, setTvaRates] = useState([]); // Nouvel état pour stocker les taux de TVA
  const [selectedServices, setSelectedServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [factures, setFactures] = useState([]);
  const [updatedServices, setUpdatedServices] = useState([]);
  const [totalHT, settotalHT] = useState(0);
  const [totalHTApresRemise, setTotalHTApresRemise] = useState(0);
  const [totalRemise] = useState(0); // Ajout de l'état pour le total de la remise
  const [selectedTvaRates, setSelectedTvaRates] = useState({});
  const [totalTVA, setTotalTVA] = useState(0); // Ajoutez un état pour le total de la TVA
  const [totalTTC, setTotalTTC] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const clientsResponse = await axios.get(
        "http://localhost:5000/api/clients"
      );
      setClients(clientsResponse.data);

      const devisesResponse = await axios.get(
        "http://localhost:5000/api/devise"
      );
      setDevises(devisesResponse.data);

      const timbresResponse = await axios.get(
        "http://localhost:5000/api/timbre"
      );
      setTimbres(timbresResponse.data);

      const parametragesResponse = await axios.get(
        "http://localhost:5000/api/parametrage"
      );
      setParametrages(parametragesResponse.data);

      const servicesResponse = await axios.get(
        "http://localhost:5000/api/services"
      );
      setServices(servicesResponse.data);

      const tvaResponse = await axios.get("http://localhost:5000/api/tva");
      setTvaRates(tvaResponse.data); // Récupérer les taux de TVA

      const facturesResponse = await axios.get(
        "http://localhost:5000/api/facture"
      );
      setFactures(facturesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddService = (value) => {
    const serviceToAdd = services.find((service) => service._id === value);
    if (
      serviceToAdd &&
      !selectedServices.find((service) => service._id === value)
    ) {
      setSelectedServices([...selectedServices, serviceToAdd]);

      const newSelectedTvaRates = {
        ...selectedTvaRates,
        [serviceToAdd._id]: serviceToAdd.tva ? serviceToAdd.tva.rate : 0,
      };
      setSelectedTvaRates(newSelectedTvaRates);

      const newSubtotalHT = calculateNewSubtotal([
        ...selectedServices,
        serviceToAdd,
      ]);
      settotalHT(newSubtotalHT);

      const totalHTAfterDiscount = calculateTotalHTApresRemise([
        ...selectedServices,
        serviceToAdd,
      ]);
      setTotalHTApresRemise(totalHTAfterDiscount);

      form.setFieldsValue({ totalHT: newSubtotalHT });
      form.setFieldsValue({ totalHTApresRemise: totalHTAfterDiscount });
    }
  };

  const handleColumnChange = (value, key, dataIndex) => {
    const updatedSelectedServices = selectedServices.map((service) => {
      if (service._id === key) {
        const updatedService = {
          ...service,
          [dataIndex]:
            dataIndex === "tva" ? findTvaIdByRate(value) : parseFloat(value),
        };

        if (
          dataIndex === "quantite" ||
          dataIndex === "prix_unitaire" ||
          dataIndex === "remise"
        ) {
          updatedService.montant_ht = calculateMontantHT(updatedService);
        }

        handleServiceUpdate(key, updatedService); // Mettre à jour le service
        return updatedService;
      }
      return service;
    });

    setSelectedServices(updatedSelectedServices); // Mettre à jour les services sélectionnés

    // Recalculer les totaux
    const newSubtotalHT = calculateNewSubtotal(updatedSelectedServices);
    settotalHT(newSubtotalHT);

    const totalHTAfterDiscount = calculateTotalHTApresRemise(
      updatedSelectedServices
    );
    setTotalHTApresRemise(totalHTAfterDiscount);

    // Mettre à jour le formulaire
    form.setFieldsValue({ totalHT: newSubtotalHT });
    form.setFieldsValue({ totalHTApresRemise: totalHTAfterDiscount });
  };

  const findTvaIdByRate = (rate) => {
    // Rechercher la TVA correspondant au taux de TVA
    const tva = tvaRates.find((tva) => tva.rate === rate);
    return tva ? tva._id : null; // Renvoyer l'ID de la TVA si elle est trouvée, sinon null
  };

  const handleCreate = async (values) => {
    // Récupérer les valeurs du formulaire
    const {
      clientid,
      parametrageid,
      deviseid,
      timbreid,
      totalTTCLettre,
      totalHT,
      totalRemise,
      totalHTApresRemise,
      totalTVA,
      totalTTC,
    } = values;

    // Créer un tableau contenant uniquement les services sélectionnés ou modifiés
    const selectedOrUpdatedServices = selectedServices.concat(updatedServices);

    // Filtrer les services pour ne conserver que ceux qui ont été sélectionnés ou modifiés
    const selectedAndUpdatedServices = services.filter((service) =>
      selectedOrUpdatedServices.some(
        (selectedOrUpdatedService) =>
          selectedOrUpdatedService._id === service._id
      )
    );

    // Créer le payload pour la création de la facture
    const payload = {
      clientid,
      parametrageid,
      deviseid,
      timbreid,
      totalTTCLettre,
      totalHT: parseFloat(totalHT).toFixed(3), // Formater avec 3 chiffres après la virgule
      totalRemise,
      totalHTApresRemise: parseFloat(totalHTApresRemise).toFixed(3), // Formater avec 3 chiffres après la virgule
      totalTVA,
      totalTTC,
      servicesid: selectedAndUpdatedServices.map((service) => service._id),
    };

    try {
      // Mettre à jour les services modifiés
      await Promise.all(
        updatedServices.map((updatedService) =>
          handleServiceUpdate(updatedService._id, updatedService)
        )
      );

      // Créer la facture
      await axios.post("http://localhost:5000/api/facture/fact", payload);

      // Rafraîchir la liste des factures après la création
      const facturesResponse = await axios.get(
        "http://localhost:5000/api/facture"
      );
      setFactures(facturesResponse.data);

      // Réinitialiser le formulaire et les services sélectionnés
      form.resetFields();
      setSelectedServices([]);
      setUpdatedServices([]);
      form.setFieldsValue({ totalHT: null });
      form.setFieldsValue({ totalHTApresRemise: null });

      // Afficher un message de succès
      message.success("Facture créée avec succès !");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error);
      message.error(
        "Une erreur s'est produite lors de la création de la facture."
      );
    }
  };

  const handleServiceUpdate = async (id, updatedService) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/services/${id}`,
        updatedService
      );

      // Mettre à jour les services sélectionnés après la modification d'un service
      const updatedSelectedServices = selectedServices.map((service) =>
        service._id === id ? updatedService : service
      );
      setSelectedServices(updatedSelectedServices);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service :", error);
      message.error(
        "Une erreur s'est produite lors de la mise à jour du service."
      );
    }
  };

  const calculateNewSubtotal = (newSelectedServices) => {
    // Calculer le Sous-Total HT en parcourant les services sélectionnés
    const totalHT = newSelectedServices.reduce((accumulator, service) => {
      const montantHT =
        parseFloat(service.quantite) * parseFloat(service.prix_unitaire);
      return accumulator + montantHT;
    }, 0);

    return totalHT.toFixed(3); // Formater avec 3 chiffres après la virgule
  };

  const calculateTotalHTApresRemise = (newSelectedServices) => {
    // Calculer le Total HT après remise en parcourant les services sélectionnés
    const totalHTApresRemise = newSelectedServices.reduce(
      (accumulator, service) => {
        const montantHT =
          parseFloat(service.quantite) * parseFloat(service.prix_unitaire);
        const remise = parseFloat(service.remise) || 0;
        const montantHTApresRemise = montantHT * (1 - remise / 100); // Appliquer la remise
        return accumulator + montantHTApresRemise;
      },
      0
    );

    return parseFloat(totalHTApresRemise).toFixed(3);
  };

  const calculateMontantHT = (record) => {
    const quantite = record.quantite || 0;
    const prix_unitaire = record.prix_unitaire || 0;
    const remise = record.remise || 0;
    const montantHT = (quantite * prix_unitaire * (100 - remise)) / 100;
    return parseFloat(montantHT.toFixed(3)); // Renvoie le montant HT avec 3 chiffres après la virgule
  };

  useEffect(() => {
    // Calculer la remise totale
    const calculateTotalRemise = () => {
      const totalHT = parseFloat(form.getFieldValue("totalHT"));
      const totalHTApresRemise = parseFloat(
        form.getFieldValue("totalHTApresRemise")
      );
      const remise = totalHT - totalHTApresRemise;
      form.setFieldsValue({ totalRemise: remise.toFixed(3) });
    };

    // Appeler la fonction pour calculer la remise totale
    calculateTotalRemise();
  }, [selectedServices, form]);

  const columns = [
    {
      title: "Référence",
      dataIndex: "reference",
      key: "reference",
      width: 130,
      render: (_, record) => record.reference,
    },

    {
      title: "Désignation",
      dataIndex: "libelle",
      key: "libelle",
      width: 200,
      render: (_, record) => (
        <Input.TextArea
          defaultValue={record.libelle}
          onBlur={(e) =>
            handleColumnChange(e.target.value, record._id, "libelle")
          }
          autoSize={{ minRows: 1, maxRows: 5 }} // Ajuste la hauteur automatiquement
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "TVA",
      dataIndex: "tva",
      key: "tva",
      width: 120,
      render: (_, record) => (
        <Select
          onChange={(value) => handleColumnChange(value, record._id, "tva")}
          style={{ width: "110%" }}
          value={selectedTvaRates[record._id] || undefined}
        >
          {tvaRates.map((tva) => (
            <Option key={tva._id} value={tva.rate}>
              {tva.rate}%
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      width: 100,
      fontSize: 10,
      render: (_, record) => (
        <Input
          type="number"
          defaultValue={record.quantite}
          onBlur={(e) =>
            handleColumnChange(e.target.value, record._id, "quantite")
          }
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Prix Unitaire",
      dataIndex: "prix_unitaire",
      key: "prix_unitaire",
      width: 180,
      render: (_, record) => (
        <Input
          type="number"
          defaultValue={record.prix_unitaire} // Utilisez toFixed(3) pour afficher 3 chiffres après la virgule
          onBlur={(e) =>
            handleColumnChange(
              parseFloat(e.target.value),
              record._id,
              "prix_unitaire"
            )
          }
          style={{ width: "100px" }}
        />
      ),
    },
    {
      title: "Remise(%)",
      dataIndex: "remise",
      key: "remise",
      width: 50,

      render: (_, record) => (
        <Input
          type="number"
          defaultValue={record.remise}
          onBlur={(e) =>
            handleColumnChange(e.target.value, record._id, "remise")
          }
          style={{ width: "80%" }}
        />
      ),
    },
    {
      title: "Montant HT",
      dataIndex: "montant_ht",
      key: "montant_ht",

      render: (_, record) => record.montant_ht, // Utilisez la valeur du montant HT du service
    },
    {
      title: "Action",
      key: "action",
      width: 40,
      render: (_, record) => (
        <Popconfirm
          title="Êtes-vous sûr de vouloir supprimer ce service ?"
          onConfirm={() => handleDeleteService(record._id)}
          okText="Oui"
          cancelText="Non"
        >
          <Button
            type="link"
            danger
            style={{ background: "transparent", fontSize: 15 }}
          >
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleDeleteService = (id) => {
    // Mettez à jour l'état selectedServices en supprimant le service supprimé
    const updatedSelectedServices = selectedServices.filter(
      (service) => service._id !== id
    );
    setSelectedServices(updatedSelectedServices);
    message.success("Service supprimé de la table !");
  };

  useEffect(() => {
    // Calculer le total de la TVA
    const calculateTotalTVA = () => {
      let totalTVA = 0;
      selectedServices.forEach((service) => {
        // Trouver le taux de TVA correspondant au service
        const tvaRate = selectedTvaRates[service._id];
        if (tvaRate) {
          // Calculer le montant HT du service
          const montantHT = parseFloat(service.montant_ht);
          // Calculer la TVA pour ce service
          const tva = (montantHT * tvaRate) / 100;
          // Ajouter la TVA au total
          totalTVA += tva;
        }
      });
      // Mettre à jour l'état du total de la TVA
      setTotalTVA(totalTVA.toFixed(3));
      // Mettre à jour le champ correspondant dans le formulaire
      form.setFieldsValue({ totalTVA: totalTVA.toFixed(3) });
    };

    // Appeler la fonction pour calculer le total de la TVA
    calculateTotalTVA();
  }, [selectedServices, selectedTvaRates, form]);

  // Utilisez useEffect pour recalculer le total TTC lorsque les valeurs pertinentes changent
  useEffect(() => {
    const calculateTotalTTC = () => {
      // Récupérer les valeurs pertinentes du formulaire
      const totalHTApresRemise =
        parseFloat(form.getFieldValue("totalHTApresRemise")) || 0;
      const totalTVA = parseFloat(form.getFieldValue("totalTVA")) || 0;
      const timbreValue = parseFloat(form.getFieldValue("timbreid")) || 0;

      // Calculer le total TTC en ajoutant le total HT après remise, le total de la TVA et le montant du timbre
      const totalTTC = totalHTApresRemise + totalTVA + timbreValue;

      // Mettre à jour l'état du total TTC
      setTotalTTC(totalTTC.toFixed(3)); // Formater avec 3 chiffres après la virgule
    };

    // Appeler la fonction de calcul à chaque changement des valeurs pertinentes
    calculateTotalTTC();
  }, [
    form.getFieldValue("totalHTApresRemise"),
    form.getFieldValue("totalTVA"),
    form.getFieldValue("timbreid"),
  ]);

  const columnsFact = [
    {
      title: "Numéro Facture",
      dataIndex: "numeroFacture",
      key: "numeroFacture",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Société",
      dataIndex: "parametrage",
      key: "parametrage",
      render: (parametrage) => parametrage.nomEntreprise,
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (client) => `${client.name} (${client.namecompany})`,
    },
    {
      title: "Devise",
      dataIndex: "devise",
      key: "devise",
      render: (devise) => devise.symbole,
    },
    {
      title: "Total TTC",
      dataIndex: "totalTTC",
      key: "totalTTC",
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Ajouter Facture
      </Button>

      <Table
        dataSource={factures}
        columns={columnsFact}
        rowKey="_id"
        pagination={false}
        style={{ marginTop: 20, width: "100%" }}
      />
      <Modal
        title={
          <span
            style={{
              color: "#0a0a85",
              fontSize: "25px",
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Ajouter une facture
          </span>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 10 }}
        bodyStyle={{
          background:
            "linear-gradient(to bottom,rgba(255, 255, 255, 0.9),  rgba(255, 255, 255, 0.9))",
        }}
      >
        <Form
          form={form}
          layout="inline"
          onFinish={handleCreate}
          style={{ marginTop: 10, marginRight: 20 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                style={{ marginTop: 10 }}
                label="Société"
                name="parametrageid"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une société !",
                  },
                ]}
              >
                <Select
                  style={{ width: "200px" }}
                  placeholder="Sélectionner une société"
                >
                  {parametrages.map((parametrage) => (
                    <Option key={parametrage._id} value={parametrage._id}>
                      {parametrage.nomEntreprise}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginTop: 10, marginLeft: -25 }}
                label="Client"
                name="clientid"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un client !",
                  },
                ]}
              >
                <Select
                  style={{ width: "300px" }}
                  placeholder="Sélectionner un client"
                >
                  {clients.map((client) => (
                    <Option key={client._id} value={client._id}>
                      {`${client.name} (${client.namecompany})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Date" name="date" initialValue={moment()}>
                <DatePicker
                  style={{ width: "100%" }}
                  defaultValue={moment()}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginLeft: 60 }}
                label="Devise"
                name="deviseid"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une devise !",
                  },
                ]}
              >
                <Select style={{ width: "100px" }} placeholder=" devise">
                  {devises.map((devise) => (
                    <Option key={devise._id} value={devise._id}>
                      {` (${devise.symbole})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ width: "100%", marginTop: 10 }}>
            <Col span={24}>
              <Form.Item
                label="Services"
                name="servicesid"
                style={{ marginLeft: -30 }}
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un service !",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Sélectionner un service"
                  onSelect={handleAddService}
                >
                  {services.map((service) => (
                    <Option key={service._id} value={service._id}>
                      {service.libelle}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Table
            className="custom-table"
            dataSource={selectedServices}
            columns={columns}
            rowKey="id"
            pagination={false}
            style={{ marginBottom: 16, width: "100%" }}
            bordered
            scroll={{ x: "100%" }}
          />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Total TTC en Lettre"
                name="totalTTCLettre"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le total TTC en Lettre !",
                  },
                ]}
              >
                <Input placeholder="Total TTC en Lettre" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Sous-Total HT"
                name="totalHT"
                initialValue={totalHT}
              >
                <Input
                  type="number"
                  value={totalHT}
                  style={{ backgroundColor: "#f0f0f0" }}
                  readOnly
                />
              </Form.Item>

              <Form.Item label="Remise" name="totalRemise">
                <Input
                  type="number"
                  value={totalRemise}
                  readOnly
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </Form.Item>

              <Form.Item
                label="Total HT après Remise"
                name="totalHTApresRemise"
                initialValue={totalHTApresRemise}
              >
                <Input
                  type="number"
                  value={totalHT}
                  style={{ backgroundColor: "#f0f0f0" }}
                  readOnly
                />
              </Form.Item>
              <Form.Item label="Total TVA" name="totalTVA">
                <Input
                  type="number"
                  placeholder="Total TVA"
                  readOnly
                  value={totalTVA}
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </Form.Item>

              <Form.Item
                label="Timbre"
                name="timbreid"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le timbre !",
                  },
                ]}
              >
                <Select placeholder="Sélectionner un timbre">
                  {timbres.map((timbre) => (
                    <Option key={timbre._id} value={timbre._id}>
                      {timbre.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Total TTC" name="totalTTC">
                <Input
                  type="number"
                  placeholder="Total TTC"
                  value={totalTTC}
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              marginLeft: 300,
            }}
          >
            <Button
              type="default"
              style={{
                backgroundColor: "red",
                color: "white",
                marginRight: 10,
                width: "120px",
                fontSize: "14px",
              }}
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields(); // Réinitialiser les champs du formulaire
                setSelectedServices([]); // Réinitialiser les services sélectionnés
                setUpdatedServices([]); // Réinitialiser les services modifiés
                form.setFieldsValue({ totalHT: null });
                form.setFieldsValue({ totalHTApresRemise: null });
              }}
            >
              Annuler
            </Button>

            <Form.Item style={{ marginRight: "8px", marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="create-butto"
                style={{
                  background: "green",
                  width: "130px",
                  height: "30px",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Valider
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Facture;
