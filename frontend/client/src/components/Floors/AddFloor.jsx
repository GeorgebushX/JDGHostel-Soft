import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "react-toastify";

const AddFloor = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    floor_number: "",
    total_rooms: "",
    capacity: "",
  });

  // Handle input change to update state dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/floor/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Floor added successfully!");
        navigate("/admin-dashboard/floors");
      } else {
        toast.error(response.data.error || "Failed to add floor.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2>Add Floor</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Floor Number</label>
                  <input
                    type="number"
                    placeholder="Enter Floor Number"
                    className="form-control"
                    name="floor_number"
                    value={data.floor_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Rooms</label>
                  <input
                    type="number"
                    placeholder="Enter Total Rooms"
                    className="form-control"
                    name="total_rooms"
                    value={data.total_rooms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    placeholder="Enter Capacity"
                    className="form-control"
                    name="capacity"
                    value={data.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success me-2">
                    Submit
                  </button>
                  <Link
                    to="/admin-dashboard/floors"
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

export default AddFloor;
