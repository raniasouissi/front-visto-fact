import React, { useRef, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/h4.jpg";
import featureImage1 from "../../assets/images/im1.jpg";
import featureImage2 from "../../assets/images/evo.jpg";
import featureImage3 from "../../assets/images/nn.jpg";
import Image1 from "../../assets/images/loi.png";
import Image2 from "../../assets/images/t.png";
import Image3 from "../../assets/images/avp.png";
import w1 from "../../assets/images/oo.jpg";
import w2 from "../../assets/images/ss.jpg";
import w3 from "../../assets/images/w.jpg";
//import contactImage from "../../assets/images/contact.jpg";
import "./Home.css";
import "./media.css";

function HomePage() {
  const newFeatureSectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isTextVisible, setIsTextVisible] = useState(false);

  useEffect(() => {
    const section = newFeatureSectionRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    });
    observer.observe(section);
    return () => observer.unobserve(section);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Change the time according to your requirement
    return () => clearTimeout(timeout);
  }, []);
  const toggleTextVisibility = () => {
    setIsTextVisible(!isTextVisible);
  };

  return (
    <div className="home-page">
      <div className="spacer" />
      {isLoading && <div className="spinner"></div>}
      <section className="hero-section">
        {/* Hero section content */}
        <img src={heroImage} alt="Invoice App" className="hero-img" />

        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Gérez vos factures en toute simplicité{" "}
            <div className="line-divid"></div>
          </h1>
          <p className="hero-subtitlee">
            Créez, envoyez et gérez vos factures en quelques clics avec notre
            application intuitive.
          </p>
          <Link to="/register" className="btn-get-startedd">
            Commencer
          </Link>
        </div>
      </section>
      <section className="pre-new-features-section">
        <div className="pre-new-features-container">
          <img src={Image1} alt="Image 1" className="pre-new-feature-img" />
          <img src={Image2} alt="Image 2" className="pre-new-feature-img" />
          <img src={Image3} alt="Image 3" className="pre-new-feature-img" />
        </div>
      </section>
      <section ref={newFeatureSectionRef} className="new-features-section">
        <div className="f-content">
          <h1 className="f-title">
            Un outil complet et simple d&apos;utilisation.
          </h1>
          <p className="f-subtitle">
            Pour vous permettre de vous concentrer sur l&apos;essentiel
          </p>
        </div>
        <div className="new-feature">
          <img
            src={featureImage1}
            alt="Feature 1"
            className={`new-feature-img ${isVisible ? "visible" : ""}`}
          />
          <div className="new-feature-info">
            <h2 className="new-feature-title"> Complet et Sécurisé</h2>
            <p className="new-feature-description">
              Un module multi-entreprises gratuit, la gestion de votre
              facturation, de vos devis et de vos règlements en quelques clics.
              La mise à disposition d&apos;un tableau de bord complet et
              graphique pour un suivi précis de votre entreprise.
            </p>
          </div>
        </div>
        <div className="new-feature">
          <img
            src={featureImage2}
            alt="Feature 2"
            className={`new-feature-img ${isVisible ? "visible" : ""}`}
          />
          <div className="new-feature-info">
            <h2 className="new-feature-title"> Évolutif et Mobile</h2>
            <p className="new-feature-description">
              Notre outil a été conçu pour s&apos;adapter au plus près à vos
              besoins avec une construction en blocs/packs, la mise à
              disposition de statistiques poussées et des mises à jour
              régulières.
            </p>
          </div>
        </div>
        <div className="new-feature">
          <img
            src={featureImage3}
            alt="Feature 3"
            className={`new-feature-img ${isVisible ? "visible" : ""}`}
          />
          <div className="new-feature-info">
            <h2 className="new-feature-title">Intuitif et Gratuit</h2>
            <p className="new-feature-description">
              Un site pensé par et pour les entreprises, des didacticiels pour
              vous accompagner pas à pas et des formations accessibles si
              besoin. Des fonctionnalités essentielles pour la prise de décision
              dans la gestion de votre entreprise.
            </p>
          </div>
        </div>
      </section>
      {/* Nouvelle section */}
      {/* <section className="additional-features-section">
        <div className="a-content">
          <h1 className="a-title">
            La solution tout-en-un{" "}
            <span className="a-text">simplifie votre quotidien !</span>
            <p className="d-text">
              Gérez votre entreprise. Depuis une seule application.
            </p>
          </h1>
        </div>
        <div className="feature-card circle blue">
          <FaCalculator className="feature-icon" />
          <h2 className="feature-title">Gratuit</h2>
          <p className="feature-description">
            Gérez vos factures en toute simplicité.
          </p>
        </div>
        <div className="feature-card circle green">
          <FaFileInvoice className="feature-icon" />
          <h2 className="feature-title">Factures</h2>
          <p className="feature-description">
            Créez et envoyez vos factures en un clic.
          </p>
        </div>
        <div className="feature-card circle red">
          <FaUsers className="feature-icon" />
          <h2 className="feature-title">Clients</h2>
          <p className="feature-description">
            Gérez facilement votre liste de clients.
          </p>
        </div>
        <div className="feature-card circle yellow">
          <FaListAlt className="feature-icon" />
          <h2 className="feature-title">Devis</h2>
          <p className="feature-description">
            Créez et suivez vos devis en ligne.
          </p>
        </div>
        <div className="feature-card circle purple">
          <FaMoneyBillAlt className="feature-icon" />
          <h2 className="feature-title">Règlements</h2>
          <p className="feature-description">
            Effectuez et suivez les paiements.
          </p>
        </div>
        <div className="feature-card circle orange">
          <FaBox className="feature-icon" />
          <h2 className="feature-title">Services</h2>
          <p className="feature-description">
            Gérez votre inventaire de services.
          </p>
        </div>
      </section> */}
      <section className="why-use-vbill-section">
        <h1 className="why-use-vbill-title">Pourquoi utiliser Vbill </h1>
        <div className="why-use-vbill-content">
          <div className="why-use-vbill-images">
            <div className="why-use-vbill-images-row">
              <img src={w1} alt="Image 1" className="circle-image w1" />
            </div>
            <div className="why-use-vbill-images-row">
              <img src={w2} alt="Image 2" className="circle-image w2" />
            </div>
            <div className="why-use-vbill-images-row">
              <img src={w3} alt="Image 3" className="circle-image w3" />
            </div>
          </div>

          <div className="why-use-vbill-cards-container">
            <div className="why-use-vbill-card">
              <h2 className="why-use-vbill-card-title">
                Devis et facturation adaptés au secteur du bâtiment
              </h2>
              <p
                className={`why-use-vbill-card-text ${
                  isTextVisible ? "visible" : ""
                }`}
              >
                Grâce à notre logiciel de facturation, rédigez des devis et
                factures adaptés aux attentes de votre secteur : multiples taux
                de TVA, attestations de TVA, gestion avancée de votre
                bibliothèque d’ouvrages, fournitures, main d’oeuvre… Toutes les
                marges sont ensuite calculées en temps réel, sans intervention
                de votre part.
              </p>
              <FaChevronDown
                className="toggle-icon"
                onClick={toggleTextVisibility}
              />
            </div>
            <div className="why-use-vbill-card">
              <h2 className="why-use-vbill-card-title">
                Personnalisation des devis & factures
              </h2>
              <p className="why-use-vbill-card-text">
                Soigner l’image de ses documents est essentiel dans un secteur
                aussi concurrentiel que le bâtiment. Apprenez comment créer un
                devis et personnalisez à 100% vos documents en y insérant votre
                logo, en modifiant les styles et couleurs ou encore en affichant
                vos labels (Qualibat, RGE, etc.) ! Tout ceci, sans aucune
                connaissance technique grâce à une interface intuitive,
                ergonomique et adaptée à votre secteur.
              </p>
              <FaChevronDown
                className="toggle-icon"
                onClick={toggleTextVisibility}
              />
            </div>
            <div className="why-use-vbill-card">
              <h2 className="why-use-vbill-card-title">
                Gestion des clients BTP & suivi des chantiers
              </h2>
              <p className="why-use-vbill-card-text">
                Pour une TPE/PME la bonne gestion et le suivi des chantiers sont
                primordiaux. Suivez l’ensemble de vos prospects, clients et
                fournisseurs sur une seule et même interface. En déplacement,
                prenez des notes et ajoutez des photos pour ne rien oublier ! Si
                votre chantier se déroule sur plusieurs mois, établissez
                simplement des factures de situation à vos clients.
              </p>
              <FaChevronDown
                className="toggle-icon"
                onClick={toggleTextVisibility}
              />
            </div>
            <div className="why-use-vbill-card">
              <h2 className="why-use-vbill-card-title">
                Statistiques et pilotage dans votre logiciel BTP
              </h2>
              <p className="why-use-vbill-card-text">
                Surveillez votre activité en temps réel grâce aux données
                disponibles sur le tableau de bord. Véritable assistant au
                quotidien, vous y trouverez les factures en attente de
                règlement, vos performances commerciales ou encore votre taux
                d’acceptation des devis.
              </p>
              <FaChevronDown
                className="toggle-icon"
                onClick={toggleTextVisibility}
              />
            </div>
          </div>
        </div>
      </section>
      {/* 
      <section className="contact-us-section">
        <div className="contact-us-container">
          <div className="contact-us-content">
            <form className="contact-us-form1">
              <h2 className="contact-us-title">Contactez-nous</h2>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="form-input1"
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="form-input1"
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  className="form-input1"
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Sujet"
                  className="form-input1"
                />
              </div>
              <div className="input-group">
                <textarea
                  placeholder="Votre message"
                  rows="6"
                  className="form-textarea1"
                ></textarea>
              </div>
              <button type="submit" className="btn-submit">
                Envoyer
              </button>
            </form>
          </div>
          <div className="contact-us-image">
            <img src={contactImage} alt="Contact Us" />
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default HomePage;
