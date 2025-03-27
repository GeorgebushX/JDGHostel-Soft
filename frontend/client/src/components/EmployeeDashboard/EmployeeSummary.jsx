import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import {
  FaBuilding,
  FaBed,
  FaUserGraduate,
  FaUserTie,
  FaMoneyBillWave,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeSummary = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!summary) {
    return (
      <div className="text-center mt-5 text-danger">Error loading data</div>
    );
  }

  return (
    <div className="p-4">
      {/* Dashboard Overview Section */}
      <h3 className="fs-4 fw-bold">Dashboard Overview</h3>

      {/* User Welcome Card */}
      <div className="d-flex align-items-center bg-light border shadow-sm p-4 rounded-5 position-relative overflow-hidden">
        {/* User Icon */}
        <div
          className="d-flex align-items-center justify-content-center text-white px-4 py-3 rounded-start"
          style={{
            background:
              "linear-gradient(135deg, rgb(31, 235, 48), rgb(82, 235, 11))",
            fontSize: "2rem",
            minWidth: "70px",
          }}
        >
          <FaUserTie />
        </div>

        {/* User Details */}
        <div className="ps-4">
          <p className="h6 text-muted mb-2">Welcome Back,</p>
          {user ? (
            <>
              <p className="h4 fw-bold text-dark">{user.name}</p>
              <p className="h5 text-muted">{user.email}</p>
            </>
          ) : (
            <p className="h5 text-muted">Loading...</p>
          )}
        </div>

        {/* Decorative Glow Effect */}
        <div
          className="position-absolute top-0 start-50 translate-middle-x w-100 h-100"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 168, 132, 0.2) 20%, transparent 80%)",
            zIndex: "-1",
          }}
        ></div>
      </div>

      {/* Management Section */}
      <div className="mt-3">
        <h4 className="text-center fs-4 fw-bold">Management</h4>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <FaBed /> Total Rooms
                </h5>
                <p className="card-text fs-3">{summary.totalRooms}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-info text-white h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <FaUserGraduate /> Total Students
                </h5>
                <p className="card-text fs-3">{summary.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card bg-danger text-white h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <FaMoneyBillWave /> Total Salary
                </h5>
                <p className="card-text fs-3">${summary.totalSalary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummary;
