// src/components/NavbarItem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { logout } from "../api/userServices";
import ConfirmModal from "./ConfirmModal";

const NavbarItem = ({ icon: Icon, label, active = false, to, isLogout = false }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleClick = () => {
    if (isLogout) {
      setShowLogoutModal(true);
    } else {
      navigate(`../${label.toLowerCase().replaceAll(' ', '')}`);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();  // Clear server session and cookies
    } catch (error) {
      // Even if logout fails on server, proceed with clearing frontend
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();  // Clear any local storage data
      sessionStorage.clear();  // Clear session storage too
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all rounded-sm group cursor-pointer outline-none ${
          active
            ? "bg-blue-50 text-blue-600 shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Icon
          className={`w-5 h-5 mr-3 transition-colors shrink-0 ${
            active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
          }`}
        />
        <span className="flex-1 text-left">{label}</span>
      </button>

      <ConfirmModal
        open={showLogoutModal}
        title="Sign Out?"
        message={
          <>
            Are you sure you want to sign out?
            <br />
            You'll need to log in again to access your account.
          </>
        }
        confirmText="Yes, Sign Out"
        cancelText="Cancel"
        icon={LogOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default NavbarItem;
