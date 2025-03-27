// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import moment from "moment"; // Import moment.js for date formatting

// const ViewEmployeeSalary = () => {
//   const { id } = useParams();
//   const [salaryDetails, setSalaryDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchSalaryDetails = async () => {
//       if (!id) return;
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/salary/getone/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setSalaryDetails(response.data.data);
//         } else {
//           toast.error("Failed to fetch salary details");
//           setError("No salary details found.");
//         }
//       } catch (err) {
//         console.error("Error fetching salary details:", err);
//         toast.error("Error fetching salary details: " + err.message);
//         setError("Error fetching salary details.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSalaryDetails();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="text-center mt-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading salary details...</span>
//         </div>
//       </div>
//     );

//   if (error)
//     return <div className="alert alert-danger text-center mt-4">{error}</div>;

//   if (!salaryDetails)
//     return <p className="text-center mt-4">No salary details available.</p>;

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4 text-black text-center">Salary Details</h2>

//       <div className="card shadow p-4 text-center">
//         <div className="d-flex justify-content-center mb-3">
//           {salaryDetails.employeeId?.image ? (
//             <img
//               src={`http://localhost:5000${salaryDetails.employeeId.image}`}
//               alt={salaryDetails.employeeId.employeeid || "Employee Image"}
//               className="rounded-circle border"
//               style={{
//                 width: "200px",
//                 height: "200px",
//                 objectFit: "cover",
//                 border: "4px solid #007bff",
//               }}
//             />
//           ) : (
//             <div className="text-muted">No Image Available</div>
//           )}
//         </div>

//         <table className="table table-bordered text-start">
//           <tbody>
//             <tr>
//               <th>Employee ID</th>
//               <td>{salaryDetails.employeeId?.employeeid || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Employee Name</th>
//               <td>{salaryDetails.employeeId?.name || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Month</th>
//               <td>{salaryDetails.month || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Year</th>
//               <td>{salaryDetails.year || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Date</th>
//               <td>
//                 {salaryDetails.date
//                   ? moment(salaryDetails.date).format("DD/MM/YYYY")
//                   : "N/A"}
//               </td>
//             </tr>
//             <tr>
//               <th>Basic Salary</th>
//               <td>₹{salaryDetails.basicSalary || "0"}</td>
//             </tr>
//             <tr>
//               <th>Allowances</th>
//               <td>₹{salaryDetails.allowances || "0"}</td>
//             </tr>
//             <tr>
//               <th>Deductions</th>
//               <td>₹{salaryDetails.deductions || "0"}</td>
//             </tr>
//             <tr>
//               <th>Net Salary</th>
//               <td className="text-primary fw-bold">
//                 ₹{salaryDetails.netSalary || "0"}
//               </td>
//             </tr>
//             <tr>
//               <th>Status</th>
//               <td
//                 className={
//                   salaryDetails.status === "Paid"
//                     ? "text-success fw-bold"
//                     : "text-danger fw-bold"
//                 }
//               >
//                 {salaryDetails.status || "N/A"}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ViewEmployeeSalary;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment"; // Import moment.js for date formatting

const ViewEmployeeSalary = () => {
  const { id } = useParams();
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSalaryDetails = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/salary/getone/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          // Ensure response data is an array and take the first record
          const salaryData = Array.isArray(response.data.data)
            ? response.data.data[0] // Take the first object from array
            : response.data.data;

          if (!salaryData) {
            setError("No salary details found.");
          } else {
            setSalaryDetails(salaryData);
          }
        } else {
          toast.error("Failed to fetch salary details");
          setError("No salary details found.");
        }
      } catch (err) {
        console.error("Error fetching salary details:", err);
        toast.error("Error fetching salary details: " + err.message);
        setError("Error fetching salary details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryDetails();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading salary details...</span>
        </div>
      </div>
    );

  if (error)
    return <div className="alert alert-danger text-center mt-4">{error}</div>;

  if (!salaryDetails)
    return <p className="text-center mt-4">No salary details available.</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-black text-center">Salary Details</h2>

      <div className="card shadow p-4 text-center">
        <div className="d-flex justify-content-center mb-3">
          {salaryDetails.employeeId?.image ? (
            <img
              src={`http://localhost:5000${salaryDetails.employeeId.image}`}
              alt={salaryDetails.employeeId.employeeid || "Employee Image"}
              className="rounded-circle border"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                border: "4px solid #007bff",
              }}
            />
          ) : (
            <div className="text-muted">No Image Available</div>
          )}
        </div>

        <table className="table table-bordered text-start">
          <tbody>
            <tr>
              <th>Employee ID</th>
              <td>{salaryDetails.employeeId?.employeeid || "N/A"}</td>
            </tr>
            <tr>
              <th>Employee Name</th>
              <td>{salaryDetails.employeeId?.name || "N/A"}</td>
            </tr>
            <tr>
              <th>Month</th>
              <td>{salaryDetails.month || "N/A"}</td>
            </tr>
            <tr>
              <th>Year</th>
              <td>{salaryDetails.year || "N/A"}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>
                {salaryDetails.date
                  ? moment(salaryDetails.date).format("DD/MM/YYYY")
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <th>Basic Salary</th>
              <td>₹{salaryDetails.basicSalary || "0"}</td>
            </tr>
            <tr>
              <th>Allowances</th>
              <td>₹{salaryDetails.allowances || "0"}</td>
            </tr>
            <tr>
              <th>Deductions</th>
              <td>₹{salaryDetails.deductions || "0"}</td>
            </tr>
            <tr>
              <th>Net Salary</th>
              <td className="text-primary fw-bold">
                ₹{salaryDetails.netSalary || "0"}
              </td>
            </tr>
            <tr>
              <th>Status</th>
              <td
                className={
                  salaryDetails.status === "Paid"
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {salaryDetails.status || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewEmployeeSalary;
