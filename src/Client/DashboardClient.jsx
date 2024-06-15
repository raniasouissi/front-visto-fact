import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, Modal } from "antd";
import {
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import ModifierProfil from "../Financier/modiferprofil";
import Logo1 from "../assets/images/vbil2.png";
import AvatarImage from "../assets/images/admin1.png";
import FactClient from "./FactureClient/FactClient";

const { Sider, Header, Content } = Layout;

const DashboardClient = () => {
  const [currentPage, setCurrentPage] = useState(null);

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
      localStorage.removeItem(token);
      localStorage.removeItem(expireTime);
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

  console.log("token", token);
  const email = localStorage.getItem("UserEmail");
  const name = localStorage.getItem("Username");
  console.log("email", email);

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
  return (
    <Layout className="dashboard-container">
      <Sider className="sidebar" collapsible={false} trigger={null} width={250}>
        <div className="logo-title-container">
          <img src={Logo1} alt="Menu Logo" className="sidebar-logo" />
          <h1 className="app-title">
            <span className="v">V</span>
            <span className="b">Bill</span>
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          style={{ background: "white", marginTop: "-15px" }}
          className="sidebar-menu" // Ajouter une classe pour cibler tous les éléments du menu
        >
          <Menu.Item
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              color: "#19191a",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginLeft: -35,
              borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
              lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
              marginBottom: "10px",
              width: "auto",
            }}
            key="Facture"
            icon={<AccountBookOutlined style={{ color: "#333333" }} />}
            onClick={() => handleMenuClick("Facture")}
            className={currentPage === "Facture" ? "active" : ""}
          >
            Factures
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="headerad">
          <div className="right-menu">
            <Badge count={0}>
              <BellOutlined className="notification-icon" />
            </Badge>
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
    </Layout>
  );
};

export default DashboardClient;
