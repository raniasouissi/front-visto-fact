import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, Modal } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  EditOutlined,
  BellOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import Taxe from "../Admin/Taxe/Taxe";
import Parametrage from "../Admin/Parametrage/Parametrage";
import Logo1 from "../assets/images/vbil2.png";
import AvatarImage from "../assets/images/admin1.png";

import Service from "../Admin/Service/Service";
import { useNavigate } from "react-router-dom";

import Devise from "../Admin/Devise/devise";
import Categorie from "../Admin/Catégorie-service/categorie";
import Facture from "../Admin/Facture/facture";
import Client from "./Client/client";
import ModifierProfil from "./modiferprofil";

const { Sider, Content, Header } = Layout;

const DashboardFinancier = () => {
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
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("Username");
  console.log("email", email);

  const menu = (
    <Menu style={{ width: "240px" }}>
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

            <span style={{ fontSize: "14px", color: "#666" }}>{role}</span>
            <span style={{ fontSize: "14px", color: "#999" }}>{email}</span>
          </div>
        </div>
      </Menu.Item>
      <Menu.Item
        key="ModifierProfil"
        icon={<EditOutlined style={{ color: "#333333" }} />}
        onClick={() => handleMenuClick("ModifierProfil")}
        className={currentPage === "ModifierProfil" ? "active" : ""}
        style={{
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
          padding: "16px",
          color: "#3f3c3c",
          marginTop: -10,
          marginBottom: -20,
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
        }}
        icon={<LogoutOutlined />}
        onClick={handleLogoutConfirmation}
      >
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  {
    if (token !== null) {
      return (
        <Layout className="dashboard-container">
          <Sider
            className="sidebar"
            collapsible={false}
            trigger={null}
            width={250}
          >
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
                key="clients"
                icon={<UserOutlined style={{ color: "#333333" }} />}
                onClick={() => handleMenuClick("clients")}
                className={currentPage === "clients" ? "active" : ""}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                  color: "#19191a",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginLeft: -34,
                  borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
                  lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
                  marginBottom: "10px",
                  width: "auto",
                }}
              >
                Clients
              </Menu.Item>

              <Menu.SubMenu
                style={{
                  marginLeft: -40,
                  borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
                  lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
                  marginBottom: "10px",
                  background: "white ",
                }}
                key="Service"
                icon={<AppstoreOutlined style={{ color: "#333333" }} />}
                title={
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "bold",
                      color: "#19191a",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      width: "auto",
                      borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
                      lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
                    }}
                  >
                    Catalogue
                  </span>
                }
                className={
                  currentPage === "Service" || currentPage === "Categorie"
                    ? "active"
                    : ""
                }
              >
                <Menu.Item
                  key="Service"
                  onClick={() => handleMenuClick("Service")}
                  style={{
                    letterSpacing: "1px",

                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#333333",
                    width: "auto",
                    borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
                    lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
                  }}
                >
                  Services
                </Menu.Item>
                <Menu.Item
                  key="Categorie"
                  onClick={() => handleMenuClick("Categorie")}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#333333",
                    marginBottom: "10px",

                    letterSpacing: "1px",
                  }}
                >
                  Catégories
                </Menu.Item>
              </Menu.SubMenu>

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
              <Menu.SubMenu
                style={{
                  marginLeft: -40,
                  borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
                  lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
                  marginBottom: "10px",
                  width: "auto",
                }}
                key="Parametrage"
                icon={<SettingOutlined style={{ color: "#333333" }} />}
                title={
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "bold",
                      color: "#19191a",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Paramétrage
                  </span>
                }
                className={
                  currentPage === "Parametrage" ||
                  currentPage === "Taxe" ||
                  currentPage === "Devise"
                    ? "active"
                    : ""
                }
              >
                <Menu.Item
                  key="Parametrage"
                  onClick={() => handleMenuClick("Parametrage")}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#333333",
                    letterSpacing: "1px",
                    borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
                    lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
                    marginBottom: "10px",
                    width: "auto",
                  }}
                >
                  Fiche Entreprise
                </Menu.Item>
                <Menu.Item
                  key="Taxe"
                  onClick={() => handleMenuClick("Taxe")}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#333333",
                    letterSpacing: "1px",
                    borderBottom: "1px solid #ccc", // Ajoute une ligne en bas de l'élément
                    lineHeight: "50px", // Ajuste l'espacement vertical pour centrer l'icône et le texte
                    marginBottom: "10px",
                    width: "auto",
                  }}
                >
                  Taxe
                </Menu.Item>
                <Menu.Item
                  key="Devise"
                  onClick={() => handleMenuClick("Devise")}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#333333",
                    letterSpacing: "1px",
                  }}
                >
                  Devise
                </Menu.Item>
              </Menu.SubMenu>
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
              {currentPage === "clients" && <Client />}
              {currentPage === "Parametrage" && <Parametrage />}
              {currentPage === "Taxe" && <Taxe />}
              {currentPage === "Service" && <Service />}
              {currentPage === "Devise" && <Devise />}
              {currentPage === "Categorie" && <Categorie />}
              {currentPage === "Facture" && <Facture />}
              {currentPage === "ModifierProfil" && <ModifierProfil />}
            </Content>
          </Layout>
        </Layout>
      );
    } else {
      history("/login");
    }
  }
};

export default DashboardFinancier;
