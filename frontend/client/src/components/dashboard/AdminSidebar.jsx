import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserTie,
  FaUsers,
  FaBuilding,
  FaDoorOpen,
  FaMoneyBill,
  FaCog,
} from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div
      className="bg-dark text-white vh-100 position-fixed start-0 top-0 p-0 shadow-lg overflow-auto"
      style={{ width: "20%" }}
    >
      {/* Sidebar Header */}
      <div className="text-center mb-2">
        <h3 className="d-flex fw-bold mb-3 align-items-center bg-primary text-white py-2 px-5">
          Admin
        </h3>
      </div>

      {/* Sidebar Navigation Links */}
      <div className="nav flex-column">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
          end
        >
          <FaTachometerAlt className="me-2" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaUserTie className="me-2" />
          <span>Employees</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/students"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaUsers className="me-2" />
          <span>Students</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/floors"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaBuilding className="me-2" />
          <span>Floors</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/rooms"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaDoorOpen className="me-2" />
          <span>Rooms</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/fee-list"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaMoneyBill className="me-2" />
          <span>Student Fee</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/salary-list"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaMoneyBill className="me-2" />
          <span>Employee Salary</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/settings"
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaCog className="me-2" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
