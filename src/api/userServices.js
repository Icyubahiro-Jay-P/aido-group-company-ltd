// src/api/userServices.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';   // change port if needed

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      withCredentials: true,   // important for cookies
    });
    
    return response.data;     // return success data
  } catch (error) {
    // Re-throw a clean error with the message from backend
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Login failed. Please try again.');
  }
};


// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${ API_URL }/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// Get user profile
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${ API_URL }/profile`, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update user profile

export const updateUserProfile = async (token, updatedData) => {
  try {
    const response = await axios.put(`${ API_URL }/profile`, updatedData, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Change user password
export const changeUserPassword = async (token, passwordData) => {
  try {
    const response = await axios.put(`${ API_URL }/change-password`, passwordData, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete user account
export const deleteUserAccount = async (token) => {
  try {
    const response = await axios.delete(`${ API_URL }/delete`, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout user
export const logout = async (token) => {
  try {
    const response = await axios.post(`${ API_URL }/logout`, token, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get all users (admin only)
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${ API_URL }`, {
      headers: {
        Authorization: `Bearer ${ token }`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

