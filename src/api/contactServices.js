import axiosClient from './axiosClient';
import { API_BASE_URL } from './config';

export const sendContactMessage = async (data) => {
  try {
    const response = await axiosClient.post(`${API_BASE_URL}/api/contact/send`, data);
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || 'Failed to send message',
      error: error.response?.data?.error || error.message,
    };
  }
};
