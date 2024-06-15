import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Space } from "antd";
import Logo from "../../assets/images/visto.png";
import axios from "axios";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const FactClient = () => {
  const [clientFactures, setClientFactures] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#fff",
      padding: 20,
    },
    section: {
      marginBottom: 20,
      padding: 10,
    },
    logo: {
      marginBottom: 10,
      width: "20%",
    },
    title: {
      fontSize: 20,
      color: "#14149f",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 2,
      marginLeft: "auto",
      marginRight: "auto",
      textDecoration: "underline",
      paddingBottom: 4,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 11,
      color: "#1b1b1b",
      fontWeight: "normal",
      marginBottom: 8,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableColHeader: {
      width: "15%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#6696bd",
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#84bdea",
    },
    tableCol: {
      width: "15%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCellHeader: {
      margin: 5,
      fontSize: 10,
      fontWeight: "bold",
      textAlign: "center",
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
      textAlign: "center",
    },

    totalsContainer: {
      flexDirection: "row",
      marginTop: 20,
      marginBottom: 10,
      justifyContent: "space-between",
    },
    totalsLeft: {
      width: "40%",
      marginRight: 10,
      textAlign: "right",
    },
    totalsRight: {
      width: "40%",
      marginLeft: 10,
    },
    totalsText: {
      fontSize: 10,
      marginBottom: 5,
      color: "#333",
    },
    totalsValue: {
      fontSize: 12,
      marginBottom: 5,
      color: "#555",
    },
    totalsTable: {
      marginLeft: 50,
      width: "80%",

      borderStyle: "solid",
    },
    totalsTableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    totalsTableCell: {
      flex: 1,

      textAlign: "center",
      borderRightWidth: 1,
      borderColor: "#ccc",
    },
    totalsTableCellHeader: {
      flex: 1,

      textAlign: "center",
      borderRightWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "#84bdea", // Couleur de fond pour les en-têtes de colonnes
      fontWeight: "bold", // Gras pour les en-têtes
    },
    totalsLastCell: {
      borderRightWidth: 0,
    },

    footerContainer: {
      textAlign: "center",
      borderTop: "2px solid #ddd",
      paddingTop: 10,
      marginTop: 200,
      fontSize: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: 11.5,
    },
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const idProfil = localStorage.getItem("id");
        const response = await axios.get(
          `http://localhost:5000/api/clients/${idProfil}`
        );

        // Traiter les données des factures avant de les stocker
        const clientFacturesData = response.data.factures.map((facture) => ({
          key: facture._id,
          numeroFacture: facture.numeroFacture,
          date: facture.date,
          totalTTC: facture.totalTTC,
          // Traiter les services ici
          services: facture.services.map((service) => ({
            reference: service.reference,
            libelle: service.libelle,
            unite: service.unite,
            tva: service.tva.rate,
            quantite: service.quantite,
            prix_unitaire: service.prix_unitaire,
            remise: service.remise,
            montant_ht: service.montant_ht,
          })),
          devise: facture.devise.name,
          parametrage: facture.parametrage,
          client: facture.client,
          totalHT: facture.totalHT,
          totalRemise: facture.totalRemise,
          totalHTApresRemise: facture.totalHTApresRemise,
          totalTVA: facture.totalTVA,
          timbre: facture.timbre,
          totalTTCLettre: facture.totalTTCLettre,
        }));

        // Mettre à jour l'état avec les données traitées
        setClientFactures(clientFacturesData);

        console.log("Réponse de l'API :", response);
      } catch (error) {
        console.error("Erreur lors de la récupération du client :", error);
      }
    };

    fetchClient();
  }, []);

  const showPrintModal = (record) => {
    setSelectedFacture(record); // Sélectionnez la facture pour l'impression
    setIsPrintModalVisible(true);
  };

  const handlePrintModalCancel = () => {
    setIsPrintModalVisible(false);
  };

  const showDetailModal = (record) => {
    setSelectedFacture(record);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => {
        const dateObj = new Date(date);
        const jour = dateObj.getDate();
        const mois = dateObj.getMonth() + 1;
        const annee = dateObj.getFullYear();
        const dateFormatee = `${jour < 10 ? "0" : ""}${jour}/${
          mois < 10 ? "0" : ""
        }${mois}/${annee}`;
        return dateFormatee;
      },
    },
    {
      title: "Numéro de Facture",
      dataIndex: "numeroFacture",
      key: "numeroFacture",
    },
    {
      title: "Total TTC",
      dataIndex: "totalTTC",
      key: "totalTTC",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
          ></Button>
          <Button
            type="link"
            icon={<PrinterOutlined />}
            onClick={() => showPrintModal(record)} // Passer le record à la fonction
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {clientFactures.length > 0 ? (
        <>
          <Table
            dataSource={clientFactures}
            columns={columns}
            bordered
            pagination={{ pageSize: 10 }}
            style={{ borderRadius: 8, border: "1px solid #e8e8e8" }}
          />
          <Modal
            visible={isDetailModalVisible}
            onCancel={handleDetailModalCancel}
            footer={
              <div
                style={{
                  textAlign: "center",
                  borderTop: "2px solid #ddd",
                  padding: "20px",
                  backgroundColor: "#f7f7f7",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{ flex: "1", margin: "5px", marginLeft: "-30px" }}
                  >
                    <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                      <span style={{ fontWeight: "bold" }}>M.F: </span>
                      {selectedFacture &&
                      selectedFacture.parametrage &&
                      selectedFacture.parametrage.matriculefiscal
                        ? selectedFacture.parametrage.matriculefiscal
                        : "-"}
                    </p>
                  </div>
                  <div
                    style={{ flex: "1", margin: "5px", marginLeft: "-35px" }}
                  >
                    <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                      <PhoneOutlined style={{ marginRight: "5px" }} />
                      {selectedFacture && selectedFacture.parametrage
                        ? selectedFacture.parametrage.phonenumber
                        : "-"}
                    </p>
                  </div>

                  <div
                    style={{ flex: "1", margin: "5px", marginLeft: "-25px" }}
                  >
                    <p style={{ marginBottom: "10px", fontSize: "14px" }}>
                      <MailOutlined style={{ marginRight: "5px" }} />
                      {selectedFacture && selectedFacture.parametrage
                        ? selectedFacture.parametrage.email
                        : "-"}
                    </p>
                  </div>

                  <div style={{ flex: "1", margin: "5px" }}>
                    <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                      <EnvironmentOutlined style={{ marginRight: "5px" }} />
                      {selectedFacture && selectedFacture.parametrage
                        ? selectedFacture.parametrage.adresseEntreprise
                        : "-"}
                      {selectedFacture && selectedFacture.parametrage
                        ? `, ${selectedFacture.parametrage.ville}`
                        : ""}
                      {selectedFacture && selectedFacture.parametrage
                        ? `, ${selectedFacture.parametrage.codePostal}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            }
            width={920}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "Poppins",
              }}
            >
              <div>
                <div style={{ marginTop: 10 }}>
                  <img
                    src={Logo}
                    alt="Visto Logo"
                    style={{
                      marginBottom: 20,
                      maxWidth: "30%",
                      height: "auto",
                    }}
                  />
                </div>

                <div style={{ textAlign: "center", marginLeft: 300 }}>
                  <p
                    style={{
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "#14149f",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        borderBottom: "2px solid #0a0a85",
                        paddingBottom: "4px",
                      }}
                    >
                      {selectedFacture ? selectedFacture.numeroFacture : "-"}
                    </span>
                  </p>
                </div>

                <p style={{ fontSize: 16, marginBottom: 8 }}>
                  <span style={{ fontWeight: "bold", color: "#302c2c" }}>
                    Date:{" "}
                  </span>
                  <span style={{ fontSize: 16 }}>
                    {selectedFacture ? formatDate(selectedFacture.date) : "-"}
                  </span>
                </p>

                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#302c2c",
                    }}
                  >
                    Nom de l&apos;entreprise:{" "}
                  </span>
                  <span
                    style={{ color: "#302c2c", textTransform: "uppercase" }}
                  >
                    {selectedFacture && selectedFacture.parametrage
                      ? selectedFacture.parametrage.nomEntreprise.toUpperCase()
                      : "-"}
                  </span>
                </p>

                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <span style={{ fontWeight: "bold" }}>Tél: </span>
                  {selectedFacture && selectedFacture.parametrage
                    ? selectedFacture.parametrage.phonenumber
                    : "-"}
                </p>
                <div style={{ flex: "1", margin: "5px", marginLeft: "-5px" }}>
                  <p style={{ marginBottom: "10px", fontSize: "14px" }}>
                    {selectedFacture && selectedFacture.parametrage
                      ? selectedFacture.parametrage.adresseEntreprise
                      : "-"}
                    {selectedFacture && selectedFacture.parametrage
                      ? `, ${selectedFacture.parametrage.ville}`
                      : ""}
                    {selectedFacture && selectedFacture.parametrage
                      ? `, ${selectedFacture.parametrage.codePostal}`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Partie droite: Informations du client */}
              <div style={{ marginTop: 150 }}>
                {selectedFacture &&
                  selectedFacture.client &&
                  selectedFacture.client.matriculeFiscale && (
                    <p style={{ fontSize: 14, marginBottom: 8 }}>
                      <span style={{ fontWeight: "bold" }}>
                        Matricule Fiscale:{" "}
                      </span>
                      {selectedFacture.client.matriculeFiscale}
                    </p>
                  )}
                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <span style={{ fontWeight: "bold" }}>Client: </span>
                  {selectedFacture && selectedFacture.client
                    ? selectedFacture.client.name
                    : "-"}
                </p>
                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <span style={{ fontWeight: "bold" }}>Entreprise: </span>
                  {selectedFacture && selectedFacture.client
                    ? selectedFacture.client.namecompany.toUpperCase()
                    : "-"}
                </p>
                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <span style={{ fontWeight: "bold" }}>Email: </span>
                  {selectedFacture && selectedFacture.client
                    ? selectedFacture.client.email
                    : "-"}
                </p>

                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <span style={{ fontWeight: "bold" }}>Tél: </span>
                  {selectedFacture && selectedFacture.client
                    ? selectedFacture.client.phonenumber
                    : "-"}
                </p>
              </div>
            </div>
            <div className="table-container" style={{ marginTop: 20 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Référence
                    </th>
                    <th
                      style={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Désignation
                    </th>

                    <th
                      style={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Unité
                    </th>
                    <th
                      style={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      TVA
                    </th>
                    <th
                      style={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Quantité
                    </th>
                    <th
                      style={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Prix unitaire
                    </th>
                    <th
                      style={{
                        borderRight: "1px solid #ddd",
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Remise (%)
                    </th>
                    <th
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      Montant HT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFacture &&
                  selectedFacture.services &&
                  Array.isArray(selectedFacture.services) &&
                  selectedFacture.services.length > 0 ? (
                    selectedFacture.services.map((service, index) => (
                      <tr key={index}>
                        <td>{service.reference}</td>
                        <td>{service.libelle}</td>
                        <td>{service.unite}</td>
                        <td>{service.tva}%</td>
                        <td>{service.quantite}</td>
                        <td>{service.prix_unitaire}</td>
                        <td>{service.remise}%</td>
                        <td>{service.montant_ht}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        Aucun service trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "Poppins",
                  alignItems: "center", // Pour aligner les éléments verticalement
                  flexWrap: "wrap", // Pour que les éléments suivent à la ligne si nécessaire
                }}
              >
                <div style={{ flex: "1 1 100%" }}>
                  <p
                    style={{
                      fontSize: 14, // Réduction de la taille du texte
                      marginBottom: 4, // Réduction de l'espacement après le paragraphe
                      fontWeight: "bold",
                      color: "#302c2c",
                      marginTop: 10,
                      whiteSpace: "pre-wrap", // Permet aux espaces et aux retours à la ligne de s'afficher correctement
                    }}
                  >
                    <span style={{ fontWeight: "bold", color: "#302c2c" }}>
                      Arrêtée la présente facture à la somme de{" "}
                    </span>
                    <br /> {/* Retour à la ligne */}
                    <span style={{ fontSize: 14 }}>
                      {selectedFacture ? selectedFacture.totalTTCLettre : "-"}
                    </span>
                  </p>
                </div>

                <div
                  style={{
                    flex: "1 1 100%",
                    maxWidth: "300px",
                    marginLeft: 550,
                    marginTop: -59,
                  }}
                >
                  <table
                    className="facture-table"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #ddd",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Total HT
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {selectedFacture
                            ? selectedFacture.totalHT.toFixed(3)
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Remise
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {selectedFacture
                            ? selectedFacture.totalRemise.toFixed(3)
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Total HT après Remise
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {selectedFacture
                            ? selectedFacture.totalHTApresRemise.toFixed(3)
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Total TVA
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {selectedFacture
                            ? selectedFacture.totalTVA.toFixed(3)
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Timbre
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {selectedFacture
                            ? selectedFacture.timbre.value.toFixed(3)
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            borderRight: "1px solid #ddd",
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          Total TTC
                        </td>
                        <td
                          style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {selectedFacture
                            ? selectedFacture.totalTTC.toFixed(3)
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            visible={isPrintModalVisible}
            onCancel={handlePrintModalCancel}
            footer={
              <PDFDownloadLink
                document={
                  <Document>
                    <Page size="A4" style={styles.page}>
                      <View style={styles.section}>
                        <Image src={Logo} style={styles.logo} />
                        <Text style={styles.title}>
                          {selectedFacture
                            ? selectedFacture.numeroFacture
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          Date:{" "}
                          {selectedFacture
                            ? formatDate(selectedFacture.date)
                            : "-"}
                        </Text>

                        <Text style={styles.subtitle}>
                          M.F::{" "}
                          {selectedFacture && selectedFacture.parametrage
                            ? selectedFacture.parametrage.matriculefiscal
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          Nom de l&apos;entreprise:{" "}
                          {selectedFacture && selectedFacture.parametrage
                            ? selectedFacture.parametrage.nomEntreprise.toUpperCase()
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          Tél:{" "}
                          {selectedFacture && selectedFacture.parametrage
                            ? selectedFacture.parametrage.phonenumber
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          {selectedFacture && selectedFacture.parametrage
                            ? `${selectedFacture.parametrage.adresseEntreprise}, ${selectedFacture.parametrage.ville}, ${selectedFacture.parametrage.codePostal}`
                            : "-"}
                        </Text>
                      </View>
                      {/* Informations du client à droite */}
                      <View style={styles.section}>
                        <View style={{ marginTop: -70, marginLeft: 375 }}>
                          {selectedFacture &&
                            selectedFacture.client &&
                            selectedFacture.client.matriculeFiscale && (
                              <Text style={styles.subtitle}>
                                Matricule Fiscale:{" "}
                                {selectedFacture.client.matriculeFiscale}
                              </Text>
                            )}
                          <Text style={styles.subtitle}>
                            Client:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.name
                              : "-"}
                          </Text>
                          <Text style={styles.subtitle}>
                            Entreprise:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.namecompany.toUpperCase()
                              : "-"}
                          </Text>
                          <Text style={styles.subtitle}>
                            Email:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.email
                              : "-"}
                          </Text>
                          <Text style={styles.subtitle}>
                            Tél:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.phonenumber
                              : "-"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.table}>
                        <View style={styles.tableRow}>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                              Référence
                            </Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                              Désignation
                            </Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Unité</Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>TVA</Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Quantité</Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                              Prix unitaire
                            </Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                              Remise (%)
                            </Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                              Montant HT
                            </Text>
                          </View>
                        </View>
                        {selectedFacture &&
                        selectedFacture.services &&
                        Array.isArray(selectedFacture.services) &&
                        selectedFacture.services.length > 0 ? (
                          selectedFacture.services.map((service, index) => (
                            <View style={styles.tableRow} key={index}>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.reference}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.libelle}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.unite}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.tva}%
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.quantite}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.prix_unitaire}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.remise}%
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.montant_ht}
                                </Text>
                              </View>
                            </View>
                          ))
                        ) : (
                          <View style={styles.tableRow}>
                            <View style={styles.tableCol} colSpan={7}>
                              <Text style={styles.tableCell}>
                                Aucun service trouvé.
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>

                      <View style={styles.totalsContainer}>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.totalsText}>
                            Arrêtée la présente facture à la somme de{" "}
                          </Text>
                          <Text style={styles.totalsText}>
                            {selectedFacture
                              ? selectedFacture.totalTTCLettre
                              : "-"}
                          </Text>
                        </View>
                        <View style={styles.totalsRight}>
                          <View style={styles.totalsTable}>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total HT
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture
                                    ? selectedFacture.totalHT.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Remise
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture
                                    ? selectedFacture.totalRemise.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total HT après Remise
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture
                                    ? selectedFacture.totalHTApresRemise.toFixed(
                                        3
                                      )
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total TVA
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture
                                    ? selectedFacture.totalTVA.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Timbre Fiscal
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture
                                    ? selectedFacture.timbre.value.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total TTC
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture
                                    ? selectedFacture.totalTTC.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>
                          Tél:{" "}
                          {selectedFacture
                            ? selectedFacture.parametrage.phonenumber
                            : "-"}{" "}
                          | Email:{" "}
                          {selectedFacture
                            ? selectedFacture.parametrage.email
                            : "-"}{" "}
                          | Adresse:{" "}
                          {selectedFacture
                            ? `${selectedFacture.parametrage.adresseEntreprise}, ${selectedFacture.parametrage.ville}, ${selectedFacture.parametrage.codePostal}`
                            : "-"}
                        </Text>
                      </View>
                    </Page>
                  </Document>
                }
                fileName="facture.pdf"
              >
                {({ loading }) =>
                  loading ? "Chargement..." : "Télécharger le PDF"
                }
              </PDFDownloadLink>
            }
            width={800}
          >
            <div
              style={{
                textAlign: "center",
                margin: "20px auto",
                maxWidth: "600px",
              }}
            >
              {selectedFacture && (
                <>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Numéro de facture : {selectedFacture.numeroFacture}
                  </p>
                  {/* Ajoutez d'autres détails de la facture ici si nécessaire */}
                  <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                    Cliquez sur le bouton ci-dessous pour télécharger votre
                    facture au format PDF :
                  </p>
                  {/* Ajoutez votre bouton de téléchargement ici */}
                </>
              )}
            </div>
          </Modal>
        </>
      ) : (
        <p>Aucune facture trouvée pour ce client.</p>
      )}
    </div>
  );
};

export default FactClient;
