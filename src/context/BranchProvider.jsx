import { useEffect, useState } from 'react';
import { BranchContext, BRANCHES } from './branch';
import {
  getStoredActiveBranch,
  setStoredActiveBranch,
  setCurrentBranch,
} from '../api/axiosClient';

// Provides the currently active branch to every page inside the protected
// layout. The active branch travels to the backend via the X-Active-Branch
// header (see axiosClient) so every request is scoped to that branch.
export const BranchProvider = ({ user, children }) => {
  const homeBranch = user?.branch || 'AIDO_GROUP';
  const canSwitchBranches = !!user?.canSwitchBranches;
  const userId = user?._id;

  // Resolve the branch once: a stored choice for this user wins, otherwise the
  // server's activeBranch (or the user's fixed home branch) is used. The branch
  // never changes in-place; switching triggers a reload which remounts this
  // provider and re-resolves from the freshly persisted value.
  const [branch] = useState(() => {
    const stored = getStoredActiveBranch(userId);
    return stored || user?.activeBranch || homeBranch;
  });

  // Keep the in-memory branch (read by the axios interceptor) and the per-user
  // localStorage copy in sync with the resolved branch.
  useEffect(() => {
    setCurrentBranch(branch);
    setStoredActiveBranch(userId, branch);
  }, [userId, branch]);

  // Switching branches forces a full remount (reload) so every page refetches
  // its data with the new X-Active-Branch header. Persist synchronously so the
  // reload doesn't race the effect.
  const switchBranch = (next) => {
    if (!canSwitchBranches) return;
    if (!BRANCHES.some((b) => b.value === next)) return;
    if (next === branch) return;
    setCurrentBranch(next);
    setStoredActiveBranch(userId, next);
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
