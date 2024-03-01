import React from "react";

const DashboardAdmin = () => {
  return (
    <div>
      <h1>Bienvenue sur le tableau de bord administrateur</h1>

      <section>
        <h2>Statistiques</h2>
        <p>Nombre dutilisateurs enregistrés : 500</p>
        <p>Commandes en attente : 20</p>
        {/* Ajoutez d'autres statistiques pertinentes */}
      </section>

      <section>
        <h2>Gestion des utilisateurs</h2>
        <ul>
          <li>Liste des utilisateurs</li>
          <li>Ajouter un nouvel utilisateur</li>
          <li>Modifier les autorisations des utilisateurs</li>
        </ul>
      </section>

      <section>
        <h2>Paramètres</h2>
        <p>Modifier les paramètres du tableau de bord</p>
      </section>
    </div>
  );
};

export default DashboardAdmin;
