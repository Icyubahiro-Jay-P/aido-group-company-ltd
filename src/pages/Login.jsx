import React, { useState, useEffect } from 'react';
import ButtonLoading from '../components/ButtonLoading';
import { Eye, EyeOff, InfoIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/userServices';

const Login = () => {
  useEffect(() => {
    document.title = "Login - AIDO Group Company Ltd";
  }, []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    await login(formData);
    navigate('/dashboard');
  } catch (err) {
    // Now err is a clean Error with .message
    setError(err.message || 'Invalid email or password');
  } finally {
    setIsLoading(false);
  }
};
  return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
          <div className="w-full max-w-md space-y-8 border border-gray-300 rounded-lg p-8 shadow-lg h-130">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-zinc-600">
                Sign in to continue
              </p>
            </div>
    
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
    
              {/* Password + forgot link */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
    
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 pr-11 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <div
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-700 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>
    
              {/* Error message */}
              {error && (
                <div className="text-red-600 text-sm text-center font-medium items-center flex -mt-4">
                  <InfoIcon size={18} className="inline-block mr-1" />
                  {error}
                </div>
              )}
    
              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-sm
                  hover:bg-blue-700 focus-visible:outline-2
                  focus-visible:outline-offset-2 focus-visible:outline-blue-600
                  active:bg-blue-800 transition-colors cursor-pointer
                  disabled:opacity-60 disabled:cursor-not-allowed
                `}
              >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <ButtonLoading />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
              </button>
            </form>
          </div>
        </div>
  )
}

export default Login