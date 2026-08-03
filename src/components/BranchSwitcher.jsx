import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Building2 } from 'lucide-react';
import { useBranch, BRANCHES, branchLabel } from '../context/branch';

// Branch switcher for users with canSwitchBranches (Bosses). Two responsive
// variants:
//   - "header": a compact pill in the top bar (label from sm+, icon-only on the
//     smallest screens) with a right-aligned dropdown.
//   - "sidebar": a full-width, touch-friendly control inside the mobile nav
//     drawer (and the desktop sidebar) with a dropdown that spans its width.
// Switching persists the choice and reloads so every page refetches with the
// new X-Active-Branch header.
const BranchSwitcher = ({ variant = 'header' }) => {
  const { branch, canSwitchBranches, switchBranch } = useBranch();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!canSwitchBranches) return null;

  const isSidebar = variant === 'sidebar';

  return (
    <div className={`relative ${isSidebar ? 'w-full' : ''}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Switch branch"
        title="Switch branch"
        className={
          isSidebar
            ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors'
            : 'flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors'
        }
      >
        <Building2 size={16} className="text-blue-600 shrink-0" />
        <span className={isSidebar ? 'flex-1 text-left truncate' : 'hidden sm:inline'}>
          {branchLabel(branch)}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={`bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-1.5 ${
            isSidebar
              ? 'absolute left-0 right-0 top-full mt-2'
              : 'absolute right-0 mt-2 w-56 sm:w-64'
          }`}
        >
          <p className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Switch branch
          </p>
          {BRANCHES.map((b) => {
            const isActive = branch === b.value;
            return (
              <button
                key={b.value}
                type="button"
                role="menuitem"
                disabled={isActive}
                onClick={() => {
                  setOpen(false);
                  switchBranch(b.value);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2
                  size={16}
                  className={isActive ? 'text-blue-600' : 'text-slate-400'}
                />
                <span className="flex-1 text-left">{b.label}</span>
                {isActive && <Check size={16} className="text-blue-600" />}
              </button>
            );
          })}
          <div className="mt-1 px-3 py-2 border-t border-slate-100 text-xs text-slate-500">
            All pages reload with the selected branch's data.
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSwitcher;
