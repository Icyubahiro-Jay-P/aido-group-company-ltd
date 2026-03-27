// src/components/NavbarItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { createPortal } from "react-dom";
import { logout } from "../api/userServices";
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

  // Close modal when clicking the dark backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowLogoutModal(false);
    }
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

      {/* FULL-SCREEN CENTERED MODAL USING PORTAL */}
      {showLogoutModal &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={handleBackdropClick}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl w-full max-w-95 mx-4 overflow-hidden"
            >
              {/* Modal Icon & Title */}
              <div className="px-8 pt-10 pb-6 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100">
                  <LogOut size={42} className="text-red-600" />
                </div>

                <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                  Sign Out?
                </h3>
                <p className="text-slate-600 text-[15px] leading-relaxed px-2">
                  Are you sure you want to sign out?<br />
                  You'll need to log in again to access your account.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 px-6 py-6 flex gap-3">
                <button
                  onClick={handleLogoutCancel}
                  className="flex-1 py-3.5 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all rounded-md focus:outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all rounded-md focus:outline-none shadow-sm cursor-pointer"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default NavbarItem;