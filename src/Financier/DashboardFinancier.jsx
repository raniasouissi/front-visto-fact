import React from "react";

const DashboardFinancier = () => {
  return (
    <div>
      <h1>Bienvenue sur le tableau de bord financier</h1>

      <section>
        <h2>Rapports financiers</h2>
        <p>
          Consultez les rapports financiers mensuels, trimestriels et annuels.
        </p>
        <button>Télécharger les rapports</button>
      </section>

      <section>
        <h2>Gestion des factures</h2>
        <p>Visualisez et gérez les factures clients et fournisseurs.</p>
        <button>Consulter les factures</button>
      </section>

      <section>
        <h2>Analyse des dépenses</h2>
        <p>Effectuez une analyse approfondie des dépenses de lentreprise.</p>
        <button>Accéder à lanalyse des dépenses</button>
      </section>
    </div>
  );
};

export default DashboardFinancier;
