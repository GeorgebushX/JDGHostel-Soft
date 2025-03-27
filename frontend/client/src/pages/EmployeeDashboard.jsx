import React from "react";
import Sidebar from "../components/EmployeeDashboard/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar";

const EmployeeDashboard = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="min-vh-100 bg-dark text-white p-3"
        style={{ width: "250px" }}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 bg-light min-vh-100 d-flex flex-column">
        <Navbar />
        <div className="container-fluid mt-3">
          {/* Outlet is used to render the child component inside the dashboard */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
