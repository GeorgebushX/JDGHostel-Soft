import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import HomeNavibar from "./HomeNavibar";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login } = useAuth(); // Correctly calling useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (response.data.success) {
        // Store token inside localStorage
        login(response.data.user); // Pass user data, not success flag
        localStorage.setItem("token", response.data.token);

        // Navigate based on user role
        switch (response.data.user.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "student":
            navigate("/student-dashboard");
            break;
          default:
            navigate("/employee-dashboard");
        }

        toast.success("Successfully Logged In!");
        setError(null); // Clear previous errors
      } else {
        setError("Login failed, please check your credentials.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Server error, please try again later."
      );
    }
  };

  return (
    <div>
      <HomeNavibar />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ width: "350px" }}>
          <form onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Login</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="******"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                />
                <span
                  className="input-group-text bg-white"
                  style={{ cursor: "pointer" }}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
