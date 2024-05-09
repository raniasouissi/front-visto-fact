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
              color: "white",
              background: currentPage === "users" ? "#6f7173" : "transparent",
            }}
          >
            <span className="menu-item-text">Utilisateurs</span>
          </Menu.Item>
          <Menu.SubMenu
            key="Parametrage"
            icon={<SettingOutlined style={{ color: "white" }} />}
            title={<span style={{ color: "white" }}>Parametrage</span>}
            style={{ background: "transparent", color: "white" }}
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
                background: currentPage === "Taxe" ? "#6f7173" : "transparent",
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
              }}
            >
              <span className="menu-item-text">Devise</span>
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.SubMenu
            key="Service"
            icon={<AppstoreOutlined style={{ color: "white" }} />}
            title={<span style={{ color: "white" }}>Catalouge</span>}
            style={{ background: "transparent", color: "white" }}
            popupClassName="custom-submenu"
          >
            <Menu.Item
              key="Service"
              onClick={() => handleMenuClick("Service")}
              icon={<ToolOutlined style={{ color: "white" }} />}
              style={{
                color: "white",
                background:
                  currentPage === "Service" ? "#7f7d7d" : "transparent",
              }}
            >
              <span className="menu-item-text">Service</span>
            </Menu.Item>
            <Menu.Item
              key="categorie"
              onClick={() => handleMenuClick("Categorie")}
              icon={<ShopOutlined />}
              style={{
                color: "white",
                background:
                  currentPage === "Categorie" ? "#6f7173" : "transparent",
              }}
            >
              <span className="menu-item-text">Catégorie</span>
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardAdmin;
