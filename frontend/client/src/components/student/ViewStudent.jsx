// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/authContext";

// const ViewStudent = () => {
//   const { id } = useParams();
//   const [admission, setAdmission] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { user } = useAuth(); // Corrected useAuth()

//   useEffect(() => {
//     const fetchAdmission = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/student/get/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           setAdmission(response.data.data);
//         } else {
//           toast.error("Failed to fetch admission details");
//         }
//       } catch (err) {
//         toast.error("Error fetching admission: " + err.message);
//         setError("Error fetching admission data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdmission();
//   }, [id]);

//   const changeStatus = async (id, status) => {
//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/student/getone/${id}`,
//         { status },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         navigate("/admin-dashboard/students");
//       } else {
//         toast.error("Failed to update admission status");
//       }
//     } catch (err) {
//       toast.error("Error updating admission: " + err.message);
//       setError("Error updating admission data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <div className="spinner-border text-primary" role="status"></div>
//       </div>
//     );

//   if (error) return <p className="text-danger text-center mt-5">{error}</p>;

//   if (!admission)
//     return (
//       <p className="text-secondary text-center mt-5">
//         No admission data found.
//       </p>
//     );

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-8">
//           <div
//             className="card shadow-lg border-0 rounded-lg p-4"
//             style={{ backgroundColor: "#f8f9fa" }}
//           >
//             {admission.image && (
//               <div className="text-center mb-3">
//                 <div className="border p-2 rounded-circle bg-white d-inline-block shadow">
//                   <img
//                     src={`http://localhost:5000${admission.image}`}
//                     alt="Admission"
//                     className="rounded-circle"
//                     style={{
//                       width: "250px",
//                       height: "250px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//             <div className="p-3">
//               <div className="border rounded p-3 mb-3 bg-white shadow-sm">
//                 <h5 className="text-primary text-center mb-3">
//                   Student Detail
//                 </h5>
//                 <p className="fw-bold">
//                   Student_id:{" "}
//                   <span className="text-dark">{admission.studentid}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Name: <span className="text-dark">{admission.name}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Email: <span className="text-dark">{admission.email}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Phone:{" "}
//                   <span className="text-dark">{admission.phonenumber}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Date of Birth:{" "}
//                   <span className="text-dark">
//                     {new Date(admission.dob).toLocaleDateString()}
//                   </span>
//                 </p>
//                 <p className="fw-bold">
//                   Gender: <span className="text-dark">{admission.gender}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Address:{" "}
//                   <span className="text-dark">{admission.address}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Nationality:{" "}
//                   <span className="text-dark">{admission.nationality}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Aadhaar Number:{" "}
//                   <span className="text-dark">{admission.aadhaarNumber}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Course: <span className="text-dark">{admission.course}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Guardian Number:{" "}
//                   <span className="text-dark">{admission.guardianNumber}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Role: <span className="text-dark">{admission.role}</span>
//                 </p>
//                 <p className="fw-bold">
//                   Admission Fee Paid:{" "}
//                   <span className="text-dark">
//                     {admission.admissionFeePaid ? "Yes" : "No"}
//                   </span>
//                 </p>
//                 <p className="fw-bold">
//                   Room Number:{" "}
//                   <span className="text-dark">
//                     {admission.room_number
//                       ? admission.room_number.room_number
//                       : "N/A"}
//                   </span>
//                 </p>

//                 {/* Status Logic Based on Role */}
//                 <p className="fw-bold d-flex gap-3">
//                   <span className="text-dark">
//                     {admission.status === "Pending" && user.role === "admin"
//                       ? "Action"
//                       : "Status :"}
//                   </span>

//                   {user.role === "admin" && admission.status === "Pending" ? (
//                     <div className="d-flex gap-2">
//                       <button
//                         className="btn btn-primary"
//                         onMouseOver={(e) =>
//                           e.target.classList.add("btn-success")
//                         }
//                         onClick={() => changeStatus(admission._id, "Approved")}
//                         onMouseOut={(e) =>
//                           e.target.classList.remove("btn-success")
//                         }
//                       >
//                         Approved
//                       </button>
//                       <button
//                         className="btn btn-primary"
//                         onMouseOver={(e) =>
//                           e.target.classList.add("btn-danger")
//                         }
//                         onMouseOut={(e) =>
//                           e.target.classList.remove("btn-danger")
//                         }
//                         onClick={() => changeStatus(admission._id, "Rejected")}
//                       >
//                         Rejected
//                       </button>
//                     </div>
//                   ) : (
//                     <span className="text-dark d-flex gap-3">
//                       {admission.status}
//                     </span>
//                   )}
//                 </p>
//               </div>

//               {admission.id_proof ? (
//                 <div className="text-center mt-3">
//                   <a
//                     href={`http://localhost:5000${admission.id_proof}`}
//                     rel="noopener noreferrer"
//                     className="btn btn-info text-white shadow-sm px-4 py-2"
//                   >
//                     View ID Proof
//                   </a>
//                 </div>
//               ) : (
//                 <p className="text-danger text-center fw-bold">
//                   ID Proof: Not Available
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewStudent;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewStudent = () => {
  const { id } = useParams();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdmission = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/student/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setAdmission(response.data.data);
        } else {
          toast.error("Failed to fetch admission details");
        }
      } catch (err) {
        toast.error("Error fetching admission: " + err.message);
        setError("Error fetching admission data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmission();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/student/getone/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/students");
      } else {
        toast.error("Failed to update admission status");
      }
    } catch (err) {
      toast.error("Error updating admission: " + err.message);
      setError("Error updating admission data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  if (!admission)
    return (
      <p className="text-secondary text-center mt-5">
        No admission data found.
      </p>
    );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card shadow-lg border-0 rounded-lg p-4 bg-light">
            {admission.image && (
              <div className="text-center mb-3">
                <div className="border p-2 rounded-circle bg-white d-inline-block shadow">
                  <img
                    src={`http://localhost:5000${admission.image}`}
                    alt="Admission"
                    className="rounded-circle"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="text-center">
              <h4 className="fw-bold text-dark">{admission.name}</h4>
            </div>

            <div className="card-body">
              <div className="border rounded p-3 bg-white shadow-sm">
                <h5 className="text-primary text-center mb-3">
                  Student Information
                </h5>
                <p>
                  <strong>Student ID:</strong>{" "}
                  <span className="text-dark">{admission.studentid}</span>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <span className="text-dark">{admission.email}</span>
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <span className="text-dark">{admission.phonenumber}</span>
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  <span className="text-dark">
                    {new Date(admission.dob).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <strong>Gender:</strong>{" "}
                  <span className="text-dark">{admission.gender}</span>
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  <span className="text-dark">{admission.address}</span>
                </p>
                <p>
                  <strong>Nationality:</strong>{" "}
                  <span className="text-dark">{admission.nationality}</span>
                </p>
                <p>
                  <strong>Aadhaar Number:</strong>{" "}
                  <span className="text-dark">{admission.aadhaarNumber}</span>
                </p>
                <p>
                  <strong>Course:</strong>{" "}
                  <span className="text-dark">{admission.course}</span>
                </p>
                <p>
                  <strong>Guardian Number:</strong>{" "}
                  <span className="text-dark">{admission.guardianNumber}</span>
                </p>
                <p>
                  <strong>Admission Fee Paid:</strong>{" "}
                  <span className="text-dark">
                    {admission.admissionFeePaid ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  <strong>Room Number:</strong>{" "}
                  <span className="text-dark">
                    {admission.room_number
                      ? admission.room_number.room_number
                      : "N/A"}
                  </span>
                </p>

                {/* Status Logic Based on Role */}
                <p className="fw-bold d-flex gap-3 align-items-center">
                  <span className="text-dark">
                    {admission.status === "Pending" && user.role === "admin"
                      ? "Action:"
                      : "Status:"}
                  </span>

                  {user.role === "admin" && admission.status === "Pending" ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => changeStatus(admission._id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => changeStatus(admission._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-dark">{admission.status}</span>
                  )}
                </p>
              </div>

              {/* ID Proof Button */}
              {admission.id_proof ? (
                <div className="text-center mt-3">
                  <a
                    href={`http://localhost:5000${admission.id_proof}`}
                    rel="noopener noreferrer"
                    className="btn btn-info text-white shadow-sm px-4 py-2"
                  >
                    View ID Proof
                  </a>
                </div>
              ) : (
                <p className="text-danger text-center fw-bold">
                  ID Proof: Not Available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;
