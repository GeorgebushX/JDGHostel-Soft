// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// const AddEmployee = () => {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     employeeid: "",
//     dob: "",
//     gender: "",
//     maritalStatus: "",
//     room_number: "",
//     salary: "",
//     password: "",
//     role: "",
//   });

//   // Refs for file inputs
//   const imageRef = useRef(null);
//   const idProofRef = useRef(null);

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

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file") {
//       setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//     } else {
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formDataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key] !== undefined && formData[key] !== null) {
//         formDataToSend.append(key, formData[key]);
//       }
//     });

//     // Append files separately
//     if (imageRef.current?.files[0]) {
//       formDataToSend.append("image", imageRef.current.files[0]);
//     }
//     if (idProofRef.current?.files[0]) {
//       formDataToSend.append("id_proof", idProofRef.current.files[0]);
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/employee/add",
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Employee added successfully!");
//         setFormData({
//           name: "",
//           email: "",
//           employeeid: "",
//           dob: "",
//           gender: "",
//           maritalStatus: "",
//           room_number: "",
//           salary: "",
//           password: "",
//           role: "",
//         });

//         // Reset file inputs
//         if (imageRef.current) imageRef.current.value = "";
//         if (idProofRef.current) idProofRef.current.value = "";
//       } else {
//         toast.error(response.data.message || "Failed to add employee.");
//       }
//     } catch (error) {
//       toast.error("Error adding employee: " + error.message);
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
//               <h2>Add New Employee</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="row">
//                   <div className="col-md-6">
//                     {[
//                       { label: "Name", name: "name", type: "text" },
//                       { label: "Email", name: "email", type: "email" },
//                       {
//                         label: "Employee ID",
//                         name: "employeeid",
//                         type: "text",
//                       },
//                       { label: "Date of Birth", name: "dob", type: "date" },
//                       { label: "Salary", name: "salary", type: "number" },
//                       { label: "Password", name: "password", type: "password" },
//                     ].map(({ label, name, type }) => (
//                       <div key={name} className="mb-3">
//                         <label className="form-label">{label}</label>
//                         <input
//                           type={type}
//                           name={name}
//                           className="form-control"
//                           placeholder={`Enter ${label}`}
//                           value={formData[name]}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     ))}

//                     <div className="mb-3">
//                       <label className="form-label">Role</label>
//                       <select
//                         name="role"
//                         className="form-select"
//                         value={formData.role}
//                         onChange={handleChange}
//                         required
//                       >
//                         <option value="">Select Role</option>
//                         <option value="admin">Admin</option>
//                         <option value="employee">Employee</option>
//                         <option value="student">Student</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     {[
//                       {
//                         label: "Gender",
//                         name: "gender",
//                         options: ["male", "female", "other"],
//                       },
//                       {
//                         label: "Marital Status",
//                         name: "maritalStatus",
//                         options: ["single", "married"],
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
//                           <option value="">{`Select ${label}`}</option>
//                           {options.map((option) => (
//                             <option key={option} value={option}>
//                               {option.charAt(0).toUpperCase() + option.slice(1)}
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
//                         <option value="">Select Room Number</option>
//                         {rooms.map((room) => (
//                           <option key={room._id} value={room._id}>
//                             {room.room_number}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">Upload Image</label>
//                       <input
//                         type="file"
//                         name="image"
//                         className="form-control"
//                         accept="image/*"
//                         ref={imageRef}
//                       />
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">Upload ID Proof</label>
//                       <input
//                         type="file"
//                         name="id_proof"
//                         className="form-control"
//                         accept="application/pdf"
//                         ref={idProofRef}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="text-center">
//                   <button
//                     type="submit"
//                     className="btn btn-success me-2"
//                     disabled={loading}
//                   >
//                     {loading ? "Submitting..." : "Submit"}
//                   </button>
//                   <Link
//                     to="/admin-dashboard/employees"
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

// export default AddEmployee;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AddEmployee = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeid: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    phone:"",
    room_number: "",
    // salary: "",
    password: "",
    role: "",
  });

  // File upload refs
  const imageRef = useRef(null);
  const idProofRef = useRef(null);

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
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "employeeid",
      "dob",
      "gender",
      "maritalStatus",
      "phone",
      "room_number",
      // "salary",
      "password",
      "role",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        setLoading(false);
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append files separately
    if (imageRef.current?.files[0]) {
      formDataToSend.append("image", imageRef.current.files[0]);
    }
    if (idProofRef.current?.files[0]) {
      formDataToSend.append("id_proof", idProofRef.current.files[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee/add",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Employee added successfully!");
        setFormData({
          name: "",
          email: "",
          employeeid: "",
          dob: "",
          gender: "",
          maritalStatus: "",
          phone:"",
          room_number: "",
          password: "",
          role: "",
          image: "",
        });

        // Reset file inputs
        if (imageRef.current) imageRef.current.value = "";
        if (idProofRef.current) idProofRef.current.value = "";
      } else {
        toast.error(response.data.message || "Failed to add employee.");
      }
    } catch (error) {
      toast.error(
        "Error adding employee: " +
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
              <h2>Add New Employee</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Left Side Inputs */}
                  <div className="col-md-6">
                    {[
                      { label: "Name", name: "name", type: "text" },
                      { label: "Email", name: "email", type: "email" },
                      {
                        label: "Employee ID",
                        name: "employeeid",
                        type: "text",
                      },
                      { label: "Date of Birth", name: "dob", type: "date" },

                      { label: "Password", name: "password", type: "password" },
                      { label: "Phone Number", name: "phone", type: "phone" },
                    ].map(({ label, name, type }) => (
                      <div key={name} className="mb-3">
                        <label className="form-label">{label}</label>
                        <input
                          type={type}
                          name={name}
                          className="form-control"
                          placeholder={`Enter ${label}`}
                          value={formData[name]}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}

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
                  </div>

                  {/* Right Side Inputs */}
                  <div className="col-md-6">
                    {[
                      {
                        label: "Gender",
                        name: "gender",
                        options: ["male", "female", "other"],
                      },
                      {
                        label: "Marital Status",
                        name: "maritalStatus",
                        options: ["single", "married"],
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

                    {/* File Uploads */}
                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        accept="image/*"
                        ref={imageRef}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Upload ID Proof</label>
                      <input
                        type="file"
                        name="id_proof"
                        className="form-control"
                        accept="application/pdf"
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
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                  <Link
                    to="/admin-dashboard/employees"
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

export default AddEmployee;
