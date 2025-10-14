import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface SimpleAdminLoginProps {
  onLoginSuccess: () => void;
}

const ADMIN_PASSWORD = 'Zb^73ZnP9T%Hr!';

const SimpleAdminLogin: React.FC<SimpleAdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Invalid password');
      setPassword('');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md ${shake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter password to access order history</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-colors"
              placeholder="Enter admin password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!password}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
              !password
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            Login
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Secure admin access
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminLogin;
