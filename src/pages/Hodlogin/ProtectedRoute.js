import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isHodLoggedIn, children }) => {
  return isHodLoggedIn ? children : <Navigate to="/hodlogin" />;
};

export default ProtectedRoute;
