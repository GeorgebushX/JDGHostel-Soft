// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";

// const StudentList = () => {
//   const [students, setStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All"); // ✅ Added status filter state
//   const [currentPage, setCurrentPage] = useState(1);
//   const studentsPerPage = 5;

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/student/getall",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setStudents(response.data.data);
//         } else {
//           toast.error("Failed to fetch students");
//         }
//       } catch (error) {
//         toast.error("Error fetching students: " + error.message);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this student?"))
//       return;

//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/student/delete/${id}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Student deleted successfully");
//         setStudents(students.filter((student) => student._id !== id));
//       } else {
//         toast.error("Failed to delete student");
//       }
//     } catch (error) {
//       toast.error("Error deleting student: " + error.message);
//     }
//   };

//   // ✅ Filter students based on search term and selected status
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch = student.name
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filterStatus === "All" || student.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   // ✅ Pagination logic
//   const indexOfLastStudent = currentPage * studentsPerPage;
//   const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
//   const currentStudents = filteredStudents.slice(
//     indexOfFirstStudent,
//     indexOfLastStudent
//   );
//   const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="container py-4">
//       {/* 🏫 Page Title */}
//       <div className="text-center mb-4">
//         <h3 className="fw-bold">Manage Students</h3>
//       </div>

//       {/* 🔍 Search Bar and Filter Buttons */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search by Student Name"
//           className="form-control w-25"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className="d-flex gap-3">
//           <button
//             className={`btn ${
//               filterStatus === "Pending" ? "btn-warning" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("Pending")}
//           >
//             Pending
//           </button>
//           <button
//             className={`btn ${
//               filterStatus === "Approved" ? "btn-success" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("Approved")}
//           >
//             Approved
//           </button>
//           <button
//             className={`btn ${
//               filterStatus === "Rejected" ? "btn-danger" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("Rejected")}
//           >
//             Rejected
//           </button>
//           <button
//             className={`btn ${
//               filterStatus === "All" ? "btn-secondary" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("All")}
//           >
//             All
//           </button>
//         </div>
//       </div>

//       {/* 📋 Student Table */}
//       <div>
//         <table className="table table-bordered table-striped">
//           <thead style={{ backgroundColor: "blue", color: "white" }}>
//             <tr>
//               <th>Name</th>
//               <th>Image</th>
//               <th>Email</th>
//               <th>Phone Number</th>
//               <th>Gender</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentStudents.length > 0 ? (
//               currentStudents.map((student) => (
//                 <tr key={student._id}>
//                   <td>{student.name || "N/A"}</td>
//                   <td>
//                     {student.image ? (
//                       <img
//                         src={`http://localhost:5000${student.image}`}
//                         alt={student.name || "Student Image"}
//                         style={{
//                           width: "50px",
//                           height: "50px",
//                           borderRadius: "50%",
//                           objectFit: "cover",
//                         }}
//                       />
//                     ) : (
//                       <span>No Image</span>
//                     )}
//                   </td>
//                   <td>{student.email || "N/A"}</td>
//                   <td>{student.phonenumber || "N/A"}</td>
//                   <td>{student.gender || "N/A"}</td>
//                   <td>{student.status || "N/A"}</td>
//                   <td>
//                     <Link
//                       to={`/admin-dashboard/view-student/${student._id}`}
//                       className="btn btn-primary btn-sm me-2"
//                     >
//                       View
//                     </Link>

//                     <Link
//                       to={`/admin-dashboard/update-student/${student._id}`}
//                       className="btn btn-warning btn-sm me-2"
//                     >
//                       Update
//                     </Link>

//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => handleDelete(student._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No students found
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
//           Page {currentPage} of {totalPages || 1}
//         </span>
//         <button
//           className="btn btn-secondary"
//           onClick={nextPage}
//           disabled={currentPage >= totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StudentList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const { user } = useAuth(); // Get user role from context

  useEffect(() => {
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

        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          toast.error("Failed to fetch students");
        }
      } catch (error) {
        toast.error("Error fetching students: " + error.message);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/student/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Student deleted successfully");
        setStudents(students.filter((student) => student._id !== id));
      } else {
        toast.error("Failed to delete student");
      }
    } catch (error) {
      toast.error("Error deleting student: " + error.message);
    }
  };

  // Filter students based on search term and selected status
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container py-4">
      {/* Page Title */}
      <div className="text-center mb-4">
        <h3 className="fw-bold">Manage Students</h3>
      </div>

      {/* Search Bar and Filter Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search by Student Name"
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="d-flex gap-3">
          <button
            className={`btn ${
              filterStatus === "Pending" ? "btn-warning" : "btn-primary"
            }`}
            onClick={() => setFilterStatus("Pending")}
          >
            Pending
          </button>
          <button
            className={`btn ${
              filterStatus === "Approved" ? "btn-success" : "btn-primary"
            }`}
            onClick={() => setFilterStatus("Approved")}
          >
            Approved
          </button>
          <button
            className={`btn ${
              filterStatus === "Rejected" ? "btn-danger" : "btn-primary"
            }`}
            onClick={() => setFilterStatus("Rejected")}
          >
            Rejected
          </button>
          <button
            className={`btn ${
              filterStatus === "All" ? "btn-secondary" : "btn-primary"
            }`}
            onClick={() => setFilterStatus("All")}
          >
            All
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div>
        <table className="table table-bordered table-striped">
          <thead style={{ backgroundColor: "blue", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              {/* <th>Room</th> */}
              <th>Image</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentid || "N/A"}</td>
                  <td>{student.name || "N/A"}</td>
                  {/* <td>{student.room_number?.room_number || "N/A"}</td> */}
                  <td>
                    {student.image ? (
                      <img
                        src={
                          student.image.startsWith("http")
                            ? student.image
                            : `http://localhost:5000${student.image}`
                        }
                        alt={student.name || "Student Image"}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{student.email || "N/A"}</td>
                  <td>{student.phonenumber || "N/A"}</td>
                  <td>{student.gender || "N/A"}</td>
                  <td>{student.status || "N/A"}</td>
                  <td>
                    {/* Role-based navigation */}
                    <Link
                      to={`/${user?.role}-dashboard/view-student/${student._id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      <FaEye />
                    </Link>

                    {/* Hide Update & Delete buttons for employees */}
                    {user?.role !== "employee" && (
                      <>
                        <Link
                          to={`/${user?.role}-dashboard/update-student/${student._id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          <FaEdit />
                        </Link>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(student._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentList;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/authContext";
// import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";

// const StudentList = () => {
//   const [students, setStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const studentsPerPage = 5;
//   const { user } = useAuth(); // Get user role from context

//   // const { user } = useAuth();
//   // {user.role ==="employee" &&  ### Display perticulat part <Link/> ###}

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/student/getall",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setStudents(response.data.data);
//         } else {
//           toast.error("Failed to fetch students");
//         }
//       } catch (error) {
//         toast.error("Error fetching students: " + error.message);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this student?"))
//       return;

//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/student/delete/${id}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Student deleted successfully");
//         setStudents(students.filter((student) => student._id !== id));
//       } else {
//         toast.error("Failed to delete student");
//       }
//     } catch (error) {
//       toast.error("Error deleting student: " + error.message);
//     }
//   };

//   // Filter students based on search term and selected status
//   const filteredStudents = students.filter((student) => {
//     const matchesSearch = student.name
//       ?.toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       filterStatus === "All" || student.status === filterStatus;
//     return matchesSearch && matchesStatus;
//   });

//   // Pagination logic
//   const indexOfLastStudent = currentPage * studentsPerPage;
//   const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
//   const currentStudents = filteredStudents.slice(
//     indexOfFirstStudent,
//     indexOfLastStudent
//   );
//   const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   return (
//     <div className="container py-4">
//       {/* Page Title */}
//       <div className="text-center mb-4">
//         <h3 className="fw-bold">Manage Students</h3>
//       </div>

//       {/* Search Bar and Filter Buttons */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <input
//           type="text"
//           placeholder="Search by Student Name"
//           className="form-control w-25"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className="d-flex gap-3">
//           <button
//             className={`btn ${
//               filterStatus === "Pending" ? "btn-warning" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("Pending")}
//           >
//             Pending
//           </button>
//           <button
//             className={`btn ${
//               filterStatus === "Approved" ? "btn-success" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("Approved")}
//           >
//             Approved
//           </button>
//           <button
//             className={`btn ${
//               filterStatus === "Rejected" ? "btn-danger" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("Rejected")}
//           >
//             Rejected
//           </button>
//           <button
//             className={`btn ${
//               filterStatus === "All" ? "btn-secondary" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus("All")}
//           >
//             All
//           </button>
//         </div>
//       </div>

//       {/* Student Table */}
//       <div>
//         <table className="table table-bordered table-striped">
//           <thead style={{ backgroundColor: "blue", color: "white" }}>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Room</th>
//               <th>Image</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Gender</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentStudents.length > 0 ? (
//               currentStudents.map((student) => (
//                 <tr key={student._id}>
//                   <td>{student.studentid || "N/A"}</td>

//                   <td>{student.name || "N/A"}</td>
//                   <td>{student.room_number.room_number || "N/A"}</td>
//                   <td>
//                     {student.image ? (
//                       <img
//                         src={`http://localhost:5000${student.image}`}
//                         alt={student.name || "Student Image"}
//                         style={{
//                           width: "50px",
//                           height: "50px",
//                           borderRadius: "50%",
//                           objectFit: "cover",
//                         }}
//                       />
//                     ) : (
//                       <span>No Image</span>
//                     )}
//                   </td>
//                   <td>{student.email || "N/A"}</td>
//                   <td>{student.phonenumber || "N/A"}</td>
//                   <td>{student.gender || "N/A"}</td>
//                   <td>{student.status || "N/A"}</td>
//                   <td>
//                     {/* Role-based navigation */}
//                     <Link
//                       to={`/${user?.role}-dashboard/view-student/${student._id}`}
//                       className="btn btn-primary btn-sm me-2"
//                     >
//                       <FaEye />
//                     </Link>

//                     {/* Hide Update & Delete buttons for employees */}
//                     {user?.role !== "employee" && (
//                       <>
//                         <Link
//                           to={`/${user?.role}-dashboard/update-student/${student._id}`}
//                           className="btn btn-warning btn-sm me-2"
//                         >
//                           <FaEdit />
//                         </Link>

//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => handleDelete(student._id)}
//                         >
//                           <FaTrash />
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center">
//                   No students found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="d-flex justify-content-between mt-3">
//         <button
//           className="btn btn-secondary"
//           onClick={prevPage}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages || 1}
//         </span>
//         <button
//           className="btn btn-secondary"
//           onClick={nextPage}
//           disabled={currentPage >= totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StudentList;
