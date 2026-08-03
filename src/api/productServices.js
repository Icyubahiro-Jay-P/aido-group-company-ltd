// src/api/productServices.js
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

const API_URL = `${API_BASE_URL}/api/products`;
const ENTITY = 'product';

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || fallback;

const isNetworkError = (error) => !error?.response;

const enqueue = async ({ method, url, data, id }) => {
  const clientMutationId = generateMutationId();
  const localId = id || `offline-${clientMutationId}`;
  await queueOp({
    entity: ENTITY,
    method,
    url,
    data,
    id: localId,
    clientMutationId,
    branch: getCurrentBranch(),
    createdAt: Date.now(),
  });
  return localId;
};

// Create a new product
export const createProduct = async (productData) => {
  const offline = async () => {
    const localId = await enqueue({ method: 'post', url: `${API_URL}`, data: productData });
    const localDoc = { _id: localId, ...productData, branch: getCurrentBranch(), pending: true };
    await localPut(ENTITY, localDoc);
    return {
      message: 'Saved offline. Will sync when you reconnect.',
      product: localDoc,
      offline: true,
    };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.post(`${API_URL}`, productData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.product);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to create product. Please try again.'));
  }
};

// Get all products
export const getProducts = async () => {
  const serveCache = async () => ({
    message: 'Loaded from offline cache',
    products: await localGetAll(ENTITY),
  });
  if (isOfflineNow()) return serveCache();
  try {
    const response = await axiosClient.get(`${API_URL}`, {
      withCredentials: true,
    });
    await localBulkPut(ENTITY, response.data?.products);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return serveCache();
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch products. Please try again.'));
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  if (isOfflineNow()) {
    const local = await localGetById(ENTITY, id);
    if (local) return { product: local };
  }
  try {
    const response = await axiosClient.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.product);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      const local = await localGetById(ENTITY, id);
      if (local) return { product: local };
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch product. Please try again.'));
  }
};

// Update a product by ID
export const updateProduct = async (id, updatedData) => {
  const offline = async () => {
    await enqueue({ method: 'put', url: `${API_URL}/${id}`, data: updatedData, id });
    const existing = (await localGetById(ENTITY, id)) || {};
    const localDoc = { ...existing, ...updatedData, _id: id, pending: true };
    await localPut(ENTITY, localDoc);
    return {
      message: 'Saved offline. Will sync when you reconnect.',
      product: localDoc,
      offline: true,
    };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.put(`${API_URL}/${id}`, updatedData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.product);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to update product. Please try again.'));
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
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
    throw new Error(getErrorMessage(error, 'Failed to delete product. Please try again.'));
  }
};
