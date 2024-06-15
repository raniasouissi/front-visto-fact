import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag } from "antd";

const { Column } = Table;

const DetFac = () => {
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    fetchFacture();
  }, []);

  const fetchFacture = async () => {
    try {
      const facturesResponse = await axios.get(
        "http://localhost:5000/api/facture"
      );
      setFactures(facturesResponse.data);
    } catch (error) {
      console.error("Error fetching factures:", error);
    }
  };

  return (
    <div>
      <h1>Liste des Factures</h1>
      <Table dataSource={factures} pagination={false}>
        <Column
          title="Numéro de facture"
          dataIndex="numeroFacture"
          key="numeroFacture"
        />
        <Column title="Date" dataIndex="date" key="date" />
        <Column
          title="Entreprise"
          dataIndex={["parametrage", "nomEntreprise"]}
          key="nomEntreprise"
        />
        <Column
          title="Numéro de téléphone"
          dataIndex={["parametrage", "phonenumber"]}
          key="phonenumber"
        />
        <Column title="Client" dataIndex={["client", "name"]} key="client" />
        <Column
          title="Matricule Fiscale"
          dataIndex={["client", "matriculeFiscale"]}
          key="matriculeFiscale"
        />
        <Column
          title="Nom de la compagnie"
          dataIndex={["client", "namecompany"]}
          key="namecompany"
        />
        <Column
          title="Services"
          dataIndex="services"
          key="services"
          render={(services) => (
            <span>
              {services.map((service) => (
                <Tag key={service._id}>
                  {service.reference} - {service.libelle}
                </Tag>
              ))}
            </span>
          )}
        />
        <Column title="Total HT" dataIndex="totalHT" key="totalHT" />
        <Column title="Total TVA" dataIndex="totalTVA" key="totalTVA" />
        <Column title="Total TTC" dataIndex="totalTTC" key="totalTTC" />
        <Column title="Timbre" dataIndex={["timbre", "value"]} key="timbre" />
      </Table>
    </div>
  );
};

export default DetFac;
