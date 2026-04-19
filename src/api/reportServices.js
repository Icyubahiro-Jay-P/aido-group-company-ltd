// src/api/reportServices.js
import axios from 'axios';

const API_URL = 'https://aido-backend-h6gd.onrender.com/api/reports';

// ==================== INCOME ====================
export const getDailyIncome = async () => {
  try {
    const response = await axios.get(`${API_URL}/income/daily`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch daily income. Please try again.');
  }
};

export const getWeeklyIncome = async () => {
  try {
    const response = await axios.get(`${API_URL}/income/weekly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch weekly income. Please try again.');
  }
};

export const getMonthlyIncome = async () => {
  try {
    const response = await axios.get(`${API_URL}/income/monthly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch monthly income. Please try again.');
  }
};

export const getAnnualIncome = async () => {
  try {
    const response = await axios.get(`${API_URL}/income/annual`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch annual income. Please try again.');
  }
};

// ==================== EXPENSE ====================
export const getDailyExpense = async () => {
  try {
    const response = await axios.get(`${API_URL}/expense/daily`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch daily expense. Please try again.');
  }
};

export const getWeeklyExpense = async () => {
  try {
    const response = await axios.get(`${API_URL}/expense/weekly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch weekly expense. Please try again.');
  }
};

export const getMonthlyExpense = async () => {
  try {
    const response = await axios.get(`${API_URL}/expense/monthly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch monthly expense. Please try again.');
  }
};

export const getAnnualExpense = async () => {
  try {
    const response = await axios.get(`${API_URL}/expense/annual`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch annual expense. Please try again.');
  }
};

// ==================== PROFIT ====================
export const getDailyProfit = async () => {
  try {
    const response = await axios.get(`${API_URL}/profit/daily`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch daily profit. Please try again.');
  }
};

export const getWeeklyProfit = async () => {
  try {
    const response = await axios.get(`${API_URL}/profit/weekly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch weekly profit. Please try again.');
  }
};

export const getMonthlyProfit = async () => {
  try {
    const response = await axios.get(`${API_URL}/profit/monthly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch monthly profit. Please try again.');
  }
};

export const getAnnualProfit = async () => {
  try {
    const response = await axios.get(`${API_URL}/profit/annual`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch annual profit. Please try again.');
  }
};

// ==================== LOSS ====================
export const getDailyLoss = async () => {
  try {
    const response = await axios.get(`${API_URL}/loss/daily`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch daily loss. Please try again.');
  }
};

export const getWeeklyLoss = async () => {
  try {
    const response = await axios.get(`${API_URL}/loss/weekly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch weekly loss. Please try again.');
  }
};

export const getMonthlyLoss = async () => {
  try {
    const response = await axios.get(`${API_URL}/loss/monthly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch monthly loss. Please try again.');
  }
};

export const getAnnualLoss = async () => {
  try {
    const response = await axios.get(`${API_URL}/loss/annual`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch annual loss. Please try again.');
  }
};

// ==================== CLIENTS ====================
export const getDailyClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients/daily`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch daily clients. Please try again.');
  }
};

export const getWeeklyClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients/weekly`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch weekly clients. Please try again.');
  }
};

// ==================== INVENTORY & STOCK ====================
export const getLowStockItems = async (threshold = 10) => {
  try {
    const response = await axios.get(`${API_URL}/low-stock?threshold=${threshold}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch low stock items. Please try again.');
  }
};

export const getInventorySummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/inventory-summary`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch inventory summary. Please try again.');
  }
};

// ==================== TRANSACTIONS ====================
export const getRecentTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/recent-transactions`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch recent transactions. Please try again.');
  }
};
