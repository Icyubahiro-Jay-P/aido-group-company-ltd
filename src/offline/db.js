import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';

// Offline cache + pending-write queue. The main API remains the source of
// truth; Dexie only mirrors data so the app keeps working without a network.
const db = new Dexie('AIDOOfflineDB');

db.version(1).stores({
  products: '_id, sku, productName, updatedAt',
  sales: '_id, saleDate, clientName',
  purchases: '_id, purchaseDate, supplierName',
  clients: '_id, email, fullName',
  queue: '++id, entity, method, createdAt',
  syncLog: '++id, syncedAt',
});

// v2: branch-scope the cache so a Boss switching branches never sees the other
// branch's cached rows offline. Old rows are dropped (they predate the branch
// field) and repopulate per-branch on the next fetch. The write queue and sync
// log are preserved.
db.version(2).stores({
  products: '_id, branch, sku, productName, updatedAt',
  sales: '_id, branch, saleDate, clientName',
  purchases: '_id, branch, purchaseDate, supplierName',
  clients: '_id, branch, email, fullName',
  queue: '++id, entity, method, createdAt',
  syncLog: '++id, syncedAt',
}).upgrade((tx) =>
  Promise.all(
    ['products', 'sales', 'purchases', 'clients'].map((t) => tx.table(t).clear()),
  ),
);

const TABLES = {
  product: () => db.products,
  sale: () => db.sales,
  purchase: () => db.purchases,
  client: () => db.clients,
};

const SORTERS = {
  sale: (a, b) => new Date(b.saleDate || 0) - new Date(a.saleDate || 0),
  purchase: (a, b) => new Date(b.purchaseDate || 0) - new Date(a.purchaseDate || 0),
  client: (a, b) => new Date(b.registeredDate || 0) - new Date(a.registeredDate || 0),
};

export const generateMutationId = () => uuidv4();

export const localGetAll = async (entity, branch) => {
  const rows = branch
    ? await TABLES[entity]().where('branch').equals(branch).toArray()
    : await TABLES[entity]().toArray();
  const sorter = SORTERS[entity];
  return sorter ? rows.sort(sorter) : rows;
};

export const localGetById = async (entity, id) => TABLES[entity]().get(id);

export const localPut = async (entity, doc) => {
  if (!doc || !doc._id) return;
  await TABLES[entity]().put({ ...doc, updatedAt: doc.updatedAt || new Date().toISOString() });
};

export const localBulkPut = async (entity, docs) => {
  const rows = (docs || []).filter((d) => d && d._id);
  if (rows.length) await TABLES[entity]().bulkPut(rows);
};

export const localDelete = async (entity, id) => {
  await TABLES[entity]().delete(id);
};

export const queueOp = async (item) => {
  await db.queue.add(item);
};

export const queuedOps = async () => db.queue.orderBy('createdAt').toArray();

export const removeQueuedOp = async (id) => {
  await db.queue.delete(id);
};

export const pendingCount = async () => db.queue.count();

export const syncLogCount = async () => db.syncLog.count();

export default db;
