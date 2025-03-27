// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// const UpdateStudent = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const imageRef = useRef(null);
//   const idProofRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     dob: "",
//     gender: "",
//     email: "",
//     phonenumber: "",
//     address: "",
//     nationality: "",
//     aadhaarNumber: "",
//     course: "",
//     guardianNumber: "",
//     status: "Pending", // Default status set to Pending
//     room_number: "",
//     role: "",
//     admissionFeePaid: false, // Boolean
//   });

//   // Fetch admission details
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
//           const admission = response.data.data;
//           setFormData({
//             name: admission.name,
//             dob: admission.dob,
//             gender: admission.gender,
//             email: admission.email,
//             phonenumber: admission.phonenumber,
//             address: admission.address,
//             nationality: admission.nationality,
//             aadhaarNumber: admission.aadhaarNumber,
//             course: admission.course,
//             guardianNumber: admission.guardianNumber,
//             status: admission.status,
//             room_number: admission.room_number?._id || "",
//             role: admission.role,
//             admissionFeePaid: admission.admissionFeePaid,
//           });
//         } else {
//           toast.error("Failed to fetch admission details.");
//         }
//       } catch (error) {
//         toast.error("Error fetching admission details: " + error.message);
//       }
//     };

//     fetchAdmission();
//   }, [id]);

//   // Fetch available rooms
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
//           toast.error("Failed to fetch rooms.");
//         }
//       } catch (error) {
//         toast.error("Error fetching rooms: " + error.message);
//       }
//     };

//     fetchRooms();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     if (type === "file") {
//       setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//     } else if (type === "checkbox") {
//       setFormData((prevData) => ({ ...prevData, [name]: checked }));
//     } else {
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       formDataToSend.append(key, formData[key]);
//     });

//     if (imageRef.current?.files[0]) {
//       formDataToSend.append("image", imageRef.current.files[0]);
//     }
//     if (idProofRef.current?.files[0]) {
//       formDataToSend.append("id_proof", idProofRef.current.files[0]);
//     }

//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/admission/update/${id}`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Admission updated successfully!");
//         navigate("/admin-dashboard/admissions");
//       } else {
//         toast.error("Failed to update admission.");
//       }
//     } catch (error) {
//       toast.error("Error updating admission: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-12">
//           <div className="card shadow-lg">
//             <div className="card-header bg-primary text-white text-center">
//               <h2>Update Admission</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-md-6">
//                     {[
//                       { label: "Name", name: "name", type: "text" },
//                       { label: "Date of Birth", name: "dob", type: "date" },
//                       { label: "Email", name: "email", type: "email" },
//                       {
//                         label: "Phone Number",
//                         name: "phonenumber",
//                         type: "text",
//                       },
//                       { label: "Address", name: "address", type: "text" },
//                       {
//                         label: "Nationality",
//                         name: "nationality",
//                         type: "text",
//                       },
//                       {
//                         label: "Aadhaar Number",
//                         name: "aadhaarNumber",
//                         type: "text",
//                       },
//                       { label: "Course", name: "course", type: "text" },
//                       {
//                         label: "Guardian Number",
//                         name: "guardianNumber",
//                         type: "text",
//                       },
//                     ].map(({ label, name, type }) => (
//                       <div key={name} className="mb-3">
//                         <label className="form-label">{label}</label>
//                         <input
//                           type={type}
//                           name={name}
//                           className="form-control"
//                           value={formData[name]}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     ))}
//                   </div>

//                   <div className="col-md-6">
//                     {[
//                       {
//                         label: "Gender",
//                         name: "gender",
//                         options: ["male", "female", "other"],
//                       },
//                       {
//                         label: "Status",
//                         name: "status",
//                         options: ["Pending", "Approved", "Rejected"],
//                       },
//                     ].map(({ label, name, options }) => (
//                       <div key={name} className="mb-3">
//                         <label className="form-label">{label}</label>
//                         <select
//                           name={name}
//                           className="form-select"
//                           value={formData[name]}
//                           onChange={handleChange}
//                           required
//                         >
//                           <option value="">Select {label}</option>
//                           {options.map((option) => (
//                             <option key={option} value={option}>
//                               {option}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     ))}

//                     <div className="mb-3">
//                       <label className="form-label">Room Number</label>
//                       <select
//                         name="room_number"
//                         className="form-select"
//                         value={formData.room_number}
//                         onChange={handleChange}
//                         required
//                       >
//                         <option value="">Select Room</option>
//                         {rooms.map((room) => (
//                           <option key={room._id} value={room._id}>
//                             {room.room_number}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="mb-3 form-check">
//                       <input
//                         type="checkbox"
//                         name="admissionFeePaid"
//                         className="form-check-input"
//                         checked={formData.admissionFeePaid}
//                         onChange={handleChange}
//                       />
//                       <label className="form-check-label">
//                         Admission Fee Paid
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-center">
//                   <button
//                     type="submit"
//                     className="btn btn-success me-2"
//                     disabled={loading}
//                   >
//                     {loading ? "Updating..." : "Update"}
//                   </button>
//                   <Link
//                     to="/admin-dashboard/admissions"
//                     className="btn btn-secondary"
//                   >
//                     Back
//                   </Link>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateStudent;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const idProofRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    phonenumber: "",
    address: "",
    nationality: "",
    aadhaarNumber: "",
    course: "",
    guardianNumber: "",
    status: "Pending",
    room_number: "",
    role: "",
    admissionFeePaid: false,
  });

  // Fetch admission details
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
          const admission = response.data.data;
          setFormData({
            studentid: admission.studentid,
            name: admission.name,
            dob: admission.dob,
            gender: admission.gender,
            email: admission.email,
            phonenumber: admission.phonenumber,
            address: admission.address,
            nationality: admission.nationality,
            aadhaarNumber: admission.aadhaarNumber,
            course: admission.course,
            guardianNumber: admission.guardianNumber,
            status: admission.status,
            room_number: admission.room_number?._id || "",
            role: admission.role,
            admissionFeePaid: admission.admissionFeePaid,
          });
        } else {
          toast.error("Failed to fetch admission details.");
        }
      } catch (error) {
        toast.error(
          "Error fetching admission details: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchAdmission();
  }, [id]);

  // Fetch available rooms
  useEffect(() => {
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
          toast.error("Failed to fetch rooms.");
        }
      } catch (error) {
        toast.error(
          "Error fetching rooms: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchRooms();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: e.target.checked }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (imageRef.current?.files[0]) {
      formDataToSend.append("image", imageRef.current.files[0]);
    }
    if (idProofRef.current?.files[0]) {
      formDataToSend.append("id_proof", idProofRef.current.files[0]);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/student/update/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Admission updated successfully!");
        navigate("/admin-dashboard/students");
      } else {
        toast.error("Failed to update admission.");
      }
    } catch (error) {
      toast.error(
        "Error updating admission: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2>Update Student</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Left Side Inputs */}
                  <div className="col-md-6">
                    {[
                      {
                        label: "Student_ID",
                        name: "studentid",
                        type: "text",
                      },
                      { label: "Name", name: "name", type: "text" },
                      { label: "Date of Birth", name: "dob", type: "date" },
                      { label: "Email", name: "email", type: "email" },
                      {
                        label: "Phone Number",
                        name: "phonenumber",
                        type: "text",
                      },
                      { label: "Address", name: "address", type: "text" },
                      {
                        label: "Nationality",
                        name: "nationality",
                        type: "text",
                      },
                      {
                        label: "Aadhaar Number",
                        name: "aadhaarNumber",
                        type: "text",
                      },
                      { label: "Course", name: "course", type: "text" },
                      {
                        label: "Guardian Number",
                        name: "guardianNumber",
                        type: "text",
                      },
                    ].map(({ label, name, type }) => (
                      <div key={name} className="mb-3">
                        <label className="form-label">{label}</label>
                        <input
                          type={type}
                          name={name}
                          className="form-control"
                          value={formData[name]}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}
                    {/* 
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="student">Student</option>
                      </select>
                    </div> */}
                  </div>

                  {/* Right Side Inputs */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                        <option value="student">Student</option>
                      </select>
                    </div>
                    {[
                      {
                        label: "Gender",
                        name: "gender",
                        options: ["male", "female", "other"],
                      },
                      {
                        label: "Status",
                        name: "status",
                        options: ["Pending", "Approved", "Rejected"],
                      },
                    ].map(({ label, name, options }) => (
                      <div key={name} className="mb-3">
                        <label className="form-label">{label}</label>
                        <select
                          name={name}
                          className="form-select"
                          value={formData[name]}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select {label}</option>
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                    <div className="mb-3">
                      <label className="form-label">Room Number</label>
                      <select
                        name="room_number"
                        className="form-select"
                        value={formData.room_number}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Room</option>
                        {rooms.map((room) => (
                          <option key={room._id} value={room._id}>
                            {room.room_number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Admission Fee Paid</label>
                      <input
                        type="checkbox"
                        name="admissionFeePaid"
                        className="form-check-input"
                        checked={formData.admissionFeePaid}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        ref={imageRef}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Upload ID Proof</label>
                      <input
                        type="file"
                        name="id_proof"
                        className="form-control"
                        ref={idProofRef}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success me-2"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                  <Link
                    to="/admin-dashboard/students"
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

export default UpdateStudent;
