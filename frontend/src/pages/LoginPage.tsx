import React, { FormEvent, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';

import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login: applyToken, isAuthenticated, authEnabled } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      applyToken(data.access_token);
      navigate('/links');
    },
  });

  useEffect(() => {
    if (isAuthenticated && authEnabled) {
      navigate('/links');
    }
  }, [isAuthenticated, authEnabled, navigate]);

  if (!authEnabled) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Sign in to LinkLens</h1>
      <p className="mt-2 text-sm text-slate-600">Use your workspace credentials to access saved links.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        {mutation.isError && (
          <p className="text-sm text-red-600">Unable to sign in. Please check your credentials.</p>
        )}
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-500">Default credentials: demo@example.com / demo123</p>
    </div>
  );
};

export default LoginPage;
