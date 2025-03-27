import React from "react";
import { FaUserGraduate } from "react-icons/fa"; // Student-relevant icon
import { useAuth } from "../../context/authContext";

const StudentSummary = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex align-items-center bg-light border shadow-sm p-4 rounded-5 position-relative overflow-hidden">
      {/* Gradient User Icon */}
      <div
        className="d-flex align-items-center justify-content-center text-white px-4 py-3 rounded-start"
        style={{
          background: "linear-gradient(135deg,rgb(31, 235, 174), #00a884)", // More vibrant green gradient
          fontSize: "2rem",
          minWidth: "70px",
        }}
      >
        <FaUserGraduate />
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
  );
};

export default StudentSummary;
