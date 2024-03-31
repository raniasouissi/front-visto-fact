// Import des bibliothèques nécessaires
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  LeftOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import FinancierManagement from "../FinanicerMangement/FinancierManagement";
import ClientManagement from "../ClientManagement/ClientManagement";
import Parametrage from "../Parametrage/Parametrage";
import Logo1 from "../../assets/images/logo.png"; // Import du logo
import "./dashboard-admin.css"; // Import des styles CSS
import Service from "../Service/service";

const { Sider, Content } = Layout;

// Composant principal DashboardAdmin
const DashboardAdmin = () => {
  // États pour gérer la page actuelle et l'état du menu
  const [currentPage, setCurrentPage] = useState(null);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  // Fonction pour gérer l'ouverture et la fermeture du menu
  const handleMenuCollapse = () => {
    setMenuCollapsed((prevCollapsed) => !prevCollapsed);
    const icon = document.querySelector(".collapse-icon");
    if (icon) {
      icon.classList.toggle("collapsed-icon", !menuCollapsed);
      icon.classList.toggle("expanded-icon", menuCollapsed);
    }
  };

  // Fonction pour gérer le clic sur les éléments du menu
  const handleMenuClick = (page) => {
    setCurrentPage(page);
  };

  // Retour du JSX
  return (
    <Layout
      className={`dashboard-container ${menuCollapsed ? "collapsed" : ""}`}
    >
      <Sider
        className={`sidebar ${menuCollapsed ? "collapsed" : ""}`}
        collapsible
        collapsed={menuCollapsed}
        trigger={null}
      >
        {/* Conteneur pour le logo */}
        <div className={`logo-container ${menuCollapsed ? "collapsed" : ""}`}>
          <img src={Logo1} alt="Menu Logo" className="sidebar-logo" />
          {/* Texte sous le logo */}
          {!menuCollapsed && <span className="app-name">Vbill</span>}
        </div>
        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentPage]}
          onClick={() => handleMenuCollapse(false)}
        >
          {/* Éléments du menu */}
          <Menu.Item
            key="Financiers"
            icon={<MoneyCollectOutlined />}
            onClick={() => handleMenuClick("Financiers")}
          >
            <span className="menu-item-text">Financiers</span>
          </Menu.Item>
          <Menu.Item
            key="Clients"
            icon={<UserOutlined />}
            onClick={() => handleMenuClick("Clients")}
          >
            <span className="menu-item-text">Clients</span>
          </Menu.Item>
          <Menu.Item
            key="Parametrage"
            icon={<SettingOutlined />}
            onClick={() => handleMenuClick("Parametrage")}
          >
            <span className="menu-item-text">Parametrage</span>
          </Menu.Item>
          <Menu.Item
            key="Service"
            icon={<ToolOutlined />}
            onClick={() => handleMenuClick("Service")}
          >
            <span className="menu-item-text">Services</span>
          </Menu.Item>
        </Menu>
        {/* Icône de réduction du menu */}
        <div
          className="collapse-icon collapsed-icon"
          onClick={handleMenuCollapse}
        >
          <LeftOutlined />
        </div>
      </Sider>
      {/* Contenu principal */}
      <Layout className="site-layout">
        <Content
          className={`content ${
            currentPage ? `${currentPage.toLowerCase()}-page` : ""
          }`}
        >
          {/* Affichage du contenu en fonction de la page sélectionnée */}
          {currentPage === "Financiers" && <FinancierManagement />}
          {currentPage === "Clients" && <ClientManagement />}
          {currentPage === "Parametrage" && <Parametrage />}
          {currentPage === "Service" && <Service />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardAdmin;
