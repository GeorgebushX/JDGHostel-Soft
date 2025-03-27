// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";

// const FeeList = () => {
//   const [fees, setFees] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const feesPerPage = 5;
//   const [userRole, setUserRole] = useState(
//     localStorage.getItem("userRole") || "employee"
//   );

//   useEffect(() => {
//     fetchFees();
//   }, []);

//   const fetchFees = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get("http://localhost:5000/api/fee/getall", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setFees(response.data.data);
//       } else {
//         toast.error("Failed to fetch student fees");
//       }
//     } catch (error) {
//       toast.error("Error fetching student fees: " + error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this record?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.delete(
//         `http://localhost:5000/api/fee/delete/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Student fee record deleted successfully");
//         setFees((prevFees) => prevFees.filter((fee) => fee._id !== id));
//       } else {
//         toast.error("Failed to delete student fee record");
//       }
//     } catch (error) {
//       toast.error("Error deleting student fee record: " + error.message);
//     }
//   };

//   const filteredFees = fees
//     .filter((fee) =>
//       fee.admission_id?.studentid
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     )
//     .filter((fee) =>
//       filterStatus === "All" ? true : fee.paymentStatus === filterStatus
//     );

//   const indexOfLastFee = currentPage * feesPerPage;
//   const indexOfFirstFee = indexOfLastFee - feesPerPage;
//   const currentFees = filteredFees.slice(indexOfFirstFee, indexOfLastFee);

//   return (
//     <div className="container py-3">
//       <div className="text-center mb-3">
//         <h3 className="fw-bold">Manage Student Fees</h3>
//       </div>

//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <input
//           type="text"
//           placeholder="Search by Student ID"
//           className="form-control me-2"
//           style={{ width: "25%" }}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         {userRole !== "employee" && (
//           <Link
//             to="/admin-dashboard/addfee"
//             className="btn btn-primary"
//             style={{ width: "25%" }}
//           >
//             Add Student Fee
//           </Link>
//         )}
//       </div>

//       <div className="d-flex gap-3 mb-4 justify-content-end">
//         {["Pending", "Paid", "All"].map((status) => (
//           <button
//             key={status}
//             className={`btn ${
//               filterStatus === status ? "btn-success" : "btn-primary"
//             }`}
//             onClick={() => setFilterStatus(status)}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//       <table className="table table-bordered table-striped">
//         <thead style={{ backgroundColor: "blue", color: "white" }}>
//           <tr>
//             <th>ID</th>
//             <th>RoomNo</th>
//             <th>Image</th>
//             <th>Hostel Fee</th>
//             <th>Paid</th>
//             <th>Due</th>
//             <th>Payment Date</th>
//             <th>Method</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentFees.length > 0 ? (
//             currentFees.map((fee) => (
//               <tr key={fee._id}>
//                 <td>{fee.admission_id?.studentid || "N/A"}</td>
//                 <td>{fee.admission_id?.room_number?.room_number || "N/A"}</td>
//                 <td>
//                   {fee.admission_id?.image ? (
//                     <img
//                       src={`http://localhost:5000${fee.admission_id.image}`}
//                       alt={fee.admission_id.studentid || "Student Image"}
//                       style={{
//                         width: "50px",
//                         height: "50px",
//                         borderRadius: "50%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>

//                 <td>₹{fee.HostelFee}</td>
//                 <td>₹{fee.amountPaid}</td>
//                 <td>₹{fee.dueAmount}</td>
//                 <td>{new Date(fee.paymentDate).toLocaleDateString()}</td>
//                 <td>{fee.paymentMethod || "N/A"}</td>
//                 <td>
//                   <span
//                     className={`btn btn-sm ${
//                       fee.paymentStatus === "Paid"
//                         ? "btn-success"
//                         : "btn-danger"
//                     }`}
//                   >
//                     {fee.paymentStatus || "N/A"}
//                   </span>
//                 </td>
//                 <td>
//                   {/* View button */}
//                   <Link
//                     to={
//                       userRole === "admin"
//                         ? `/admin-dashboard/viewfee/${fee._id}`
//                         : `/employee-dashboard/viewfee/${fee._id}`
//                     }
//                     className="btn btn-primary btn-sm me-2"
//                     title="View"
//                   >
//                     <BsEye />
//                   </Link>

//                   {/* Update & Delete buttons for Admin */}
//                   {userRole === "!employee" && (
//                     <>
//                       <Link
//                         to={`/admin-dashboard/updatefee/${fee._id}`}
//                         className="btn btn-warning btn-sm me-2"
//                         title="Update"
//                       >
//                         <BsPencilSquare />
//                       </Link>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDelete(fee._id)}
//                         title="Delete"
//                       >
//                         <BsTrash />
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="10" className="text-center">
//                 No student fee records found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <div className="d-flex justify-content-between mt-3">
//         <button
//           className="btn btn-secondary"
//           onClick={() => setCurrentPage(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {Math.ceil(filteredFees.length / feesPerPage)}
//         </span>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setCurrentPage(currentPage + 1)}
//           disabled={indexOfLastFee >= filteredFees.length}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FeeList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const feesPerPage = 5;
  const userRole = localStorage.getItem("userRole") || "employee";

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/fee/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFees(response.data.data);
      } else {
        toast.error("Failed to fetch student fees");
      }
    } catch (error) {
      toast.error("Error fetching student fees: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/fee/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Student fee record deleted successfully");
        setFees((prevFees) => prevFees.filter((fee) => fee._id !== id));
      } else {
        toast.error("Failed to delete student fee record");
      }
    } catch (error) {
      toast.error("Error deleting student fee record: " + error.message);
    }
  };

  const filteredFees = fees
    .filter((fee) =>
      fee.admission_id?.studentid
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((fee) =>
      filterStatus === "All" ? true : fee.paymentStatus === filterStatus
    );

  const indexOfLastFee = currentPage * feesPerPage;
  const indexOfFirstFee = indexOfLastFee - feesPerPage;
  const currentFees = filteredFees.slice(indexOfFirstFee, indexOfLastFee);

  return (
    <div className="container py-3">
      <div className="text-center mb-3">
        <h3 className="fw-bold">Manage Student Fees</h3>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by Student ID"
          className="form-control me-2"
          style={{ width: "25%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* {userRole === "admin" && ( */}
        <Link
          to="/admin-dashboard/addfee"
          className="btn btn-primary"
          style={{ width: "25%" }}
        >
          Add Student Fee
        </Link>
        {/* )} */}
      </div>

      <div className="d-flex gap-3 mb-4 justify-content-end">
        {["Pending", "Paid", "All"].map((status) => (
          <button
            key={status}
            className={`btn ${
              filterStatus === status ? "btn-success" : "btn-primary"
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <table className="table table-bordered table-striped">
        <thead style={{ backgroundColor: "blue", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>RoomNo</th>
            <th>Image</th>
            <th>Hostel Fee</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Payment Date</th>
            <th>Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentFees.length > 0 ? (
            currentFees.map((fee) => (
              <tr key={fee._id}>
                <td>{fee.admission_id?.studentid || "N/A"}</td>
                <td>{fee.admission_id?.room_number?.room_number || "N/A"}</td>
                <td>
                  {fee.admission_id?.image ? (
                    <img
                      src={`http://localhost:5000${fee.admission_id.image}`}
                      alt={fee.admission_id.studentid || "Student Image"}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>₹{fee.HostelFee}</td>
                <td>₹{fee.amountPaid}</td>
                <td>₹{fee.dueAmount}</td>
                <td>{new Date(fee.paymentDate).toLocaleDateString()}</td>
                <td>{fee.paymentMethod || "N/A"}</td>
                <td>
                  <span
                    className={`btn btn-sm ${
                      fee.paymentStatus === "Paid"
                        ? "btn-success"
                        : "btn-danger"
                    }`}
                  >
                    {fee.paymentStatus || "N/A"}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/${
                      userRole === "admin"
                        ? "admin-dashboard"
                        : "employee-dashboard"
                    }/viewfee/${fee._id}`}
                    className="btn btn-primary btn-sm me-2"
                    title="View"
                  >
                    <BsEye />
                  </Link>
                  {/* {userRole === "admin" && ( */}
                  <>
                    <Link
                      to={`/admin-dashboard/updatefee/${fee._id}`}
                      className="btn btn-warning btn-sm me-2"
                      title="Update"
                    >
                      <BsPencilSquare />
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(fee._id)}
                      title="Delete"
                    >
                      <BsTrash />
                    </button>
                  </>
                  {/* )} */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                No student fee records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FeeList;
