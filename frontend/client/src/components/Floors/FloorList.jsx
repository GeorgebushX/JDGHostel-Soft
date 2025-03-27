// // FloorList.js
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";

// const FloorList = () => {
//   const [floors, setFloors] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     const fetchFloors = async () => {
//       try {
//         const resFloors = await axios.get("http://localhost:5000/api/floor/getall", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         if (resFloors.data.success) setFloors(resFloors.data.data);
//       } catch (error) {
//         toast.error("Error fetching floors.");
//       }
//     };

//     const fetchEmployees = async () => {
//       try {
//         const resEmployees = await axios.get("http://localhost:5000/api/employee/getall", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         if (resEmployees.data.success) setEmployees(resEmployees.data.data);
//       } catch (error) {
//         toast.error("Error fetching employees.");
//       }
//     };

//     fetchFloors();
//     fetchEmployees();
//   }, []);

//   return (
//     <div className="container py-3">
//       <h3 className="fw-bold text-center mb-3">Manage Floors</h3>
//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>Floor Number</th>
//             <th>Total Rooms</th>
//             <th>Capacity</th>
//             <th>In-Charge</th>
//           </tr>
//         </thead>
//         <tbody>
//           {floors.map((floor) => (
//             <tr key={floor._id}>
//               <td>{floor.floor_number}</td>
//               <td>{floor.total_rooms}</td>
//               <td>{floor.capacity}</td>
//               <td>
//                 {employees.find((emp) => emp._id === floor.incharge)?.name || "Not Assigned"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default FloorList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const FloorList = () => {
  const [floors, setFloors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search filter
  const [currentPage, setCurrentPage] = useState(1);
  const floorsPerPage = 5; // Pagination

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this floor?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/floor/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Floor deleted successfully");
        setFloors(floors.filter((floor) => floor._id !== id));
      } else {
        toast.error("Failed to delete floor");
      }
    } catch (error) {
      toast.error("Error deleting floor: " + error.message);
    }
  };

  const filteredFloors = floors.filter((floor) =>
    floor.floor_number.toString().includes(searchTerm)
  );

  const indexOfLastFloor = currentPage * floorsPerPage;
  const indexOfFirstFloor = indexOfLastFloor - floorsPerPage;
  const currentFloors = filteredFloors.slice(
    indexOfFirstFloor,
    indexOfLastFloor
  );

  return (
    <div className="container py-3">
      <h3 className="fw-bold text-center mb-3">Manage Floors</h3>

      {/* Search and Add Button */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search By Floor Number"
          className="form-control"
          style={{ width: "25%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to="/admin-dashboard/add-floor"
          className="btn btn-primary"
          style={{ width: "25%" }}
        >
          Add New Floor
        </Link>
      </div>

      {/* Floor Table */}
      <table className="table table-bordered table-striped">
        <thead className="bg-primary text-white">
          <tr>
            <th>Floor Number</th>
            <th>Total Rooms</th>
            <th>Capacity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentFloors.length > 0 ? (
            currentFloors.map((floor) => (
              <tr key={floor._id}>
                <td>{floor.floor_number}</td>
                <td>{floor.total_rooms}</td>
                <td>{floor.capacity}</td>
                <td>
                  <Link
                    to={`/admin-dashboard/update-floor/${floor._id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Update
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(floor._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No floors found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredFloors.length / floorsPerPage)}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={
            currentPage >= Math.ceil(filteredFloors.length / floorsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FloorList;
