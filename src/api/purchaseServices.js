// src/api/purchaseServices.js
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

const API_URL = `${API_BASE_URL}/api/purchases`;
const ENTITY = 'purchase';

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
    createdAt: Date.now(),
  });
  return localId;
};

const incrementLocalStock = async (products) => {
  for (const p of products || []) {
    const prod = await localGetById('product', p.productId);
    if (prod) {
      await localPut('product', {
        ...prod,
        quantity: (prod.quantity || 0) + (p.quantityPurchased || 0),
      });
    }
  }
};

// Create a new purchase
export const createPurchase = async (purchaseData) => {
  const offline = async () => {
    const localId = await enqueue({
      method: 'post',
      url: `${API_URL}`,
      data: purchaseData,
      includeMutationId: true,
    });
    const localDoc = { _id: localId, ...purchaseData, pending: true };
    await localPut(ENTITY, localDoc);
    await incrementLocalStock(purchaseData.products);
    return {
      message: 'Saved offline. Will sync when you reconnect.',
      purchase: localDoc,
      offline: true,
    };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.post(`${API_URL}`, purchaseData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.purchase);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to create purchase. Please try again.'));
  }
};

// Get all purchases
export const getPurchases = async () => {
  const serveCache = async () => ({
    message: 'Loaded from offline cache',
    purchases: await localGetAll(ENTITY),
  });
  if (isOfflineNow()) return serveCache();
  try {
    const response = await axiosClient.get(`${API_URL}`, {
      withCredentials: true,
    });
    await localBulkPut(ENTITY, response.data?.purchases);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return serveCache();
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch purchases. Please try again.'));
  }
};

// Get a single purchase by ID
export const getPurchaseById = async (id) => {
  if (isOfflineNow()) {
    const local = await localGetById(ENTITY, id);
    if (local) return { message: 'Loaded from offline cache', purchase: local };
  }
  try {
    const response = await axiosClient.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.purchase);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      const local = await localGetById(ENTITY, id);
      if (local) return { message: 'Loaded from offline cache', purchase: local };
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch purchase. Please try again.'));
  }
};

// Update a purchase by ID
export const updatePurchase = async (id, purchaseData) => {
  const offline = async () => {
    await enqueue({ method: 'put', url: `${API_URL}/${id}`, data: purchaseData, id });
    const existing = (await localGetById(ENTITY, id)) || {};
    const localDoc = { ...existing, ...purchaseData, _id: id, pending: true };
    await localPut(ENTITY, localDoc);
    return {
      message: 'Saved offline. Will sync when you reconnect.',
      updatedPurchase: localDoc,
      offline: true,
    };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.put(`${API_URL}/${id}`, purchaseData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.updatedPurchase);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to update purchase. Please try again.'));
  }
};

// Delete a purchase by ID
export const deletePurchase = async (id) => {
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
    throw new Error(getErrorMessage(error, 'Failed to delete purchase. Please try again.'));
  }
};
