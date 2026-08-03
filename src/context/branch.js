import { createContext, useContext } from 'react';

export const BRANCHES = [
  { value: 'AIDO_GROUP', label: 'AIDO Group' },
  { value: 'AIDO_PAPER_BAGS', label: 'AIDO Paper Bags' },
];

export const branchLabel = (value) =>
  BRANCHES.find((b) => b.value === value)?.label || value || 'AIDO Group';

export const BranchContext = createContext(null);

export const useBranch = () => {
  const ctx = useContext(BranchContext);
  if (!ctx) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return ctx;
};
