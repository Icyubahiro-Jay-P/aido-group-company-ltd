import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ButtonLoading from '../components/ButtonLoading';
import { Eye, EyeOff, InfoIcon, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    setError('');
    
    try {
      await axios.post(`https://aido-backend-h6gd.onrender.com/api/users/reset-password/${token}`, { password: formData.password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password. The token may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md border border-gray-300 rounded-lg p-8 shadow-lg bg-white text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">Password Reset Successful</h1>
          <p className="text-zinc-600 mb-8">You can now sign in with your new password.</p>
          <Link to="/login" className="w-full inline-block rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-8 border border-gray-300 rounded-lg p-8 shadow-lg bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Create New Password</h1>
          <p className="mt-2 text-sm text-zinc-600">Enter a new secure password</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pr-11 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="••••••••"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm flex items-center font-medium">
              <InfoIcon size={18} className="inline-block mr-1" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-blue-700 transition"
          >
            {isLoading ? <ButtonLoading /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
