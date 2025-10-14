import React, { useState, useEffect } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminOrderHistory from '../components/AdminOrderHistory';

const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    sessionStorage.setItem('admin_token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('admin_token');
  };

  if (!token) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminOrderHistory token={token} onLogout={handleLogout} />;
};

export default AdminPage;
