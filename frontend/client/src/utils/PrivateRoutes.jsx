// import React from "react";
// import { useAuth } from "../context/authContext";
// import { Navigate } from "react-router-dom";

// const PrivateRoutes = ({ children }) => {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   return user ? children : <Navigate to="/login" replace />;
// };

// export default PrivateRoutes;

import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
