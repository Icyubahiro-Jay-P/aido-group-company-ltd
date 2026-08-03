import {
  Box,
  LayoutDashboard,
  Package,
  LayersPlus,
  BanknoteArrowDown,
  BanknoteArrowUp,
  ReceiptText,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react';
import NavbarItem from './NavbarItem';
import BranchSwitcher from './BranchSwitcher';
import { useBranch, branchLabel } from '../context/branch';

const AppSidebar = ({ brand = 'AIDO', active, user, navbarOpen = false }) => {
  const { branch } = useBranch();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${navbarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex items-center justify-start px-4 h-16 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Box size={20} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xl text-slate-800">{brand}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
              {branchLabel(branch)}
            </span>
          </div>
        </div>
      </div>

      <nav className="p-1 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-2">
          Main
        </div>
        <NavbarItem icon={LayoutDashboard} label="Dashboard" active={active === 'Dashboard'} />
        <NavbarItem icon={Package} label="Inventory" active={active === 'Inventory'} />
        <NavbarItem icon={LayersPlus} label="Stock in" active={active === 'Stock in'} />
        <NavbarItem icon={BanknoteArrowDown} label="Purchases" active={active === 'Purchases'} />
        <NavbarItem icon={BanknoteArrowUp} label="Sales" active={active === 'Sales'} />

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">
          System
        </div>
        <NavbarItem icon={ReceiptText} label="Reciepts" active={active === 'Reciepts'} />
        {user.role === 'Boss' && (
          <NavbarItem icon={TrendingUp} label="Reports" active={active === 'Reports'} />
        )}
        <div className="pt-2">
          <BranchSwitcher variant="sidebar" />
        </div>
        <NavbarItem icon={Settings} label="Settings" active={active === 'Settings'} />
        <NavbarItem icon={LogOut} label="Logout" isLogout={true} />
      </nav>

      {/* User Info at Bottom */}
      <div className="absolute bottom-0 w-full p-2 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
            {user.fullName ? user.fullName.split(' ').map((n) => n[0]).join('') : 'JD'}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
