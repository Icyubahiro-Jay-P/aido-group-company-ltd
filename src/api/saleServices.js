// src/api/saleServices.js
import axiosClient from './axiosClient';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/sales`;

// Create a new sale
export const createSale = async (saleData) => {
  try {
    const response = await axiosClient.post(`${API_URL}`, saleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create sale. Please try again.');
  }
};

// Get all sales
export const getSales = async () => {
  try {
    const response = await axiosClient.get(`${API_URL}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch sales. Please try again.');
  }
};

// Get a single sale by ID
export const getSaleById = async (id) => {
  try {
    const response = await axiosClient.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch sale. Please try again.');
  }
};

// Update a sale by ID
export const updateSale = async (id, saleData) => {
  try {
    const response = await axiosClient.put(`${API_URL}/${id}`, saleData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update sale. Please try again.');
  }
};

// Delete a sale by ID
export const deleteSale = async (id) => {
  try {
    const response = await axiosClient.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete sale. Please try again.');
  }
};
