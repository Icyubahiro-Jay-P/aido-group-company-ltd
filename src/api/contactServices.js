import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aido-backend-h6gd.onrender.com';

export const sendContactMessage = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/contact/send`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to send message',
      error: error.response?.data?.error || error.message,
    };
  }
};
