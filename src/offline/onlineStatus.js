// In-memory connectivity flag shared by the services (which decide whether to
// hit the network or serve/queue locally) and the online-status hook (which
// flips it based on navigator.onLine + /api/health heartbeats).
let offline = false;

export const isOfflineNow = () => offline;

export const setOfflineNow = (value) => {
  offline = value;
};
