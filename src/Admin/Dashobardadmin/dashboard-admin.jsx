import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar } from "antd";
import { UserOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import FinancierManagement from "../FinanicerMangement/FinancierManagement";
import ClientManagement from "../ClientManagement/ClientManagement"; // Import du composant ClientManagement
import { useNavigate } from "react-router-dom";
import "./dashboard-admin.css";

const { Sider, Content } = Layout;

const DashboardAdmin = () => {
  const [currentPage, setCurrentPage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = document.cookie.includes("AuthenticationToken");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFinancierClick = () => {
    setCurrentPage("Financiers");
  };

  const handleClientClick = () => {
    setCurrentPage("Clients");
  };

  return (
    <Layout className="dashboard-container">
      <Sider className="sidebar">
        <div className="admin-info">
          <Avatar size={70} icon={<UserOutlined />} />
          <span className="admin-name">Admin</span>
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[currentPage]}>
          <Menu.Item
            key="Financiers"
            icon={<MoneyCollectOutlined />}
            onClick={handleFinancierClick}
          >
            Financiers
          </Menu.Item>
          <Menu.Item
            key="Clients"
            icon={<UserOutlined />}
            onClick={handleClientClick}
          >
            Clients
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content className="content">
          {currentPage === "Financiers" && <FinancierManagement />}
          {currentPage === "Clients" && <ClientManagement />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardAdmin;
