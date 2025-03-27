// import React from "react";
// import { useAuth } from "../context/authContext";
// import { Navigate } from "react-router-dom";

// const RoleBaseRoutes = ({ children, requiredRole }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (!requiredRole.includes(user.role)) {
//     <Navigate to="/unauthorized" />;
//   }
//   return user ? children : <Navigate to="/login" />;
// };

// export default RoleBaseRoutes;

import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default RoleBaseRoutes;
