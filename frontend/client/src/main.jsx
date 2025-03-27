import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import AuthContext from "./context/authContext.jsx";
import AuthContext from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(
  // after wraping authcontext, user can pass app as a children

  <AuthContext>
    <App />
  </AuthContext>
);
