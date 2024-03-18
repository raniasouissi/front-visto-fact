import React, { useEffect } from "react";
import "./Home.css"; // Importez votre fichier CSS
import homeImage from "../../assets/images/home.jpg";
import feature1Image from "../../assets/images/feature1.jpg";
import feature2Image from "../../assets/images/feature2.jpg";
import feature3Image from "../../assets/images/feature3.jpg";
import { Link } from "react-router-dom";
import { Typography, Row, Col } from "antd";
import PropTypes from "prop-types";

const { Title, Paragraph } = Typography;

const features = [
  {
    title:
      "Augmentez votre productivité, suivez facilement vos heures de travail",
    description:
      "Suivez et enregistrez vos heures de travail avec facilité. Facturez votre temps avec précision et efficacité.",
    image: feature1Image,
  },
  {
    title: "Facturation en ligne sécurisée et intuitive",
    description:
      "Générez des factures professionnelles en quelques clics. Un processus de facturation simple et sécurisé.",
    image: feature2Image,
  },
  {
    title: "Gestion comptable simplifiée avec des outils intelligents",
    description:
      "Automatisez vos tâches comptables et suivez vos finances en temps réel. Simplifiez la gestion de votre entreprise.",
    image: feature3Image,
  },
];

const Feature = ({ title, description, image }) => {
  return (
    <div className="feature">
      <img alt={title} src={image} className="feature-image" />
      <div className="feature-text">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

Feature.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

const Home = () => {
  useEffect(() => {
    document.body.classList.add("new-home-page");
    return () => {
      document.body.classList.remove("new-home-page");
    };
  }, []);

  return (
    <div className="new-home">
      <div className="new-spacer" />

      <div className="new-content">
        <Title level={1}>
          Un logiciel de facturation complet pour votre entreprise.
        </Title>
        <Paragraph
          style={{
            fontSize: "1.4rem",
            lineHeight: "1.5",
            fontFamily: "serif",
            fontWeight: "bold",
          }}
        >
          Gérez vos finances avec facilité grâce à notre plateforme intuitive.{" "}
          <span className="new-highlight">
            Découvrez une nouvelle façon de travailler.
          </span>
        </Paragraph>
        <Link to="/register">
          <button className="new-button">Commencer</button>
        </Link>
      </div>

      <div className="new-image-container">
        <img
          src={homeImage}
          alt="Image d'accueil"
          className="new-animated-image"
        />
      </div>

      <div className="new-features">
        <Row gutter={[16, 16]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Feature
                title={feature.title}
                description={feature.description}
                image={feature.image}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
