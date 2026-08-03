import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Menu,
  Box,
  LayoutDashboard,
  Package,
  LayersPlus,
  BanknoteArrowUp,
  BanknoteArrowDown,
  ReceiptText,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react';
import NavbarItem from './NavbarItem';

const DashboardLayout = ({
  title,
  brand = 'AIDO',
  active,
  headerActions,
  children,
}) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { user } = useOutletContext();

  return (
    <div className="flex h-dvh bg-slate-50 font-sans text-slate-900">
      {/* Mobile Navbar Overlay */}
      {navbarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setNavbarOpen(false)}
        />
      )}

      {/* Sidebar / Navbar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${navbarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-start px-4 h-16 border-b border-slate-200">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Box size={20} />
            </div>
            {brand}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">
            Main
          </div>
          <NavbarItem icon={LayoutDashboard} label="Dashboard" active={active === 'Dashboard'} />
          <NavbarItem icon={Package} label="Inventory" active={active === 'Inventory'} />
          <NavbarItem icon={LayersPlus} label="Stock in" active={active === 'Stock in'} />
          <NavbarItem icon={BanknoteArrowDown} label="Purchases" active={active === 'Purchases'} />
          <NavbarItem icon={BanknoteArrowUp} label="Sales" active={active === 'Sales'} />

          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
            System
          </div>
          <NavbarItem icon={ReceiptText} label="Reciepts" active={active === 'Reciepts'} />
          {user.role === 'Boss' && (
            <NavbarItem icon={TrendingUp} label="Reports" active={active === 'Reports'} />
          )}
          <NavbarItem icon={Settings} label="Settings" active={active === 'Settings'} />
          <NavbarItem icon={LogOut} label="Logout" isLogout={true} />
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNavbarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">{title}</h1>
          </div>
          {headerActions}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
