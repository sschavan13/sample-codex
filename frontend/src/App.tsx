import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import LinksPage from './pages/LinksPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  const { authEnabled, isAuthenticated } = useAuth();

  return (
    <Routes>
      {authEnabled && (
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/links" replace /> : <LoginPage />}
        />
      )}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={authEnabled ? <Navigate to="/links" replace /> : <LinksPage />}
        />
        <Route
          path="/links"
          element={authEnabled && !isAuthenticated ? <Navigate to="/login" replace /> : <LinksPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
