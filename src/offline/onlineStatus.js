// In-memory connectivity flag shared by the services (which decide whether to
// hit the network or serve/queue locally) and the online-status hook (which
// flips it based on navigator.onLine + /api/health heartbeats). It starts from
// navigator.onLine so a genuinely offline reload serves the cache immediately
// instead of waiting for a request timeout.
let offline = typeof navigator !== "undefined" && navigator.onLine === false;

export const isOfflineNow = () => offline;

export const setOfflineNow = (value) => {
  offline = value;
};
