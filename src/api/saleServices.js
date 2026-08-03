// src/api/saleServices.js
import axiosClient, { getCurrentBranch } from './axiosClient';
import { API_BASE_URL } from './config';
import { isOfflineNow, setOfflineNow } from '../offline/onlineStatus';
import {
  localGetAll,
  localGetById,
  localPut,
  localBulkPut,
  localDelete,
  queueOp,
  generateMutationId,
} from '../offline/db';

const API_URL = `${API_BASE_URL}/api/sales`;
const ENTITY = 'sale';

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || fallback;

const isNetworkError = (error) => !error?.response;

const enqueue = async ({ method, url, data, id, includeMutationId = false }) => {
  const clientMutationId = generateMutationId();
  const localId = id || `offline-${clientMutationId}`;
  const payload = includeMutationId ? { ...data, clientMutationId } : data;
  await queueOp({
    entity: ENTITY,
    method,
    url,
    data: payload,
    id: localId,
    clientMutationId,
    branch: getCurrentBranch(),
    createdAt: Date.now(),
  });
  return localId;
};

const decrementLocalStock = async (products) => {
  for (const p of products || []) {
    const prod = await localGetById('product', p.productId);
    if (prod) {
      await localPut('product', {
        ...prod,
        quantity: Math.max(0, (prod.quantity || 0) - (p.quantitySold || 0)),
      });
    }
  }
};

// Create a new sale
export const createSale = async (saleData) => {
  const offline = async () => {
    const localId = await enqueue({
      method: 'post',
      url: `${API_URL}`,
      data: saleData,
      includeMutationId: true,
    });
    const products = (saleData.products || []).map((p) => ({
      ...p,
      profit: ((p.unitPrice || 0) - (p.purchasePrice || 0)) * (p.quantitySold || 0),
    }));
    const totalProfit = products.reduce((s, p) => s + (p.profit || 0), 0);
    const localDoc = { _id: localId, ...saleData, products, totalProfit, branch: getCurrentBranch(), pending: true };
    await localPut(ENTITY, localDoc);
    await decrementLocalStock(products);
    return { message: 'Sale saved offline. Will sync when you reconnect.', sale: localDoc, offline: true };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.post(`${API_URL}`, saleData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.sale);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to create sale. Please try again.'));
  }
};

// Get all sales
export const getSales = async () => {
  const serveCache = async () => ({
    message: 'Loaded from offline cache',
    sales: await localGetAll(ENTITY),
  });
  if (isOfflineNow()) return serveCache();
  try {
    const response = await axiosClient.get(`${API_URL}`, {
      withCredentials: true,
    });
    await localBulkPut(ENTITY, response.data?.sales);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return serveCache();
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch sales. Please try again.'));
  }
};

// Get a single sale by ID
export const getSaleById = async (id) => {
  if (isOfflineNow()) {
    const local = await localGetById(ENTITY, id);
    if (local) return { message: 'Loaded from offline cache', sale: local };
  }
  try {
    const response = await axiosClient.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.sale);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      const local = await localGetById(ENTITY, id);
      if (local) return { message: 'Loaded from offline cache', sale: local };
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch sale. Please try again.'));
  }
};

// Update a sale by ID
export const updateSale = async (id, saleData) => {
  const offline = async () => {
    await enqueue({ method: 'put', url: `${API_URL}/${id}`, data: saleData, id });
    const existing = (await localGetById(ENTITY, id)) || {};
    const localDoc = { ...existing, ...saleData, _id: id, pending: true };
    await localPut(ENTITY, localDoc);
    return {
      message: 'Saved offline. Will sync when you reconnect.',
      updatedSale: localDoc,
      offline: true,
    };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.put(`${API_URL}/${id}`, saleData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.updatedSale);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to update sale. Please try again.'));
  }
};

// Delete a sale by ID
export const deleteSale = async (id) => {
  const offline = async () => {
    await localDelete(ENTITY, id);
    await enqueue({ method: 'delete', url: `${API_URL}/${id}`, data: undefined, id });
    return { message: 'Deleted offline. Will sync when you reconnect.', offline: true };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.delete(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    await localDelete(ENTITY, id);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to delete sale. Please try again.'));
  }
};
