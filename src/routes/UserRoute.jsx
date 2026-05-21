import React from 'react';
import { Navigate } from 'react-router-dom';

export default function UserRoute({ children }) {

  const userToken =
    localStorage.getItem('token');

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}