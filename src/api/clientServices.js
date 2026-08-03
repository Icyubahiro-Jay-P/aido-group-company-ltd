// src/api/clientServices.js
import axiosClient from './axiosClient';
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

const API_URL = `${API_BASE_URL}/api/clients`;
const ENTITY = 'client';

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
    createdAt: Date.now(),
  });
  return localId;
};

// Create a new client
export const createClient = async (clientData) => {
  const offline = async () => {
    const localId = await enqueue({ method: 'post', url: `${API_URL}`, data: clientData });
    const localDoc = { _id: localId, ...clientData, pending: true };
    await localPut(ENTITY, localDoc);
    return {
      message: 'Saved offline. Will sync when you reconnect.',
      client: localDoc,
      offline: true,
    };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.post(`${API_URL}`, clientData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.client);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to register client. Please try again.'));
  }
};

// Get all clients
export const getAllClients = async () => {
  const serveCache = async () => ({
    message: 'Loaded from offline cache',
    clients: await localGetAll(ENTITY),
  });
  if (isOfflineNow()) return serveCache();
  try {
    const response = await axiosClient.get(`${API_URL}`, {
      withCredentials: true,
    });
    await localBulkPut(ENTITY, response.data?.clients);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return serveCache();
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch clients. Please try again.'));
  }
};

// Get a single client by ID
export const getClientById = async (id) => {
  if (isOfflineNow()) {
    const local = await localGetById(ENTITY, id);
    if (local) return { message: 'Loaded from offline cache', client: local };
  }
  try {
    const response = await axiosClient.get(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.client);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      const local = await localGetById(ENTITY, id);
      if (local) return { message: 'Loaded from offline cache', client: local };
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch client. Please try again.'));
  }
};

// Get clients by status
export const getClientsByStatus = async (status) => {
  const serveCache = async () => {
    const all = await localGetAll(ENTITY);
    const filtered = status ? all.filter((c) => c.status === status) : all;
    return { message: 'Loaded from offline cache', clients: filtered };
  };
  if (isOfflineNow()) return serveCache();
  try {
    const response = await axiosClient.get(`${API_URL}?status=${status}`, {
      withCredentials: true,
    });
    await localBulkPut(ENTITY, response.data?.clients);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return serveCache();
    }
    throw new Error(getErrorMessage(error, 'Failed to fetch clients. Please try again.'));
  }
};

// Search clients
export const searchClients = async (query) => {
  const serveCache = async () => {
    const all = await localGetAll(ENTITY);
    const q = (query || '').toLowerCase();
    const filtered = q
      ? all.filter(
          (c) =>
            (c.fullName || '').toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            (c.phone || '').toLowerCase().includes(q) ||
            (c.businessName || '').toLowerCase().includes(q),
        )
      : all;
    return { message: 'Loaded from offline cache', clients: filtered };
  };
  if (isOfflineNow()) return serveCache();
  try {
    const response = await axiosClient.get(`${API_URL}/search?query=${query}`, {
      withCredentials: true,
    });
    await localBulkPut(ENTITY, response.data?.clients);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return serveCache();
    }
    throw new Error(getErrorMessage(error, 'Failed to search clients. Please try again.'));
  }
};

// Update a client
export const updateClient = async (id, clientData) => {
  const offline = async () => {
    await enqueue({ method: 'put', url: `${API_URL}/${id}`, data: clientData, id });
    const existing = (await localGetById(ENTITY, id)) || {};
    const localDoc = { ...existing, ...clientData, _id: id, pending: true };
    await localPut(ENTITY, localDoc);
    return {
      message: 'Saved offline. Will sync when you reconnect.',
      client: localDoc,
      offline: true,
    };
  };
  if (isOfflineNow()) return offline();
  try {
    const response = await axiosClient.put(`${API_URL}/${id}`, clientData, {
      withCredentials: true,
    });
    await localPut(ENTITY, response.data?.client);
    return response.data;
  } catch (error) {
    if (isNetworkError(error)) {
      setOfflineNow(true);
      return offline();
    }
    throw new Error(getErrorMessage(error, 'Failed to update client. Please try again.'));
  }
};

// Delete a client
export const deleteClient = async (id) => {
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
    throw new Error(getErrorMessage(error, 'Failed to delete client. Please try again.'));
  }
};

// Update client purchase stats
export const updateClientPurchaseStats = async (clientId, amount) => {
  try {
    const response = await axiosClient.put(
      `${API_URL}/${clientId}/purchase-stats`,
      { clientId, amount },
      { withCredentials: true },
    );
    await localPut(ENTITY, response.data?.client);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update purchase stats. Please try again.');
  }
};
