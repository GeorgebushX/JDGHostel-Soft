import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const idProofRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeid: "",
    dob: "",
    gender: "",

    maritalStatus: "",
    phone: "",
    room_number: "",
    salary: "",
    role: "",
  });

  // Fetch employee details
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const employee = response.data.data;
          setFormData({
            name: employee.name,
            email: employee.email,
            employeeid: employee.employeeid,
            dob: employee.dob,
            gender: employee.gender,
            maritalStatus: employee.maritalStatus,
            phone: employee.phone,
            room_number: employee.room_number?._id || "",
            salary: employee.salary,
            role: employee.role,
          });
        } else {
          toast.error("Failed to fetch employee details.");
        }
      } catch (error) {
        toast.error("Error fetching employee details: " + error.message);
      }
    };

    fetchEmployee();
  }, [id]);

  // Fetch available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/room/getall",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setRooms(response.data.data);
        } else {
          toast.error("Failed to fetch rooms.");
        }
      } catch (error) {
        toast.error("Error fetching rooms: " + error.message);
      }
    };

    fetchRooms();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (imageRef.current?.files[0]) {
      formDataToSend.append("image", imageRef.current.files[0]);
    }
    if (idProofRef.current?.files[0]) {
      formDataToSend.append("id_proof", idProofRef.current.files[0]);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employee/update/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Employee updated successfully!");
        navigate("/admin-dashboard/employees");
      } else {
        toast.error("Failed to update employee.");
      }
    } catch (error) {
      toast.error("Error updating employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2>Update Employee</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Left Side Inputs */}
                  <div className="col-md-6">
                    {[
                      { label: "Name", name: "name", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      {
                        label: "Employee ID",
                        name: "employeeid",
                        type: "text",
                      },
                      { label: "Date of Birth", name: "dob", type: "date" },
                      { label: "Phone Number", name: "phone", type: "phone" },
                    ].map(({ label, name, type }) => (
                      <div key={name} className="mb-3">
                        <label className="form-label">{label}</label>
                        <input
                          type={type}
                          name={name}
                          className="form-control"
                          value={formData[name]}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}

                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Side Inputs */}
                  <div className="col-md-6">
                    {[
                      {
                        label: "Gender",
                        name: "gender",
                        options: ["male", "female", "other"],
                      },
                      {
                        label: "Marital Status",
                        name: "maritalStatus",
                        options: ["single", "married"],
                      },
                    ].map(({ label, name, options }) => (
                      <div key={name} className="mb-3">
                        <label className="form-label">{label}</label>
                        <select
                          name={name}
                          className="form-select"
                          value={formData[name]}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select {label}</option>
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                    <div className="mb-3">
                      <label className="form-label">Room Number</label>
                      <select
                        name="room_number"
                        className="form-select"
                        value={formData.room_number}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Room</option>
                        {rooms.map((room) => (
                          <option key={room._id} value={room._id}>
                            {room.room_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        ref={imageRef}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Upload ID Proof</label>
                      <input
                        type="file"
                        name="id_proof"
                        className="form-control"
                        ref={idProofRef}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success me-2"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <Link
                    to="/admin-dashboard/employees"
                    className="btn btn-secondary"
                  >
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployee;
