import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  VictoryPie,
  VictoryLabel,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
} from "victory";

const Statistique = () => {
  const [dataServices, setDataServices] = useState([]);
  const [dataFactures, setDataFactures] = useState([]);
  const [dataUtilisateurs, setDataUtilisateurs] = useState([]);
  const [dataClients, setDataClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clients");
        setDataClients(response.data);
        console.log("Données des clients récupérées :", response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données des clients :",
          error
        );
      }
    };

    fetchClients();
  }, []);

  // Chargement des données de services depuis l'API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services");
        setDataServices(response.data);
        console.log("Données de services récupérées :", response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données de services :",
          error
        );
      }
    };

    fetchServices();
  }, []);

  // Chargement des données de factures depuis l'API
  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/facture");
        setDataFactures(response.data);
        console.log("Données de factures récupérées :", response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données de factures :",
          error
        );
      }
    };

    fetchFactures();
  }, []);

  // Chargement des données de utilisateurs depuis l'API
  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setDataUtilisateurs(response.data);
        console.log("Données de utilisateurs récupérées :", response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données de utilisateurs :",
          error
        );
      }
    };

    fetchUtilisateurs();
  }, []);

  const countClients = dataUtilisateurs.filter(
    (user) => user.roles[0] === "client"
  ).length;
  const countFinanciers = dataUtilisateurs.filter(
    (user) => user.roles[0] === "financier"
  ).length;

  const dataUser = [
    { type: "Clients", count: countClients },
    { type: "Financiers", count: countFinanciers },
  ];

  const countActifs = dataUtilisateurs.filter((u) => u.status === true).length;
  const countInactifs = dataUtilisateurs.filter(
    (u) => u.status === false
  ).length;

  // Données pour le graphique
  const dataStatus = [
    { type: "Actifs", count: countActifs },
    { type: "Inactifs", count: countInactifs },
  ];

  // Calcul du nombre total de services
  const totalServices = dataServices.filter(
    (service) => service.categories !== null
  ).length;

  // Calcul du nombre total de factures
  const totalFactures = dataFactures.length;

  // Calcul du nombre de factures payées et partiellement payées
  const countPayees = dataFactures.filter((facture) =>
    facture.paiemnts.some((paiement) => paiement.etatpaiement === "Payé")
  ).length;

  const countPartiellementPayees = dataFactures.filter((facture) =>
    facture.paiemnts.some(
      (paiement) => paiement.etatpaiement === "partiellementPayé"
    )
  ).length;

  // Calcul des pourcentages
  const pourcentagePayees = (countPayees / totalFactures) * 100;
  const pourcentagePartiellementPayees =
    (countPartiellementPayees / totalFactures) * 100;

  // Affichage dans la console pour vérification
  console.log("Nombre total de factures :", totalFactures);
  console.log("Nombre de factures payées :", countPayees);
  console.log(
    "Nombre de factures partiellement payées :",
    countPartiellementPayees
  );
  console.log(
    "Pourcentage de factures payées :",
    pourcentagePayees.toFixed(2) + "%"
  );
  console.log(
    "Pourcentage de factures partiellement payées :",
    pourcentagePartiellementPayees.toFixed(2) + "%"
  );

  let physicalClientsCount = 0;
  let legalClientsCount = 0;

  dataClients.forEach((client) => {
    if (client.type === "client physique") {
      physicalClientsCount++;
    } else if (client.type === "client morale") {
      legalClientsCount++;
    }
  });

  const data = [
    { type: "Physique", count: physicalClientsCount },
    { type: "Moral", count: legalClientsCount },
  ];

  const gradientColors = [
    "rgba(90, 154, 230, 1)",
    "rgba(131, 111, 255, 1)",
    "rgba(175, 95, 252, 1)",
    "rgba(214, 91, 237, 1)",
    "rgba(248, 86, 213, 1)",
    "rgba(255, 102, 145, 1)",
    "rgba(255, 121, 121, 1)",
    "rgba(255, 138, 101, 1)",
  ];

  return (
    <div
      className="dashboard"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        className="totals-row"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div
          className="total-container"
          style={{
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: gradientColors[0],
            color: "#fff",
            flex: "1 1 calc(25% - 20px)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "16px" }}>Services</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {totalServices}
          </p>
        </div>
        <div
          className="total-container"
          style={{
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: gradientColors[1],
            color: "#fff",
            flex: "1 1 calc(25% - 20px)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "16px" }}> Utilisateurs</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {dataUtilisateurs.length}
          </p>
        </div>
        <div
          className="total-container"
          style={{
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: gradientColors[2],
            color: "#fff",
            flex: "1 1 calc(25% - 20px)",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "16px" }}>Factures</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {totalFactures}
          </p>
        </div>
      </div>

      <div
        className="chart-row"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div
          className="chart-container"
          style={{
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            flex: "1 1 calc(50% - 20px)",
          }}
        >
          <h2
            style={{
              marginBottom: -40,
              fontSize: "20px", // Taille de la police plus grande
              color: "#2C3E50", // Couleur du texte
              fontFamily: "'Roboto', sans-serif", // Police personnalisée, assurez-vous de l'importer si elle n'est pas déjà disponible
              fontWeight: "700", // Gras
              letterSpacing: "1px", // Espacement entre les lettres
              margin: "20px 0", // Espacement autour du titre
              background: "linear-gradient(to right, #d41ec8 0%, #330867 100%)", // Dégradé de couleur
              WebkitBackgroundClip: "text", // Clip l'arrière-plan au texte
              WebkitTextFillColor: "transparent", // Remplissage transparent pour montrer le dégradé
            }}
          >
            Utilisateurs
          </h2>
          <VictoryPie
            data={dataUser}
            x="type"
            y="count"
            innerRadius={60}
            colorScale={gradientColors.slice(2, 4)}
            labels={({ datum }) => `${datum.type}: ${datum.count}`}
            labelComponent={
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 12, fill: "#2C3E50", fontWeight: "bold" }}
              />
            }
            style={{
              labels: {
                fontSize: 12,
                fill: "#2C3E50",
                fontWeight: "bold",
                padding: 10,
              },
              data: {
                stroke: "#fff",
                strokeWidth: 2,
                filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))",
              },
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000, easing: "bounce" },
              onExit: {
                duration: 500,
                before: () => ({
                  _y: 0,
                  fill: "rgba(0, 0, 0, 0.2)",
                }),
              },
              onEnter: {
                duration: 500,
                before: () => ({
                  _y: 0,
                  fill: "rgba(0, 0, 0, 0.2)",
                }),
                after: (datum) => ({
                  _y: datum.y,
                  fill: datum.fill,
                }),
              },
            }}
            width={400}
            height={300}
          />
        </div>
        <div
          className="chart-container"
          style={{
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            flex: "1 1 calc(50% - 20px)",
          }}
        >
          <h2
            style={{
              marginBottom: -40,
              fontSize: "20px", // Taille de la police plus grande
              color: "#2C3E50", // Couleur du texte
              fontFamily: "'Roboto', sans-serif", // Police personnalisée, assurez-vous de l'importer si elle n'est pas déjà disponible
              fontWeight: "700", // Gras
              letterSpacing: "1px", // Espacement entre les lettres
              margin: "20px 0", // Espacement autour du titre
              background: "linear-gradient(to right, #30CFD0 0%, #330867 100%)", // Dégradé de couleur
              WebkitBackgroundClip: "text", // Clip l'arrière-plan au texte
              WebkitTextFillColor: "transparent", // Remplissage transparent pour montrer le dégradé
            }}
          >
            Types de Clients
          </h2>

          <VictoryPie
            data={data}
            x="type"
            y="count"
            innerRadius={60}
            colorScale={gradientColors}
            labels={({ datum }) => `${datum.type}: ${datum.count}`}
            labelComponent={
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 12, fill: "#2C3E50", fontWeight: "bold" }}
              />
            }
            style={{
              labels: {
                fontSize: 12,
                fill: "#2C3E50",
                fontWeight: "bold",
                padding: 10,
              },
              data: {
                stroke: "#fff",
                strokeWidth: 2,
                filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))",
              },
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000, easing: "bounce" },
              onExit: {
                duration: 500,
                before: () => ({
                  _y: 0,
                  fill: "rgba(0, 0, 0, 0.2)",
                }),
              },
              onEnter: {
                duration: 500,
                before: () => ({
                  _y: 0,
                  fill: "rgba(0, 0, 0, 0.2)",
                }),
                after: (datum) => ({
                  _y: datum.y,
                  fill: datum.fill,
                }),
              },
            }}
            width={400}
            height={300}
          />
        </div>
      </div>

      <div
        className="chart-row"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        <div
          className="chart-container"
          style={{
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            flex: "1 1 calc(50% - 20px)",
          }}
        >
          <h2
            style={{
              marginBottom: -40,
              fontSize: "20px", // Taille de la police plus grande
              color: "#2C3E50", // Couleur du texte
              fontFamily: "'Roboto', sans-serif", // Police personnalisée, assurez-vous de l'importer si elle n'est pas déjà disponible
              fontWeight: "700", // Gras
              letterSpacing: "1px", // Espacement entre les lettres
              margin: "20px 0", // Espacement autour du titre
              background: "linear-gradient(to right, #7349e6 0%, #330867 100%)", // Dégradé de couleur
              WebkitBackgroundClip: "text", // Clip l'arrière-plan au texte
              WebkitTextFillColor: "transparent", // Remplissage transparent pour montrer le dégradé
            }}
          >
            Utilisateurs Actifs et Inactifs
          </h2>
          <VictoryPie
            data={dataStatus}
            x="type"
            y="count"
            innerRadius={60}
            width={400}
            height={300}
            colorScale={gradientColors.slice(1, 3)}
            labels={({ datum }) => `${datum.type}: ${datum.count}`}
            labelComponent={
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 12, fill: "#2C3E50", fontWeight: "bold" }}
              />
            }
            style={{
              labels: {
                fontSize: 12,
                fill: "#2C3E50",
                fontWeight: "bold",
                padding: 10,
              },
              data: {
                stroke: "#fff",
                strokeWidth: 2,
                filter: "drop-shadow(0 0 5px rgba(0, 0, 0, 0.2))",
              },
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000, easing: "bounce" },
              onExit: {
                duration: 500,
                before: () => ({
                  _y: 0,
                  fill: "rgba(0, 0, 0, 0.2)",
                }),
              },
              onEnter: {
                duration: 500,
                before: () => ({
                  _y: 0,
                  fill: "rgba(0, 0, 0, 0.2)",
                }),
                after: (datum) => ({
                  _y: datum.y,
                  fill: datum.fill,
                }),
              },
            }}
          />
        </div>
        <div
          className="chart-container"
          style={{
            margin: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            flex: "1 1 calc(50% - 20px)",
          }}
        >
          <h2
            style={{
              fontSize: "24px", // Taille de la police plus grande
              color: "#2C3E50", // Couleur du texte
              fontFamily: "'Roboto', sans-serif", // Police personnalisée, assurez-vous de l'importer si elle n'est pas déjà disponible
              fontWeight: "700", // Gras
              letterSpacing: "1px", // Espacement entre les lettres
              margin: "20px 0", // Espacement autour du titre
              background: "linear-gradient(to right, #d67adc 0%, #330867 100%)", // Dégradé de couleur
              WebkitBackgroundClip: "text", // Clip l'arrière-plan au texte
              WebkitTextFillColor: "transparent", // Remplissage transparent pour montrer le dégradé
            }}
          >
            Statut des Factures
          </h2>

          <VictoryChart domainPadding={{ x: 50 }}>
            <VictoryBar
              data={[
                {
                  status: "Payé",
                  pourcentage: pourcentagePayees,
                  fill: "#c484b2", // Couleur personnalisée pour "Payé"
                },
                {
                  status: "Partiellement payé",
                  pourcentage: pourcentagePartiellementPayees,
                  fill: "#0d7477", // Couleur personnalisée pour "Partiellement payé"
                },
              ]}
              x="status"
              y="pourcentage"
              style={{
                data: {
                  width: 30,
                  fill: ({ datum }) => datum.fill, // Utilisation de la couleur personnalisée
                },
                labels: { fontSize: 14, fill: "#2C3E50" },
              }}
              labels={({ datum }) =>
                `${datum.status}: ${datum.pourcentage.toFixed(2)}%`
              }
              labelComponent={<VictoryLabel dy={-20} />}
            />
            <VictoryAxis
              style={{ tickLabels: { fontSize: 12, fill: "#2C3E50" } }}
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};

export default Statistique;
