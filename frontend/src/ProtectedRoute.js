// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole  }) => {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }
  if (requiredRole && role !== requiredRole) {
    // Redirect to the dashboard for unauthorized roles
    return <Navigate to="/dashboard" replace />;
  }
  return children;

  // Check if the user is logged in (you can replace this with your actual authentication logic)
  const isAuthenticated = localStorage.getItem("authToken"); // Example: token stored in localStorage

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
