import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { API_BASE_URL } from '../api/config';
import { isOfflineNow, setOfflineNow } from './onlineStatus';
import { pendingCount } from './db';
import { syncOfflineQueue } from './sync';

const HEALTH_INTERVAL = 30000;

const checkHealth = async () => {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }
  try {
    const res = await axiosClient.get(`${API_BASE_URL}/api/health`, {
      timeout: 8000,
    });
    return res.status === 200;
  } catch {
    return false;
  }
};

// Tracks online/offline state and the number of pending offline writes. While
// online, heartbeats /api/health every 30s to detect a dead-but-"connected"
// network. Whenever we return online, the pending queue is replayed.
export const useOnlineStatus = () => {
  const [online, setOnline] = useState(!isOfflineNow());
  const [pending, setPending] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const refreshPending = async () => {
      if (cancelled) return;
      const count = await pendingCount().catch(() => 0);
      if (!cancelled) setPending(count);
    };

    const evaluate = async () => {
      const reachable = await checkHealth();
      setOfflineNow(!reachable);
      if (cancelled) return;
      setOnline(reachable);
      if (reachable) {
        await syncOfflineQueue().catch(() => {});
      }
      await refreshPending();
    };

    evaluate();
    refreshPending();

    const onOnline = () => evaluate();
    const onOffline = () => {
      setOfflineNow(true);
      if (!cancelled) setOnline(false);
      refreshPending();
    };
    const heartbeat = setInterval(evaluate, HEALTH_INTERVAL);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      cancelled = true;
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      clearInterval(heartbeat);
    };
  }, []);

  return { online, pending };
};
