// src/api/clientServices.js
import axios from 'axios';

const API_URL = 'https://aido-backend-h6gd.onrender.com/api/clients';

// Create a new client
export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_URL}`, clientData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to register client. Please try again.');
  }
};

// Get all clients
export const getAllClients = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch clients. Please try again.');
  }
};

// Get a single client by ID
export const getClientById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch client. Please try again.');
  }
};

// Get clients by status
export const getClientsByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_URL}?status=${status}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch clients. Please try again.');
  }
};

// Search clients
export const searchClients = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to search clients. Please try again.');
  }
};

// Update a client
export const updateClient = async (id, clientData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, clientData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update client. Please try again.');
  }
};

// Delete a client
export const deleteClient = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete client. Please try again.');
  }
};

// Update client purchase stats
export const updateClientPurchaseStats = async (clientId, amount) => {
  try {
    const response = await axios.put(`${API_URL}/${clientId}/purchase-stats`, { clientId, amount }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update purchase stats. Please try again.');
  }
};
