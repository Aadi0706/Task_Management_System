import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ authUser }) => {
  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
