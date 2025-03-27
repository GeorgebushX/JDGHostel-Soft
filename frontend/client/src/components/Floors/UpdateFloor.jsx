import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed

const UpdateFloor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [floorData, setFloorData] = useState({
    floor_number: "",
    total_rooms: "",
    capacity: "",
  });

  // Fetch floor data when component mounts
  useEffect(() => {
    const fetchFloor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/floor/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setFloorData({
            floor_number: response.data.data.floor_number, // Corrected key
            total_rooms: response.data.data.total_rooms,
            capacity: response.data.data.capacity,
          });
        } else {
          toast.error("Failed to fetch floor details");
        }
      } catch (error) {
        toast.error("Error fetching floor details: " + error.message);
      }
    };

    fetchFloor();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFloorData({ ...floorData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/floor/update/${id}`,
        floorData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Floor updated successfully!");
        navigate("/admin-dashboard/floors"); // Redirect after update
      } else {
        toast.error("Failed to update floor.");
      }
    } catch (error) {
      toast.error("Error updating floor: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2>Update Floor</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Floor Number</label>
                  <input
                    type="number"
                    name="floor_number"
                    placeholder="Enter Floor Number"
                    className="form-control"
                    value={floorData.floor_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Rooms</label>
                  <input
                    type="number"
                    name="total_rooms"
                    placeholder="Enter Total Rooms"
                    className="form-control"
                    value={floorData.total_rooms}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Enter Capacity"
                    className="form-control"
                    value={floorData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success me-2">
                    Update
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

export default UpdateFloor;
