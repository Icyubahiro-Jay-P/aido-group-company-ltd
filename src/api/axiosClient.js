import axios from 'axios';

// The branch currently active in this browser session. The BranchProvider sets
// it from the logged-in user's stored/preferred branch; the request interceptor
// stamps it as the X-Active-Branch header on every request.
let currentBranch = null;

export const getCurrentBranch = () => currentBranch;

export const setCurrentBranch = (branch) => {
  currentBranch = branch;
};

const ACTIVE_BRANCH_KEY = (userId) =>
  userId ? `aido_active_branch_${userId}` : 'aido_active_branch';

// Per-user persistence so switching accounts never leaks another user's branch.
export const getStoredActiveBranch = (userId) => {
  try {
    return localStorage.getItem(ACTIVE_BRANCH_KEY(userId)) || null;
  } catch {
    return null;
  }
};

export const setStoredActiveBranch = (userId, branch) => {
  try {
    if (branch) {
      localStorage.setItem(ACTIVE_BRANCH_KEY(userId), branch);
    } else {
      localStorage.removeItem(ACTIVE_BRANCH_KEY(userId));
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
  const branch = getCurrentBranch();
  if (branch) {
    config.headers = config.headers || {};
    config.headers['X-Active-Branch'] = branch;
  }
  return config;
});

export default axiosClient;
