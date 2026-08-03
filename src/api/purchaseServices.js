// src/api/purchaseServices.js
import axiosClient from './axiosClient';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/purchases`;

// Create a new purchase
export const createPurchase = async (purchaseData) => {
  try {
    const response = await axiosClient.post(`${API_URL}`, purchaseData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create purchase. Please try again.');
  }
};

// Get all purchases
export const getPurchases = async () => {
  try {
    const response = await axiosClient.get(`${API_URL}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch purchases. Please try again.');
  }
};

// Get a single purchase by ID
export const getPurchaseById = async (id) => {
  try {
    const response = await axiosClient.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch purchase. Please try again.');
  }
};

// Update a purchase by ID
export const updatePurchase = async (id, purchaseData) => {
  try {
    const response = await axiosClient.put(`${API_URL}/${id}`, purchaseData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update purchase. Please try again.');
  }
};

// Delete a purchase by ID
export const deletePurchase = async (id) => {
  try {
    const response = await axiosClient.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete purchase. Please try again.');
  }
};
