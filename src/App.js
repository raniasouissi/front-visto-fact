// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Componnets/Home-page/Home";
import About from "./Componnets//About-page/About";
import Contact from "./Componnets/Contact-page/Contact";
import Header from "./Componnets/Header/Header";
import Footer from "./Componnets/Footer/Footer";
import Signin from "./auth/Signin-page/Signin";
import Signup from "./auth/Signup-page/signup";
import Devis from "./Componnets/Devis-page/Devis";
import DashboardAdmin from "./Admin/dashboard-admin";
import DashboardClient from "./Client/DashboardClient";
import DashboardFinancier from "./Financier/DashboardFinancier";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/login" element={<Signin />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            <Route path="/dashboard-client" element={<DashboardClient />} />
            <Route
              path="/dashboard-financier"
              element={<DashboardFinancier />}
            />
          </Routes>
          Q
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;