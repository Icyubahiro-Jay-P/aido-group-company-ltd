import { useState } from 'react';
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
  // server's activeBranch (or the user's fixed home branch) is used. currentBranch
  // and the per-user localStorage copy are set synchronously here (not in an
  // effect) so the axios header and offline-cache reads are branch-correct from
  // the very first render/page fetch. The branch never changes in-place;
  // switching triggers a reload which remounts this provider and re-resolves.
  const [branch] = useState(() => {
    const resolved = getStoredActiveBranch(userId) || user?.activeBranch || homeBranch;
    setCurrentBranch(resolved);
    setStoredActiveBranch(userId, resolved);
    return resolved;
  });

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
