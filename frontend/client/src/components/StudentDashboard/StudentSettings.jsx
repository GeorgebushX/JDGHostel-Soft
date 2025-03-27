// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/authContext";
// import { BsEye, BsEyeSlash } from "react-icons/bs";
// import axios from "axios";

// const StudentSettings = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [setting, setSetting] = useState({
//     userId: user._id,
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSetting({ ...setting, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (setting.newPassword !== setting.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await axios.put(
//         "http://localhost:5000/api/settings/change-password",
//         setting,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         navigate("/student-dashboard");
//       }
//     } catch (error) {
//       if (error.response && !error.response.data.success) {
//         setError(error.response.data.error);
//       } else {
//         setError("Something went wrong. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="container d-flex justify-content-center mt-5">
//       <div className="card shadow p-4" style={{ width: "400px" }}>
//         <h2 className="text-center fw-bold mb-3">Change Password</h2>

//         {error && <p className="alert alert-danger">{error}</p>}

//         <form onSubmit={handleSubmit}>
//           {/* Old Password */}
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Old Password</label>
//             <input
//               type="password"
//               name="oldPassword"
//               placeholder="Enter old password"
//               onChange={handleChange}
//               className="form-control"
//               required
//             />
//           </div>

//           {/* New Password */}
//           <div className="mb-3">
//             <label className="form-label fw-semibold">New Password</label>
//             <input
//               type="password"
//               name="newPassword"
//               placeholder="Enter new password"
//               onChange={handleChange}
//               className="form-control"
//               required
//             />
//           </div>

//           {/* Confirm Password */}
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm new password"
//               onChange={handleChange}
//               className="form-control"
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <button type="submit" className="btn btn-primary w-100">
//             Change Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentSettings;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import axios from "axios";

const StudentSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [setting, setSetting] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (setting.newPassword !== setting.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/settings/change-password",
        setting,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/student-dashboard");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center fw-bold mb-3">Change Password</h2>

        {error && <p className="alert alert-danger">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Old Password</label>
            <div className="input-group">
              <input
                type={passwordVisibility.oldPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="Enter old password"
                onChange={handleChange}
                className="form-control"
                required
              />
              <span
                className="input-group-text bg-white border"
                onClick={() => togglePasswordVisibility("oldPassword")}
                style={{ cursor: "pointer" }}
              >
                {passwordVisibility.oldPassword ? <BsEyeSlash /> : <BsEye />}
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">New Password</label>
            <div className="input-group">
              <input
                type={passwordVisibility.newPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                onChange={handleChange}
                className="form-control"
                required
              />
              <span
                className="input-group-text bg-white border"
                onClick={() => togglePasswordVisibility("newPassword")}
                style={{ cursor: "pointer" }}
              >
                {passwordVisibility.newPassword ? <BsEyeSlash /> : <BsEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                onChange={handleChange}
                className="form-control"
                required
              />
              <span
                className="input-group-text bg-white border"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                style={{ cursor: "pointer" }}
              >
                {passwordVisibility.confirmPassword ? (
                  <BsEyeSlash />
                ) : (
                  <BsEye />
                )}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentSettings;
