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
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${ API_URL }/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update user profile

export const updateUserProfile = async (updatedData) => {
  try {
    const response = await axios.put(`${ API_URL }/profile`, updatedData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Change user password
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await axios.put(`${ API_URL }/change-password`, passwordData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to change password. Please try again.');
  }
};

// Delete user account
export const deleteUserAccount = async (userId) => {
  try {
    const response = await axios.delete(`${ API_URL }/user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await axios.post(`${ API_URL }/logout`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    // 401 is expected if session already expired - don't throw
    if (error.response?.status === 401) {
      return { success: true, message: 'Logged out successfully' };
    }
    // For other errors, provide a message
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Logout failed. Please try again.');
  }
};

// Get all users (admin only)
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${ API_URL }`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to fetch users. Please try again.');
  }
};

// Delete user by ID (admin only)
export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(`${ API_URL }/user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to delete user. Please try again.');
  }
};

