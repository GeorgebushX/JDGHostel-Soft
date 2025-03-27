import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaMoneyBill,
  FaCog,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const StudentSidebar = () => {
  const { user } = useAuth();
  return (
    <div
      className="bg-dark text-white vh-100 position-fixed start-0 top-0 p-0 shadow-lg overflow-auto"
      style={{ width: "20%" }}
    >
      {/* Sidebar Header */}
      <div className="text-center mb-2">
        <h3 className="d-flex fw-bold mb-3 align-items-center bg-primary text-white py-2 px-5">
          Student
        </h3>
      </div>

      {/* Sidebar Navigation Links */}
      <div className="nav flex-column">
        <NavLink
          to="/student-dashboard"
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
          to={`/student-dashboard/view-student/${user._id}`}
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaUserGraduate className="me-2" />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to={`/student-dashboard/viewfee/${user._id}`}
          className={({ isActive }) =>
            `nav-link text-white d-flex align-items-center mb-2 p-2 rounded ${
              isActive ? "bg-primary text-white" : ""
            }`
          }
        >
          <FaMoneyBill className="me-2" />
          <span>Fee</span>
        </NavLink>

        <NavLink
          to="/student-dashboard/settings"
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

export default StudentSidebar;
