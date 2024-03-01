import React, { useEffect } from "react";
import "./About.css";

const About = () => {
  useEffect(() => {
    document.body.classList.add("about-page");
    return () => {
      document.body.classList.remove("about-page");
    };
  }, []);

  return (
    <div>
      <div className="spacer" />
      <div className="about-container">
        <div className="hero">
          <h1>
            Découvrez <span className="visto">Visto</span>
            <span className="fact">Fact</span>
          </h1>
          <p>
            Votre partenaire intelligent pour une gestion financière efficace.
          </p>
        </div>

        <div className="description">
          <p>
            VistoFact est bien plus qu&apos;un simple logiciel de facturation.
            C&apos;est votre partenaire intelligent pour gérer les finances de
            votre entreprise de manière efficace et personnalisée. Nous nous
            engageons à simplifier vos opérations financières tout en offrant
            une expérience utilisateur exceptionnelle.
          </p>
        </div>
        <div className="functionalities">
          <h2>Fonctionnalités Principales</h2>
          <div className="functionality">
            <div className="icon">📑</div>
            <p>Automatisation avancée de la facturation</p>
          </div>
          <div className="functionality">
            <div className="icon">💳</div>
            <p>Simplification du processus de paiement</p>
          </div>
          <div className="functionality">
            <div className="icon">🔄</div>
            <p>Optimisation des opérations financières</p>
          </div>
          <div className="functionality">
            <div className="icon">🛠️</div>
            <p>Personnalisation des solutions</p>
          </div>
          <div className="functionality">
            <div className="icon">📊</div>
            <p>Analyse approfondie des données financières</p>
          </div>
          <div className="functionality">
            <div className="icon">🌐</div>
            <p>Accessibilité mondiale</p>
          </div>
          <div className="functionality">
            <div className="icon">📈</div>
            <p>Rapports détaillés pour une analyse approfondie</p>
          </div>
          <div className="functionality">
            <div className="icon">📧</div>
            <p>Communication clients simplifiée</p>
          </div>
        </div>

        <div className="advantages">
          <h2>Avantages de VistoFact</h2>
          <div className="advantage">
            <div className="icon">🚀</div>
            <p>Gain de temps avec une automatisation avancée</p>
          </div>
          <div className="advantage">
            <div className="icon">💼</div>
            <p>Optimisation des opérations financières</p>
          </div>
          <div className="advantage">
            <div className="icon">💡</div>
            <p>Personnalisation des solutions selon vos besoins</p>
          </div>
        </div>

        <div className="contact">
          <p>
            Pour plus d&apos;informations ou pour toute demande, n&apos;hésitez
            pas à nous contacter. Nous sommes là pour vous aider!
          </p>
          <a href="/contact" className="contact-button">
            Nous Contacter
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
