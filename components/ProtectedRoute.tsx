import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    // If not logged in, redirect to the login page
    return <Navigate to="/" replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    // If it's an admin-only route and the user is not an admin, redirect to home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
