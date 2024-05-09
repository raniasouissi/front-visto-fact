import axios from "axios";

const baseUrl = "http://localhost:5000/api";

const fetchClients = async (searchQuery) => {
  try {
    let url = `${baseUrl}/clients`;
    if (searchQuery) {
      url += `/search/${searchQuery}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    throw error;
  }
};

const addClient = async (clientData) => {
  try {
    const response = await axios.post(`${baseUrl}/clients/signup`, {
      ...clientData,
      roles: ["client"],
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", error);
    throw error;
  }
};

const deleteClient = async (id) => {
  try {
    await axios.delete(`${baseUrl}/clients/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du client :", error);
    throw error;
  }
};

const updateClient = async (clientId, clientData) => {
  try {
    const response = await axios.put(
      `${baseUrl}/clients/${clientId}`,
      clientData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client :", error);
    throw error;
  }
};

const fetchFinanciers = async (searchQuery) => {
  try {
    let url = `${baseUrl}/financiers`;
    if (searchQuery) {
      url += `/search/${searchQuery}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des financiers :", error);
    throw error;
  }
};

const addFinancier = async (financierData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/signup-with-generated-password`,
      {
        ...financierData,
        roles: ["financier"],
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'ajout du financier :", error);
    throw error;
  }
};

const deleteFinancier = async (id) => {
  try {
    await axios.delete(`${baseUrl}/financiers/${id}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du financier :", error);
    throw error;
  }
};

const updateFinancier = async (financierId, financierData) => {
  try {
    const response = await axios.put(
      `${baseUrl}/financiers/${financierId}`,
      financierData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du financier :", error);
    throw error;
  }
};

const apiusers = {
  fetchClients,
  addClient,
  deleteClient,
  updateClient,
  fetchFinanciers,
  addFinancier,
  deleteFinancier,
  updateFinancier,
};

export default apiusers;
