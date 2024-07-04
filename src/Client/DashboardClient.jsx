import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, Modal } from "antd";
import {
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ModifierProfil from "../Financier/modiferprofil";
import Logo1 from "../assets/images/vbil2.png";
import AvatarImage from "../assets/images/avv.png";
import FactClient from "./FactureClient/FactClient";
import axios from "axios";
import "./DashboardClient.css";

const { Header, Content } = Layout;

const DashboardClient = () => {
  const [currentPage, setCurrentPage] = useState("Facture"); // Mettez "Facture" pour charger cette page par défaut
  const [notifications, setNotifications] = useState([]);
  const history = useNavigate();

  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };

  const token = localStorage.getItem("token");
  function checkTokenExpiration() {
    const expireTime = localStorage.getItem("expireTime");

    if (!token || !expireTime) {
      return null;
    }

    const currentTime = Date.now();
    if (currentTime > parseInt(expireTime, 10)) {
      // Le token a expiré
      localStorage.removeItem("token");
      localStorage.removeItem("expireTime");
      return null;
    }

    return token;
  }

  useEffect(() => {
    checkTokenExpiration();

    // Vérifiez l'expiration du token toutes les minutes
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60 * 1000); // Toutes les minutes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []); // Mettez vide, car vous ne dépendez pas de idProfil pour charger les notifications

  const fetchNotifications = () => {
    const idProfil = localStorage.getItem("id");
    axios
      .get("http://localhost:5000/api/notifications/" + idProfil)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des données de user :", error)
      );
  };

  const deleteNotification = (notificationId) => {
    axios
      .delete(`http://localhost:5000/api/notifications/${notificationId}`)
      .then(() => {
        setNotifications(
          notifications.filter((notif) => notif._id !== notificationId)
        );
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la suppression de la notification :",
          error
        )
      );
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      localStorage.removeItem("UserEmail");
      localStorage.removeItem("Username");

      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
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

  const email = localStorage.getItem("UserEmail");
  const name = localStorage.getItem("Username");

  const menu = (
    <Menu
      style={{
        width: "240px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Menu.Item
        key="0"
        style={{ padding: "16px", borderBottom: "1px solid #d9d9d9" }}
      >
        <div style={{ display: "flex", alignItems: "center", marginTop: -10 }}>
          <Avatar
            size={35}
            style={{
              backgroundColor: "#1890ff",
              marginRight: "7px",
              marginLeft: -10,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
            <span style={{ fontSize: "14px", color: "#999" }}>{email}</span>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item
        key="ModifierProfil"
        icon={<UserOutlined style={{ color: "#1890ff" }} />}
        onClick={() => handleMenuClick("ModifierProfil")}
        className={currentPage === "ModifierProfil" ? "active" : ""}
        style={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          padding: "16px",
          color: "#1890ff",
          marginTop: -10,
          marginBottom: -20,
          borderRadius: "8px",
          transition: "background-color 0.3s",
          cursor: "pointer",
        }}
      >
        Profil
      </Menu.Item>
      <Menu.Item
        key="2"
        style={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          padding: "16px",
          color: "#ff4d4f",
          borderRadius: "8px",
          transition: "background-color 0.3s",
          cursor: "pointer",
        }}
        icon={<LogoutOutlined />}
        onClick={handleLogoutConfirmation}
      >
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu style={{ minWidth: "200px", fontSize: "14px" }}>
      <Menu.Item disabled key="title" style={{ fontSize: "11px" }}>
        <div style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>
          <strong style={{ fontSize: "20px", color: "#333" }}>
            Notifications
          </strong>
          <br />
          <span
            style={{ fontSize: "20px", color: "#101e96", fontStyle: "italic" }}
          >
            Bonjour, {name} !
          </span>
        </div>
      </Menu.Item>
      {notifications.map((notification, index) => (
        <Menu.Item
          key={index}
          style={{
            fontSize: "14px",
            paddingLeft: "20px",
            paddingRight: "12px",
            position: "relative",
          }}
        >
          <div style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "14px", color: "#333" }}>
                {notification.notif}
              </span>
              <CloseOutlined
                onClick={() => deleteNotification(notification._id)}
                style={{
                  color: "#f5222d",
                  fontSize: "14px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "11px",
                color: "#999",
                marginTop: "2px",
                display: "block",
              }}
            >
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout className="dashboard-container">
      <Header className="headerad">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginRight: 400,
          }}
        >
          <img
            src={Logo1}
            alt="Menu Logo"
            style={{ marginRight: 10, height: 40 }}
          />
          <h1 className="app-title" style={{ margin: 0 }}>
            <span className="v">V</span>
            <span className="b">Bill</span>
          </h1>
        </div>

        <div className="right-menu">
          <div style={{ marginRight: 600 }}>
            <button
              onClick={() => handleMenuClick("Facture")}
              className={`menu-item ${
                currentPage === "Facture" ? "active" : ""
              }`}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                color: currentPage === "Facture" ? "#121477" : "#19191a",
                fontSize: "16px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: "1px solid #ccc",
                lineHeight: "50px",
                marginBottom: "-10px",
                width: "auto",
                borderRadius: "4px",
                cursor: "pointer",
                padding: "0 15px",
                transition: "color 0.3s, border-color 0.3s", // Ajout d'une transition pour la couleur et la bordure
                border: "none",
                outline: "none",
                background: "none",
                display: "inline-flex", // Permet de centrer verticalement
                alignItems: "center",
                justifyContent: "center",
                position: "relative", // Pour les animations
              }}
            >
              Mes Factures
            </button>
          </div>

          <Dropdown overlay={notificationMenu} trigger={["click"]}>
            <Badge count={notifications.length} offset={[10, 0]}>
              <BellOutlined />
            </Badge>
          </Dropdown>

          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar size={44} src={AvatarImage} className="avatar" />{" "}
            </a>
          </Dropdown>
        </div>
      </Header>
      <Content
        className={`content ${currentPage && currentPage.toLowerCase()}`}
      >
        {currentPage === "ModifierProfil" && <ModifierProfil />}
        {currentPage === "Facture" && <FactClient />}
      </Content>
    </Layout>
  );
};

export default DashboardClient;
