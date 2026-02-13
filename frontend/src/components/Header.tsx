import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { authEnabled, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-semibold text-brand-600 hover:text-brand-500">
          LinkLens
        </Link>
        {authEnabled && (
          <div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign out
              </button>
            ) : (
              location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="rounded-md border border-transparent bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500"
                >
                  Sign in
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
