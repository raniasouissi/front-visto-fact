// Home.jsx
import React, { useEffect } from "react";
import "./Home.css";
import homeImage from "../../assets/images/home.jpg";
import feature1Image from "../../assets/images/feature1.jpg";
import feature2Image from "../../assets/images/feature2.jpg";
import feature3Image from "../../assets/images/feature3.jpg";
import { Link } from "react-router-dom";

const features = [
  {
    image: feature1Image,
    title:
      "Monétisez votre temps, importez vos heures pour une gestion simplifiée",
    description:
      "Facturez votre temps en un clic. Les factures sont générées automatiquement à partir de vos enregistrements de temps liés aux projets, vous évitant ainsi la saisie manuelle des détails de facturation.",
  },
  {
    image: feature2Image,
    title: "Facturation en ligne avec un logiciel, paiement facile",
    description:
      "Améliorez votre processus de facturation grâce à des factures professionnelles, une gestion centralisée en ligne, accessible de partout, et une sécurité des paiements assurée.",
  },
  {
    image: feature3Image,
    title: "Facilitez la comptabilité avec des factures intelligentes",
    description:
      "Adoptez un logiciel de facturation et de comptabilité intégré pour automatiser les écritures comptables à partir des factures, minimisant les erreurs et simplifiant la gestion comptable.",
  },
];

const Home = () => {
  useEffect(() => {
    document.body.classList.add("home-page");
    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  return (
    <div className="home">
      <div className="spacer" />

      <div className="content">
        <h1>{`Logiciel de facturation simple et professionnel pour votre entreprise.`}</h1>
        <p>
          {` Simple d'utilisation et intuitif, VistoFact est l'outil clé-en-main qu'il vous faut ! `}
          <span className="highlight">{`Découvrez une nouvelle façon de gérer vos finances.`}</span>
        </p>
        <Link to="/login">
          <button>Commencer</button>
        </Link>
      </div>

      <div className="image-container">
        <img src={homeImage} alt="Image d'accueil" className="animated-image" />
      </div>

      <div className="features">
        {features.map((feature, index) => (
          <div className="feature" key={index}>
            <img src={feature.image} alt={`Fonctionnalité ${index + 1}`} />
            <div className="feature-text">
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
