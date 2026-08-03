// src/api/userServices.js
import axiosClient from './axiosClient';
import { API_BASE_URL } from './config';

const API_URL = `${API_BASE_URL}/api/users`;

// Cached profile so the app can render offline (no internet) after a successful
// login: once the profile has been fetched, it lives in localStorage and is
// served on network failure. A real 401 (server says logged out) clears it.
const CACHED_PROFILE_KEY = "aido_user_profile";

export const getCachedProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHED_PROFILE_KEY)) || null;
  } catch {
    return null;
  }
};

const cacheProfile = (profile) => {
  try {
    if (profile) {
      localStorage.setItem(CACHED_PROFILE_KEY, JSON.stringify(profile));
    }
  } catch {
    // localStorage unavailable - ignore
  }
};

const clearCachedProfile = () => {
  try {
    localStorage.removeItem(CACHED_PROFILE_KEY);
  } catch {
    // ignore
  }
};

export const login = async (credentials) => {
  try {
    const response = await axiosClient.post(`${API_URL}/login`, credentials, {
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
    const response = await axiosClient.post(`${ API_URL }/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axiosClient.get(`${ API_URL }/profile`, {
      withCredentials: true,
    });
    cacheProfile(response.data);
    return response.data;
  } catch (error) {
    // No response = network unreachable. Serve the cached profile so the app
    // keeps rendering with zero internet after a successful login.
    if (!error.response) {
      const cached = getCachedProfile();
      if (cached) return cached;
      throw new Error("Offline and no saved session. Please reconnect and log in.");
    }
    // Real server rejection (401/404): the session is gone, drop the cached copy.
    clearCachedProfile();
    throw error.response.data;
  }
};

// Update user profile

export const updateUserProfile = async (updatedData) => {
  try {
    const response = await axiosClient.put(`${ API_URL }/profile`, updatedData, {
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
    const response = await axiosClient.put(`${ API_URL }/change-password`, passwordData, {
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
    const response = await axiosClient.delete(`${ API_URL }/user/${userId}`, {
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
    const response = await axiosClient.post(`${ API_URL }/logout`, {}, {
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
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosClient.get(`${ API_URL }?page=${page}&limit=${limit}`, {
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
    const response = await axiosClient.delete(`${ API_URL }/user/${userId}`, {
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

