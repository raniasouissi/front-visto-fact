import React from "react";
import { Button, Modal } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./LogoutButton.css"; // Importer le fichier CSS

const Logout = () => {
  const history = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        Cookies.remove("AuthenticationToken");
        history("/login");
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  const handleLogoutConfirmation = () => {
    Modal.confirm({
      title: "Confirmation",
      content: "Êtes-vous sûr de vouloir vous déconnecter ?",
      okText: "Oui",
      cancelText: "Annuler",
      onOk: handleLogout,
    });
  };

  return (
    <Button
      className="logout-button" // Ajouter une classe pour les styles CSS
      onClick={handleLogoutConfirmation}
      icon={<LogoutOutlined />}
      type="primary"
      danger
    >
      Déconnexion
    </Button>
  );
};

export default Logout;
