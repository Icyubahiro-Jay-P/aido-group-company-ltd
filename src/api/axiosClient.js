import axios from 'axios';

export const ACTIVE_BRANCH_KEY = 'aido_active_branch';

// The branch currently selected by the user. Source of truth is localStorage;
// the BranchContext keeps it in sync with the server's activeBranch.
export const getStoredActiveBranch = () => {
  try {
    return localStorage.getItem(ACTIVE_BRANCH_KEY) || null;
  } catch {
    return null;
  }
};

export const setStoredActiveBranch = (branch) => {
  try {
    if (branch) {
      localStorage.setItem(ACTIVE_BRANCH_KEY, branch);
    } else {
      localStorage.removeItem(ACTIVE_BRANCH_KEY);
    }
  } catch {
    // localStorage unavailable (private mode) - ignore
  }
};

// Single axios instance shared by every API service. It carries the cookie
// (withCredentials) and stamps the X-Active-Branch header on every request so
// the backend can resolve the branch context. The request interceptor is also
// the hook point for the offline queue (Feature 1).
const axiosClient = axios.create({ withCredentials: true });

axiosClient.interceptors.request.use((config) => {
  const branch = getStoredActiveBranch();
  if (branch) {
    config.headers = config.headers || {};
    config.headers['X-Active-Branch'] = branch;
  }
  return config;
});

export default axiosClient;
