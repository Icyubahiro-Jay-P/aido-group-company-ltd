import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AppSidebar from './AppSidebar';

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

      <AppSidebar brand={brand} active={active} user={user} navbarOpen={navbarOpen} />

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
