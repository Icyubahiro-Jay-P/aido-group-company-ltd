import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ButtonLoading from '../components/ButtonLoading';
import { InfoIcon, CheckCircle2 } from 'lucide-react';
import toast from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('https://aido-backend-h6gd.onrender.com/api/users/forgot-password', { email });
      setMessage(response.data.data || 'Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-8 border border-gray-300 rounded-lg p-8 shadow-lg bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {message ? (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5" />
            <p className="text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center font-medium">
                <InfoIcon size={18} className="inline-block mr-1" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <ButtonLoading />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
