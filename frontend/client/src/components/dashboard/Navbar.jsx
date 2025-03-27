import React from "react";
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav className="d-flex justify-content-between align-items-center bg-primary  text-white py-1 px-4 shadow">
        {/* Welcome Message */}
        <p style={{ marginLeft: "28px", marginTop: "8px" }}>
          Welcome {user?.name || "Admin"}!
        </p>

        {/* Logout Button */}
        <button className="btn btn-outline-light" onClick={logout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
