import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredActiveBranch, setStoredActiveBranch } from '../api/axiosClient';

export const BRANCHES = [
  { value: 'AIDO_GROUP', label: 'AIDO Group' },
  { value: 'AIDO_PAPER_BAGS', label: 'AIDO Paper Bags' },
];

export const branchLabel = (value) =>
  BRANCHES.find((b) => b.value === value)?.label || value || 'AIDO Group';

const BranchContext = createContext(null);

export const useBranch = () => {
  const ctx = useContext(BranchContext);
  if (!ctx) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return ctx;
};

// Provides the currently active branch to every page inside the protected
// layout. The active branch travels to the backend via the X-Active-Branch
// header (see axiosClient) so every request is scoped to that branch.
export const BranchProvider = ({ user, children }) => {
  const homeBranch = user?.branch || 'AIDO_GROUP';
  const canSwitchBranches = !!user?.canSwitchBranches;

  const [branch, setBranch] = useState(() => {
    const stored = getStoredActiveBranch();
    if (stored) return stored;
    return user?.activeBranch || homeBranch;
  });

  // On login, adopt the server's activeBranch (or the user's home branch) if
  // nothing is stored locally yet. Once the user has switched, the local
  // choice wins so a stale server value never clobbers it after a reload.
  useEffect(() => {
    if (!user) return;
    const stored = getStoredActiveBranch();
    if (!stored) {
      const resolved = user.activeBranch || homeBranch;
      setStoredActiveBranch(resolved);
      setBranch(resolved);
    }
  }, [user, homeBranch]);

  // Switching branches forces a full remount (reload) so every page refetches
  // its data with the new X-Active-Branch header.
  const switchBranch = (next) => {
    if (!canSwitchBranches) return;
    if (!BRANCHES.some((b) => b.value === next)) return;
    if (next === branch) return;
    setStoredActiveBranch(next);
    window.location.reload();
  };

  return (
    <BranchContext.Provider
      value={{ branch, homeBranch, canSwitchBranches, switchBranch }}
    >
      {children}
    </BranchContext.Provider>
  );
};
