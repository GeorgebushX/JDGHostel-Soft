// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";

// const RoomList = () => {
//   const [rooms, setRooms] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // For filtering rooms
//   const [currentPage, setCurrentPage] = useState(1);
//   const roomsPerPage = 5; // Number of rooms per page

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/room/getall",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setRooms(response.data.data);
//         } else {
//           toast.error("Failed to fetch rooms");
//         }
//       } catch (error) {
//         toast.error("Error fetching rooms: " + error.message);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/room/delete/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Room deleted successfully");
//         setRooms(rooms.filter((room) => room._id !== id));
//       } else {
//         toast.error("Failed to delete room");
//       }
//     } catch (error) {
//       toast.error("Error deleting room: " + error.message);
//     }
//   };

//   // **🔍 Filtering Rooms by Room Number**
//   const filteredRooms = rooms.filter((room) =>
//     room.room_number.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // **📄 Pagination Logic**
//   const indexOfLastRoom = currentPage * roomsPerPage;
//   const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
//   const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

//   // **📌 Handle Page Change**
//   const nextPage = () => {
//     if (currentPage < Math.ceil(filteredRooms.length / roomsPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="container py-3">
//       <div className="text-center mb-3">
//         <h3 className="fw-bold">Manage Rooms</h3>
//       </div>

//       {/* 🔍 Search Input */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <input
//           type="text"
//           placeholder="Search By Room Number"
//           className="form-control me-2"
//           style={{ width: "25%" }}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Link
//           to="/admin-dashboard/add-room"
//           className="btn btn-primary"
//           style={{ width: "25%" }}
//         >
//           Add New Room
//         </Link>
//       </div>

//       {/* 🏢 Room Table */}
//       <div>
//         <table className="table table-bordered table-striped">
//           <thead style={{ backgroundColor: "blue", color: "white" }}>
//             <tr>
//               <th>Room Number</th>
//               <th>Floor Number</th>
//               <th>Capacity</th>
//               <th>Occupancy</th>
//               <th>Availability</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRooms.length > 0 ? (
//               currentRooms.map((room) => (
//                 <tr key={room._id}>
//                   <td>{room.room_number}</td>
//                   <td>{room.floor_id?.floor_number || "N/A"}</td>
//                   <td>{room.capacity}</td>
//                   <td>{room.occupancy}</td>
//                   <td>
//                     {room.is_available ? (
//                       <span className="badge bg-success">Available</span>
//                     ) : (
//                       <span className="badge bg-danger">Full</span>
//                     )}
//                   </td>
//                   <td>
//                     <Link
//                       to={`/admin-dashboard/update-room/${room._id}`}
//                       className="btn btn-warning btn-sm me-2"
//                     >
//                       Update
//                     </Link>
//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => handleDelete(room._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center">
//                   No rooms found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 📄 Pagination Controls */}
//       <div className="d-flex justify-content-between mt-3">
//         <button
//           className="btn btn-secondary"
//           onClick={prevPage}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {Math.ceil(filteredRooms.length / roomsPerPage)}
//         </span>
//         <button
//           className="btn btn-secondary"
//           onClick={nextPage}
//           disabled={
//             currentPage >= Math.ceil(filteredRooms.length / roomsPerPage)
//           }
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RoomList;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For filtering rooms
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5; // Number of rooms per page

  // Get the user's role from localStorage
  const userRole = localStorage.getItem("role"); // Assuming the role is stored as 'admin' or 'employee'

  useEffect(() => {
    fetchRooms();
  }, []);

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
        toast.error("Failed to fetch rooms");
      }
    } catch (error) {
      toast.error("Error fetching rooms: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/room/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Room deleted successfully");
        setRooms(rooms.filter((room) => room._id !== id));
      } else {
        toast.error("Failed to delete room");
      }
    } catch (error) {
      toast.error("Error deleting room: " + error.message);
    }
  };

  // **🔍 Filtering Rooms by Room Number**
  const filteredRooms = rooms.filter((room) =>
    room.room_number
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // **📄 Pagination Logic**
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // **📌 Handle Page Change**
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredRooms.length / roomsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container py-3">
      <div className="text-center mb-3">
        <h3 className="fw-bold">Manage Rooms</h3>
      </div>

      {/* 🔍 Search Input and Add Room Button (Only for Admins) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search By Room Number"
          className="form-control me-2"
          style={{ width: "25%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Show "Add New Room" button only for admins */}
        {userRole === "admin" && (
          <Link
            to="/admin-dashboard/add-room"
            className="btn btn-primary"
            style={{ width: "25%" }}
          >
            Add New Room
          </Link>
        )}
      </div>

      {/* 🏢 Room Table */}
      <div>
        <table className="table table-bordered table-striped">
          <thead style={{ backgroundColor: "blue", color: "white" }}>
            <tr>
              <th>Room Number</th>
              <th>Floor Number</th>
              <th>Capacity</th>
              <th>Occupancy</th>
              <th>Status</th>
              <th>Employees</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.room_number || "N/A"}</td>
                  <td>{room.floor_id?.floor_number || "N/A"}</td>
                  <td>{room.capacity || 0}</td>
                  <td>
                    {room.occupancy || 0} / {room.capacity}
                  </td>

                  {/* Status - Green if available, Red if full */}
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: room.is_available ? "green" : "red",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      {room.is_available ? "Available" : "Full"}
                    </span>
                  </td>

                  {/* Assigned Employees */}
                  <td>
                    {room.employees && room.employees.length > 0 ? (
                      room.employees.map((emp) => (
                        <div key={emp.id}>{emp.name}</div>
                      ))
                    ) : (
                      <span>No Employees</span>
                    )}
                  </td>

                  {/* Assigned Students */}
                  <td>
                    {room.students && room.students.length > 0 ? (
                      room.students.map((student) => (
                        <div key={student.id}>{student.name}</div>
                      ))
                    ) : (
                      <span>No Students</span>
                    )}
                  </td>

                  <td>
                    <Link
                      to={
                        userRole === "admin"
                          ? `/admin-dashboard/update-room/${room._id}`
                          : `/employee-dashboard/update-room/${room._id}`
                      }
                      className="btn btn-warning btn-sm me-2"
                      disabled={!room.is_available}
                    >
                      Update
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(room._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredRooms.length / roomsPerPage)}
        </span>
        <button
          className="btn btn-secondary"
          onClick={nextPage}
          disabled={
            currentPage >= Math.ceil(filteredRooms.length / roomsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoomList;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";

// const RoomList = () => {
//   const [rooms, setRooms] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // For filtering rooms
//   const [currentPage, setCurrentPage] = useState(1);
//   const roomsPerPage = 5; // Number of rooms per page

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   // const fetchRooms = async () => {
//   //   try {
//   //     const response = await axios.get(
//   //       "http://localhost:5000/api/room/getall",
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //         },
//   //       }
//   //     );

//   //     if (response.data.success) {
//   //       const updatedRooms = response.data.data.map((room) => {
//   //         const assignedPersons = [];

//   //         if (room.student_id && room.student_id.name) {
//   //           assignedPersons.push(room.student_id.name);
//   //         }
//   //         if (room.employee_id && room.employee_id.name) {
//   //           assignedPersons.push(room.employee_id.name);
//   //         }

//   //         return {
//   //           ...room,
//   //           occupancy: assignedPersons.length,
//   //           is_available: assignedPersons.length < (room.capacity || 0),
//   //           assignedPersons, // ✅ Now always an array with valid names
//   //         };
//   //       });

//   //       setRooms(updatedRooms);
//   //     } else {
//   //       toast.error("Failed to fetch rooms");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Error fetching rooms: " + error.message);
//   //   }
//   // };
//   const fetchRooms = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/room/getall",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         const updatedRooms = response.data.data.map((room) => {
//           const assignedPersons = [];

//           // Ensure students and employees are displayed correctly
//           if (room.student_id && Array.isArray(room.student_id)) {
//             assignedPersons.push(
//               ...room.student_id.map((student) => student.name)
//             );
//           }
//           if (room.employee_id && Array.isArray(room.employee_id)) {
//             assignedPersons.push(...room.employee_id.map((emp) => emp.name));
//           }

//           return {
//             ...room,
//             occupancy: assignedPersons.length,
//             is_available: assignedPersons.length < (room.capacity || 0),
//             assignedPersons, // ✅ Now correctly displaying assigned people
//           };
//         });

//         setRooms(updatedRooms);
//       } else {
//         toast.error("Failed to fetch rooms");
//       }
//     } catch (error) {
//       toast.error("Error fetching rooms: " + error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/room/delete/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Room deleted successfully");
//         setRooms(rooms.filter((room) => room._id !== id));
//       } else {
//         toast.error("Failed to delete room");
//       }
//     } catch (error) {
//       toast.error("Error deleting room: " + error.message);
//     }
//   };

//   // **🔍 Filtering Rooms by Room Number**
//   const filteredRooms = rooms.filter((room) =>
//     room.room_number
//       ?.toString()
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   // **📄 Pagination Logic**
//   const indexOfLastRoom = currentPage * roomsPerPage;
//   const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
//   const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

//   // **📌 Handle Page Change**
//   const nextPage = () => {
//     if (currentPage < Math.ceil(filteredRooms.length / roomsPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="container py-3">
//       <div className="text-center mb-3">
//         <h3 className="fw-bold">Manage Rooms</h3>
//       </div>

//       {/* 🔍 Search Input */}
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <input
//           type="text"
//           placeholder="Search By Room Number"
//           className="form-control me-2"
//           style={{ width: "25%" }}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <Link
//           to="/admin-dashboard/add-room"
//           className="btn btn-primary"
//           style={{ width: "25%" }}
//         >
//           Add New Room
//         </Link>
//       </div>

//       {/* 🏢 Room Table */}
//       <div>
//         <table className="table table-bordered table-striped">
//           <thead style={{ backgroundColor: "blue", color: "white" }}>
//             <tr>
//               <th>Room Number</th>
//               <th>Floor Number</th>
//               <th>Capacity</th>

//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentRooms.length > 0 ? (
//               currentRooms.map((room) => (
//                 <tr key={room._id}>
//                   <td>{room.room_number || "N/A"}</td>
//                   <td>{room.floor_id?.floor_number || "N/A"}</td>
//                   <td>{room.capacity || 0}</td>

//                   <td>
//                     <Link
//                       to={`/admin-dashboard/update-room/${room._id}`}
//                       className="btn btn-warning btn-sm me-2"
//                     >
//                       Update
//                     </Link>
//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => handleDelete(room._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center">
//                   No rooms found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 📄 Pagination Controls */}
//       <div className="d-flex justify-content-between mt-3">
//         <button
//           className="btn btn-secondary"
//           onClick={prevPage}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {Math.ceil(filteredRooms.length / roomsPerPage)}
//         </span>
//         <button
//           className="btn btn-secondary"
//           onClick={nextPage}
//           disabled={
//             currentPage >= Math.ceil(filteredRooms.length / roomsPerPage)
//           }
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RoomList;
