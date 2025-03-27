import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddRoom = () => {
  const navigate = useNavigate();
  const [floors, setFloors] = useState([]); // Fetch available floors
  const [data, setData] = useState({
    room_number: "",
    floor_id: "",
    capacity: "",
  });

  // Fetch floors when the component loads
  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/floor/getall",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setFloors(response.data.data);
        } else {
          toast.error("Failed to fetch floors.");
        }
      } catch (error) {
        toast.error("Error fetching floors: " + error.message);
      }
    };

    fetchFloors();
  }, []);

  // Handle input change
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
        "http://localhost:5000/api/room/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Room added successfully!");
        navigate("/admin-dashboard/rooms");
      } else {
        toast.error(response.data.message || "Failed to add room.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2>Add Room</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Room Number</label>
                  <input
                    type="number"
                    placeholder="Enter Room Number"
                    className="form-control"
                    name="room_number"
                    value={data.room_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Floor</label>
                  <select
                    className="form-control"
                    name="floor_id"
                    value={data.floor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Floor --</option>
                    {floors.map((floor) => (
                      <option key={floor._id} value={floor._id}>
                        Floor {floor.floor_number}
                      </option>
                    ))}
                  </select>
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
                    to="/admin-dashboard/rooms"
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

export default AddRoom;
