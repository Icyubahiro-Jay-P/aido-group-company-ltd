import React, { useState, useEffect, useMemo } from "react";
import {
  Menu,
  Box,
  Save,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  LayoutDashboard,
  Package,
  LayersPlus,
  BanknoteArrowUp,
  BanknoteArrowDown,
  ReceiptText,
  TrendingUp,
  SettingsIcon,
  LogOut,
  Users,
  UserPlus,
  UserMinus,
  UserPen,
  UserCheck,
  UserCog,
  Trash2,
  AlertTriangle,
  Calendar1,
  Hash,
  UserKey,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import NavbarItem from "../components/NavbarItem";
import {
  getAllUsers,
  deleteUserById,
  registerUser,
  changeUserPassword,
  updateUserProfile,
} from "../api/userServices";
import { toast } from "sonner";

const Settings = () => {
  const context = useOutletContext();
  const user = context?.user;

  // Initialize all state at the top level (before guards)
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [usersPage, setUsersPage] = useState(1);

  // Initialize profile data safely (guard against undefined user)
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    dateOfBirth: user?.dateOfBirth || "",
    nationalIdentity: user?.nationalIdentity || "",
    role: user?.role || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newUserData, setNewUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    nationalIdentity: "",
    dateOfBirth: "",
    role: "Worker",
  });

  const USERS_PER_PAGE = useMemo(() => 10, []);

  // FIXED: ALL useEffects moved BEFORE the early return guard.
  // This was the serial killer — React hook rules were being violated every time !user.
  // On first render (no user yet) you were skipping 4 hooks → inconsistent hook count → React freaks out → eternal loading + random crashes.
  // Now hooks run EVERY render like civilized adults. No more limbo. (You're welcome.)

  // Update profileData when user context changes (full sync now, not half-assed partial deps)
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth || "",
        nationalIdentity: user.nationalIdentity || "",
        role: user.role || "",
      });
    }
  }, [user]);

  // Set page title
  useEffect(() => {
    document.title = "AIDO Group Company Ltd - Settings";
  }, []);

  // Consolidated effect: fetch users when admin tab opens or page changes
  useEffect(() => {
    // Only proceed if Boss is viewing admin tab
    if (user?.role !== "Boss" || activeTab !== "admin") {
      return;
    }

    let isMounted = true;
    const abortController = new AbortController();

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await getAllUsers(usersPage, USERS_PER_PAGE);
        // Only update state if component is still mounted
        if (isMounted) {
          setUsers(response.users || []);
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          console.error("[Settings] Fetch users error:", error);
          toast.error(error.message || "Failed to fetch users");
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setLoadingUsers(false);
        }
      }
    };

    loadUsers();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [user?.role, activeTab, usersPage, USERS_PER_PAGE]);

  // Reset page to 1 when switching away from admin tab
  useEffect(() => {
    if (activeTab !== "admin" && usersPage !== 1) {
      setUsersPage(1);
    }
  }, [activeTab]);

  // Guard: Early exit if user is not loaded (NOW AFTER all hooks — rules obeyed)
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading user data...</div>;
  }

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!profileData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      await updateUserProfile({
        fullName: profileData.fullName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
        dateOfBirth: profileData.dateOfBirth,
        nationalIdentity: profileData.nationalIdentity,
      });
      toast.success("Profile updated successfully");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }
    if (!passwordData.newPassword.trim()) {
      toast.error("New password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password cannot be the same as current password");
      return;
    }

    try {
      await changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserById(userId);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleNewUserChange = (e) => {
    setNewUserData({ ...newUserData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (newUserData.password !== newUserData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { confirmPassword, ...registerData } = newUserData;
      await registerUser(registerData);
      toast.success("User created successfully");
      setNewUserData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        nationalIdentity: "",
        dateOfBirth: "",
        role: "Worker",
      });
      setShowAddUserForm(false);
      // Fetch fresh user list with reset to page 1
      setUsersPage(1);
    } catch (error) {
      toast.error(error.message || error.error || "Failed to create user");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {navbarOpen && (
        <div
          className="fixed inset-0 bg-white z-20 lg:hidden"
          onClick={() => setNavbarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${navbarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-start px-4 h-16 border-b border-slate-200">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Box size={20} />
            </div>
            Settings
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">
            Main
          </div>
          <NavbarItem icon={LayoutDashboard} label="Dashboard" />
          <NavbarItem icon={Package} label="Inventory" />
          <NavbarItem icon={LayersPlus} label="Stock in" />
          <NavbarItem icon={BanknoteArrowDown} label="Purchases" />
          <NavbarItem icon={BanknoteArrowUp} label="Sales" />
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-6">
            System
          </div>
          <NavbarItem icon={ReceiptText} label="Reciepts" />
          {user.role === "Boss" && <NavbarItem icon={TrendingUp} label="Reports" />}
          <NavbarItem icon={SettingsIcon} label="Settings" active />
          <NavbarItem icon={LogOut} label="Logout" isLogout={true} />
        </nav>

        {/* User Info at Bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {user.fullName
                ? user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "JD"}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {user.fullName}
              </p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNavbarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
            >
              <Menu size={20} />
            </button>
            <h1 className='text-2xl font-bold'>Account Settings</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
          <div className="mb-8 bg-linear-to-r from-slate-700 to-slate-800 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-slate-300">
                  Manage your profile and account preferences.
                </p>
              </div>
              <div className="text-slate-400">
                <SettingsIcon size={48} />
              </div>
            </div>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              Changes saved successfully!
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === "security"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Security
            </button>
            {user?.role === "Boss" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === "admin"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                User Management
              </button>
            )}
          </div>

          {/* Profile Settings Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Profile Information
              </h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleProfileChange}
                        placeholder="(555) 123-4567"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of birth
                    </label>
                    <div className="relative">
                      <Calendar1 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={
                          profileData.dateOfBirth
                            ? new Date(profileData.dateOfBirth)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={handleProfileChange}
                        className="w-full pl-10 pr-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      National ID
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="nationalIdentity"
                        value={profileData.nationalIdentity}
                        onChange={handleProfileChange}
                        placeholder="National ID"
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {user?.role === "Boss" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <UserKey className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <select
                          name="role"
                          id="role"
                          value={profileData.role}
                          onChange={handleProfileChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                          <option value="Worker">Worker</option>
                          <option value="Boss">Boss</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="mt-6 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="max-w-md">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {passwordData.newPassword &&
                  passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-red-600 text-sm mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      Passwords do not match
                    </p>
                  )}
                {passwordData.newPassword &&
                  passwordData.newPassword.length < 6 && (
                    <p className="text-red-600 text-sm mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      Password must be at least 6 characters
                    </p>
                  )}
                {passwordData.currentPassword &&
                  passwordData.newPassword &&
                  passwordData.currentPassword === passwordData.newPassword && (
                    <p className="text-red-600 text-sm mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      New password cannot be the same as current password
                    </p>
                  )}
                <button
                  type="submit"
                  disabled={
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  Update Password
                </button>
              </form>
            </div>
          )}
          {user?.role === "Boss" && activeTab === "admin" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                User Management
              </h2>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setShowAddUserForm(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    !showAddUserForm
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Users size={18} />
                  View Users
                </button>
                <button
                  onClick={() => setShowAddUserForm(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    showAddUserForm
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <UserPlus size={18} />
                  Add New User
                </button>
              </div>

              {!showAddUserForm && (
                <div>
                  {loadingUsers ? (
                    <p className="text-center text-slate-500 py-8">
                      Loading users...
                    </p>
                  ) : users.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">
                      No users found
                    </p>
                  ) : (
                    <div>
                      <div className="space-y-3">
                        {users.map((u) => (
                          <div
                            key={u._id}
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {u.fullName
                                  ? u.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                  : "?"}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">
                                  {u.fullName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {u.email}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    u.role === "Boss"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {u.role}
                                </span>
                                <p className="text-xs text-slate-500 whitespace-nowrap">
                                  {u.phoneNumber}
                                </p>
                              </div>
                            </div>
                            {u._id !== user?._id && (
                              <button
                                onClick={() => setDeleteConfirm(u)}
                                className="ml-4 p-2 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 size={18} className="text-red-600" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600">
                          Showing page {usersPage}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setUsersPage(Math.max(1, usersPage - 1))
                            }
                            disabled={usersPage === 1}
                            className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            Page {usersPage}
                          </span>
                          <button
                            onClick={() => setUsersPage(usersPage + 1)}
                            disabled={users.length < USERS_PER_PAGE}
                            className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showAddUserForm && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-6">
                    Create New User
                  </h2>
                  <form onSubmit={handleAddUser}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="fullName"
                            value={newUserData.fullName}
                            onChange={handleNewUserChange}
                            placeholder="John Doe"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={newUserData.email}
                            onChange={handleNewUserChange}
                            placeholder="john@example.com"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={newUserData.phoneNumber}
                            onChange={handleNewUserChange}
                            placeholder="+250123456789"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          National ID
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            name="nationalIdentity"
                            value={newUserData.nationalIdentity}
                            onChange={handleNewUserChange}
                            placeholder="ID number"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar1 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={newUserData.dateOfBirth}
                            onChange={handleNewUserChange}
                            required
                            className="w-full pl-10 pr-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Role
                        </label>
                        <div className="relative">
                          <UserKey className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          <select
                            name="role"
                            value={newUserData.role}
                            onChange={handleNewUserChange}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                          >
                            <option value="Worker">Worker</option>
                            <option value="Boss">Boss</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="password"
                            name="password"
                            value={newUserData.password}
                            onChange={handleNewUserChange}
                            placeholder="••••••••"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={newUserData.confirmPassword}
                            onChange={handleNewUserChange}
                            placeholder="••••••••"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    {newUserData.password &&
                      newUserData.confirmPassword &&
                      newUserData.password !== newUserData.confirmPassword && (
                        <p className="text-red-600 text-sm mt-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                          Passwords do not match
                        </p>
                      )}
                    <div className="flex gap-3 mt-6">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        <UserPlus size={18} />
                        Create User
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddUserForm(false)}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Delete User
                    </h3>
                    <p className="text-sm text-slate-500">
                      This action cannot be undone
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {deleteConfirm.fullName}
                  </span>
                  ? All associated data will be removed from the system.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDeleteUser(deleteConfirm._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete User
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;