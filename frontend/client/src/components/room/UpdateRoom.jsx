import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Get the user's role from localStorage
  const userRole = localStorage.getItem("role");

  const [roomData, setRoomData] = useState({
    room_number: "",
    floor_id: "",
    capacity: "",
    student: "",
    employee: "",
  });

  const [floors, setFloors] = useState([]);
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/room/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setRoomData({
            room_number: response.data.data.room_number,
            floor_id: response.data.data.floor_id?._id || "",
            capacity: response.data.data.capacity,
            student: response.data.data.studentid || "",
            employee: response.data.data.employeeid || "",
          });
        } else {
          toast.error("Failed to fetch room details");
        }
      } catch (error) {
        toast.error("Error fetching room details: " + error.message);
      }
    };

    fetchRoom();
  }, [id]);

  // Fetch floors, students, and employees
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
        if (response.data.success) setFloors(response.data.data);
      } catch (error) {
        toast.error("Error fetching floors: " + error.message);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/student/getall",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) setStudents(response.data.data);
      } catch (error) {
        toast.error("Error fetching students: " + error.message);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employee/getall",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) setEmployees(response.data.data);
      } catch (error) {
        toast.error("Error fetching employees: " + error.message);
      }
    };

    fetchFloors();
    fetchStudents();
    fetchEmployees();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch current room data to check occupancy
      const response = await axios.get(
        `http://localhost:5000/api/room/get/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.data.success) {
        toast.error("Failed to validate room capacity.");
        return;
      }

      const currentRoom = response.data.data;
      const totalOccupants =
        (currentRoom.studentid ? 1 : 0) + (currentRoom.employeeid ? 1 : 0);

      if (totalOccupants >= roomData.capacity) {
        toast.error("Room capacity reached. Cannot assign more occupants.");
        return;
      }

      // Proceed with update
      const updateResponse = await axios.put(
        `http://localhost:5000/api/room/put/${id}`,
        roomData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (updateResponse.data.success) {
        toast.success("Room updated successfully!");
        navigate(
          userRole === "admin"
            ? "/admin-dashboard/rooms"
            : "/employee-dashboard/rooms"
        );
      } else {
        toast.error("Failed to update room.");
      }
    } catch (error) {
      toast.error("Error updating room: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2>Update Room</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    name="room_number"
                    placeholder="Enter Room Number"
                    className="form-control"
                    value={roomData.room_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Select Floor</label>
                  <select
                    className="form-control"
                    name="floor_id"
                    value={roomData.floor_id}
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
                    name="capacity"
                    placeholder="Enter Capacity"
                    className="form-control"
                    value={roomData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-success me-2">
                    Update
                  </button>
                  <Link
                    to={
                      userRole === "admin"
                        ? "/admin-dashboard/rooms"
                        : "/employee-dashboard/rooms"
                    }
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

export default UpdateRoom;
