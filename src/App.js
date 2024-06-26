import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Componnets/Home-page/Home";
import About from "./Componnets//About-page/About";
import Contact from "./Componnets/Contact-page/Contact";
import Header from "./Componnets/Header/Header";
import Footer from "./Componnets/Footer/Footer";
import Signin from "./auth/Signin-page/Signin";
import Signup from "./auth/Signup-page/signup";
import Devis from "./Componnets/Devis-page/Devis";

import DashboardClient from "./Client/DashboardClient";
import DashboardFinancier from "./Financier/Dashborad/DashboardFinancier";
import ResetPasswordComponent from "./auth/ResetPassword/ResetPasswordComponent";
import VerificationPage from "./auth/Verif-email/VerificationPage";
import SetPassword from "./Admin/ClientManagement/SetPassword/SetPassword";

import "./App.css";
import Facture from "./Admin/Facture/facture";
import ModifierProfil from "./Financier/modiferprofil";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État d'authentification

  return (
    <Router>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} />{" "}
        {/* Passez l'état d'authentification en tant que prop */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/devis" element={<Devis />} />
            <Route
              path="/login"
              element={<Signin setIsLoggedIn={setIsLoggedIn} />}
            />{" "}
            {/* Passez setIsLoggedIn en tant que prop */}
            <Route
              path="/reset-password"
              element={<ResetPasswordComponent />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/fact" element={<Facture />} />
            <Route path="/dashboard-client" element={<DashboardClient />} />
            <Route path="/dashboard" element={<DashboardFinancier />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route
              path="/dashboard/modiferprofil"
              element={<ModifierProfil />}
            />
            <Route path="/set-password/:token" element={<SetPassword />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
