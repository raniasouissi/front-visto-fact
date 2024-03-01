import React from "react";

const DashboardClient = () => {
  return (
    <div>
      <h1>Bienvenue sur votre tableau de bord, cher client !</h1>

      <section>
        <h2>Vos commandes</h2>
        <ul>
          <li>Commande #1234 - En cours de traitement</li>
          <li>Commande #5678 - Livraison prévue aujourdhui</li>
          {/* Ajoutez d'autres éléments de commande si nécessaire */}
        </ul>
      </section>

      <section>
        <h2>Votre compte</h2>
        <p>
          Informations sur votre compte : adresse, informations de paiement,
          etc.
        </p>
        <button>Modifier les informations du compte</button>
      </section>

      <section>
        <h2>Vos préférences</h2>
        <p>Paramètres de notification, préférences de langue, etc.</p>
        <button>Modifier les préférences</button>
      </section>
    </div>
  );
};

export default DashboardClient;
