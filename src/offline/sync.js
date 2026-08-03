import axiosClient from '../api/axiosClient';
import db, { queuedOps, removeQueuedOp, localPut, localDelete } from './db';
import { setOfflineNow } from './onlineStatus';

const isNetworkError = (error) => !error?.response;

// Rewrite temp offline ids (e.g. offline-<uuid>) to the real server ids that
// earlier ops in this batch produced, so a sale can reference a product that
// was itself created offline in the same session.
const remapIds = (obj, idMap) => {
  if (Array.isArray(obj)) return obj.map((x) => remapIds(x, idMap));
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if ((k === 'productId' || k === 'clientId') && typeof v === 'string' && idMap[v]) {
        out[k] = idMap[v];
      } else {
        out[k] = remapIds(v, idMap);
      }
    }
    return out;
  }
  return obj;
};

const remapUrl = (url, idMap) => {
  let out = url;
  for (const [temp, real] of Object.entries(idMap)) {
    out = out.split(`/${temp}`).join(`/${real}`);
  }
  return out;
};

const serverDocFrom = (data) =>
  data?.sale ||
  data?.updatedSale ||
  data?.purchase ||
  data?.updatedPurchase ||
  data?.product ||
  data?.client ||
  null;

// Replays the pending write queue in order. Permanent failures (4xx) drop the
// op; transient failures (network/5xx) stop the loop so the queue is retried
// on the next reconnect/heartbeat.
export const syncOfflineQueue = async () => {
  const ops = await queuedOps();
  if (ops.length === 0) return { synced: 0 };

  const idMap = {};
  let synced = 0;

  for (const op of ops) {
    try {
      const url = remapUrl(op.url, idMap);
      const data = remapIds(op.data, idMap);
      const response = await axiosClient.request({
        method: op.method,
        url,
        data,
        withCredentials: true,
      });

      const serverDoc = serverDocFrom(response.data);
      if (serverDoc && serverDoc._id) {
        await localDelete(op.entity, op.id);
        await localPut(op.entity, serverDoc);
        if (op.id !== serverDoc._id) idMap[op.id] = serverDoc._id;
      } else if (op.method === 'delete') {
        await localDelete(op.entity, op.id);
      }

      await removeQueuedOp(op.id);
      await db.syncLog.add({
        entity: op.entity,
        method: op.method,
        success: true,
        error: null,
        syncedAt: new Date().toISOString(),
      });
      synced += 1;
    } catch (error) {
      const status = error?.response?.status;
      if (status >= 400 && status < 500 && status !== 429) {
        // Permanent rejection - drop the op so the queue never gets stuck.
        await removeQueuedOp(op.id);
        await db.syncLog.add({
          entity: op.entity,
          method: op.method,
          success: false,
          error: error.message || 'Request failed',
          syncedAt: new Date().toISOString(),
        });
      } else if (isNetworkError(error)) {
        setOfflineNow(true);
        break;
      } else {
        break;
      }
    }
  }

  return { synced };
};
