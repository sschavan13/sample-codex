import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="mx-auto mt-20 max-w-lg text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">The page you are looking for doesn’t exist or was moved.</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
