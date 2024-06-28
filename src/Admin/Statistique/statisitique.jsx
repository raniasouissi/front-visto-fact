import React from "react";
import {
  VictoryPie,
  VictoryLabel,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
} from "victory";

const Statistique = () => {
  // Données fictives pour les utilisateurs en nombre
  const dataUtilisateurs = [
    { type: "Client", nombre: 25 },
    { type: "Financier", nombre: 3 },
  ];

  // Calcul du total des utilisateurs
  const totalUtilisateurs = dataUtilisateurs.reduce(
    (total, utilisateur) => total + utilisateur.nombre,
    0
  );

  // Conversion des nombres d'utilisateurs en pourcentage
  const dataUtilisateursPourcentage = dataUtilisateurs.map((utilisateur) => ({
    type: utilisateur.type,
    pourcentage: (utilisateur.nombre / totalUtilisateurs) * 100,
  }));

  // Données fictives pour les types de clients
  const dataTypesClients = [
    { type: "Physique", pourcentage: 70 },
    { type: "Morale", pourcentage: 30 },
  ];

  // Données fictives pour les types d'utilisateurs actifs et inactifs
  const dataTypesUtilisateurs = [
    { type: "Actif", pourcentage: 80 },
    { type: "Inactif", pourcentage: 20 },
  ];

  // Données fictives pour les factures
  const dataFactures = [
    { status: "Payé", quantite: 45 },
    { status: "Partiellement payé", quantite: 15 },
  ];

  // Couleurs tendance pour les graphiques (dégradé bleu-violet)
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
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>25</p>
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
            {totalUtilisateurs}
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
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>20</p>
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
          <h2 style={{ fontSize: "16px", color: gradientColors[1] }}>
            Utilisateurs
          </h2>
          <VictoryPie
            data={dataUtilisateursPourcentage}
            x="type"
            y="pourcentage"
            innerRadius={60}
            width={400}
            height={300}
            colorScale={gradientColors.slice(0, 2)}
            labels={({ datum }) =>
              `${datum.type}: ${datum.pourcentage.toFixed(2)}%`
            }
            labelComponent={
              <VictoryLabel style={{ fontSize: 12, fill: "#2C3E50" }} />
            }
            style={{ labels: { fontSize: 12, fill: "#2C3E50" } }}
            animate={{ duration: 1000 }}
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
          <h2 style={{ fontSize: "16px", color: gradientColors[2] }}>
            Types de Clients
          </h2>
          <VictoryPie
            data={dataTypesClients}
            x="type"
            y="pourcentage"
            innerRadius={60}
            width={400}
            height={300}
            colorScale={gradientColors.slice(2, 4)}
            labels={({ datum }) =>
              `${datum.type}: ${datum.pourcentage.toFixed(2)}%`
            }
            labelComponent={
              <VictoryLabel style={{ fontSize: 12, fill: "#2C3E50" }} />
            }
            style={{ labels: { fontSize: 12, fill: "#2C3E50" } }}
            animate={{ duration: 1000 }}
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
          <h2 style={{ fontSize: "16px", color: gradientColors[4] }}>
            Utilisateurs Actifs et Inactifs
          </h2>
          <VictoryPie
            data={dataTypesUtilisateurs}
            x="type"
            y="pourcentage"
            innerRadius={60}
            width={400}
            height={300}
            colorScale={gradientColors.slice(4, 6)}
            labels={({ datum }) =>
              `${datum.type}: ${datum.pourcentage.toFixed(2)}%`
            }
            labelComponent={
              <VictoryLabel style={{ fontSize: 12, fill: "#2C3E50" }} />
            }
            style={{ labels: { fontSize: 12, fill: "#2C3E50" } }}
            animate={{ duration: 1000 }}
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
          <h2 style={{ fontSize: "16px", color: gradientColors[6] }}>
            Statut des Factures
          </h2>
          <VictoryChart domainPadding={{ x: 50 }}>
            <VictoryBar
              data={dataFactures}
              x="status"
              y="quantite"
              style={{
                data: { fill: gradientColors[6] },
                labels: { fontSize: 12, fill: "#2C3E50" },
              }}
              labels={({ datum }) => `${datum.status}: ${datum.quantite}`}
              labelComponent={<VictoryLabel dy={30} />}
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
