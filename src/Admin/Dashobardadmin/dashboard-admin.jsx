import React, { useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Badge, Modal } from "antd";
import {
  MoneyCollectOutlined,
  UserOutlined,
  SettingOutlined,
  ToolOutlined,
  EditOutlined,
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  ShopOutlined,
  DollarCircleOutlined,
  AppstoreOutlined,
  FileOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
import Taxe from "../Taxe/Taxe";
import Parametrage from "../Parametrage/Parametrage";
import Logo1 from "../../assets/images/vbil2.png";
import AvatarImage from "../../assets/images/admin1.png";
import "./dashboard-admin.css";
import Service from "../Service/Service";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Users from "../Users/users";
import Devise from "../Devise/devise";
import Categorie from "../Catégorie-service/categorie";
import Facture from "../Facture/facture";

const { Sider, Content, Header } = Layout;

const DashboardAdmin = () => {
  const [currentPage, setCurrentPage] = useState(null);

  const history = useNavigate();

  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };

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

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<EditOutlined />}>
        Modifier le profil
      </Menu.Item>
      <Menu.Item key="2" icon={<ToolOutlined />}>
        Autres tâches
      </Menu.Item>
      <Menu.Item
        key="3"
        icon={<LogoutOutlined />}
        onClick={handleLogoutConfirmation}
      >
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="dashboard-container">
      <Sider className="sidebar" collapsible={false} trigger={null}>
        <div className="logo-title-container">
          <img src={Logo1} alt="Menu Logo" className="sidebar-logo" />
          <h1 className="app-title">VBill</h1>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          style={{ background: "transparent" }}
        >
          <Menu.Item
            key="users"
            icon={<UserOutlined style={{ color: "white" }} />}
            onClick={() => handleMenuClick("users")}
            style={{
              marginLeft: -10,
              color: "white",
              fontSize: 15,
              borderBottom: "1px solid #a99b9b",
              borderRadius: "1",
              width: "110%",

              background: currentPage === "users" ? "#a99b9b" : "transparent",
            }}
          >
            <span className="menu-item-text">Utilisateurs</span>
          </Menu.Item>

          <Menu.SubMenu
            key="Service"
            icon={
              <AppstoreOutlined style={{ color: "white", marginRight: 6 }} />
            }
            title={
              <span style={{ color: "white", fontSize: 14 }}>Catalouge</span>
            }
            style={{
              marginLeft: -15,
              color: "white",
              fontSize: 15,
              borderBottom: "1px solid #a99b9b",
              borderRadius: "1",
              width: "110%",
            }}
            popupClassName="custom-submenu"
          >
            <Menu.Item
              key="Service"
              onClick={() => handleMenuClick("Service")}
              icon={<ToolOutlined style={{ color: "white" }} />}
              style={{
                color: "white",
                background:
                  currentPage === "Service" ? "#6f7173" : "transparent",
                fontSize: 15,
                marginBottom: 5,
                width: "110%",
              }}
            >
              <span className="menu-item-text">Services</span>
            </Menu.Item>
            <Menu.Item
              key="categorie"
              onClick={() => handleMenuClick("Categorie")}
              icon={<ShopOutlined />}
              style={{
                color: "white",
                background:
                  currentPage === "Categorie" ? "#6f7173" : "transparent",
                marginBottom: 10,
                fontSize: 14,
                width: "110%",
              }}
            >
              <span className="menu-item-text">Catégories</span>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item
            key="Facture"
            icon={<AccountBookOutlined style={{ color: "white" }} />}
            onClick={() => handleMenuClick("Facture")}
            style={{
              marginLeft: -10,
              color: "white",
              fontSize: 15,
              borderBottom: "1px solid #a99b9b",
              borderRadius: "1",
              width: "110%",

              background: currentPage === "Facture" ? "#a99b9b" : "transparent",
            }}
          >
            <span className="menu-item-text">Factures</span>
          </Menu.Item>
          <Menu.SubMenu
            key="Parametrage"
            icon={
              <SettingOutlined style={{ color: "white", marginRight: 5 }} />
            }
            title={
              <span style={{ color: "white", fontSize: 14 }}>Parametrage</span>
            }
            style={{
              marginLeft: -15,
              color: "white",
              fontSize: 15,
              borderBottom: "1px solid #a99b9b",
              borderRadius: "1",
              width: "110%",
            }}
          >
            <Menu.Item
              key="parametrage"
              onClick={() => handleMenuClick("Parametrage")}
              icon={<FileOutlined />}
              style={{
                color: "white",
                background:
                  currentPage === "Parametrage" ? "#7f7d7d" : "transparent",
                fontSize: "13px",
                width: "110%",
              }}
            >
              <span className="menu-item-text"> Fiche Entreprise</span>
            </Menu.Item>
            <Menu.Item
              key="taxe"
              onClick={() => handleMenuClick("Taxe")}
              icon={<MoneyCollectOutlined />}
              style={{
                color: "white",
                marginBottom: 5,
                background: currentPage === "Taxe" ? "#6f7173" : "transparent",
                width: "110%",
              }}
            >
              <span className="menu-item-text">Taxe</span>
            </Menu.Item>
            <Menu.Item
              key="devise"
              onClick={() => handleMenuClick("Devise")}
              icon={<DollarCircleOutlined />}
              style={{
                color: "white",
                background:
                  currentPage === "Devise" ? "#6f7173" : "transparent",
                marginBottom: 15,
                width: "110%",
              }}
            >
              <span className="menu-item-text">Devise</span>
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
                <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content
          className={`content ${
            currentPage ? `${currentPage.toLowerCase()}-page` : ""
          }`}
        >
          {currentPage === "users" && <Users />}
          {currentPage === "Parametrage" && <Parametrage />}
          {currentPage === "Taxe" && <Taxe />}
          {currentPage === "Service" && <Service />}
          {currentPage === "Devise" && <Devise />}
          {currentPage === "Categorie" && <Categorie />}
          {currentPage === "Facture" && <Facture />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardAdmin;
