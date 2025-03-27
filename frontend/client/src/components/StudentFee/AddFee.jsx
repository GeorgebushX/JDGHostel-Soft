// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Form,
//   Button,
//   Alert,
//   Container,
//   Row,
//   Col,
//   Spinner,
// } from "react-bootstrap";
// import { useAuth } from "../../context/authContext"; // Assuming you have an auth context
// import { toast } from "react-toastify";

// const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

// const AddFee = () => {
//   const [formData, setFormData] = useState({
//     admission_id: "",
//     room_id: "",
//     hostelFee: "",
//     paymentMode: "",
//     paymentStatus: "",
//     dueAmount: "",
//   });

//   const [message, setMessage] = useState("");
//   const [orderId, setOrderId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth(); // Get user role from context

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/fee/create",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setMessage("Fee payment recorded successfully. Proceed to payment.");
//         if (formData.paymentMode === "online") {
//           setOrderId(res.data.order.id); // Save order ID for Razorpay payment
//         } else {
//           toast.success("Fee payment recorded successfully.");
//         }
//       } else {
//         setMessage(res.data.message || "Error submitting form");
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Error submitting form");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Razorpay payment
//   const handlePayment = async () => {
//     if (!orderId) return alert("No order found, please submit the form first.");

//     const options = {
//       key: RAZORPAY_KEY_ID,
//       amount: formData.hostelFee * 100, // Amount in paise
//       currency: "INR",
//       name: "JDG Hostel Fee Payment",
//       description: "Hostel Fee Payment",
//       order_id: orderId,
//       handler: async (response) => {
//         try {
//           // Validate payment
//           const validateRes = await axios.post(
//             "http://localhost:5000/api/fee/validate/payment",
//             response,
//             {
//               headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//               },
//             }
//           );

//           if (validateRes.data.success) {
//             toast.success(
//               "Payment successful! Fee receipt sent to your email."
//             );
//           } else {
//             toast.error("Payment verification failed.");
//           }
//         } catch (error) {
//           toast.error("Payment verification failed.");
//           console.error("Payment Verification Error:", error);
//         }
//       },
//       prefill: {
//         name: "Student Name", // Fetch from form or API
//         email: "student@example.com", // Fetch from form or API
//         contact: "1234567890", // Fetch from form or API
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzp1 = new window.Razorpay(options);
//     rzp1.on("payment.failed", (response) => {
//       toast.error("Payment Failed: " + response.error.description);
//     });

//     rzp1.open();
//   };

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center mb-4">Fee Payment</h2>
//       {message && <Alert variant="info">{message}</Alert>}
//       <Form onSubmit={handleSubmit}>
//         <Row className="mb-3">
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Admission ID</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="admission_id"
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Room ID</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="room_id"
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row className="mb-3">
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Hostel Fee</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="hostelFee"
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Payment Mode</Form.Label>
//               <Form.Select name="paymentMode" onChange={handleChange} required>
//                 <option value="">Select</option>
//                 <option value="online">Online</option>
//                 <option value="offline">Offline</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row className="mb-3">
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Payment Status</Form.Label>
//               <Form.Select
//                 name="paymentStatus"
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select</option>
//                 <option value="paid">Paid</option>
//                 <option value="pending">Pending</option>
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Due Amount</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="dueAmount"
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <div className="d-flex justify-content-center mt-4">
//           <Button
//             type="submit"
//             className="btn btn-primary me-3"
//             disabled={loading}
//           >
//             {loading ? (
//               <Spinner as="span" animation="border" size="sm" />
//             ) : (
//               "Submit"
//             )}
//           </Button>

//           {orderId && formData.paymentMode === "online" && (
//             <Button className="btn btn-success" onClick={handlePayment}>
//               Proceed to Payment
//             </Button>
//           )}
//         </div>
//       </Form>
//     </Container>
//   );
// };

// export default AddFee;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AddFee = () => {
//   const navigate = useNavigate();
//   const [admissions, setAdmissions] = useState([]);
//   const [data, setData] = useState({
//     admission_id: "",
//     studentid: "",
//     HostelFee: "",
//     amountPaid: "",
//     dueDate: "",
//     paymentMethod: "Cash",
//   });

//   // Fetch student admissions when the component loads
//   useEffect(() => {
//     const fetchAdmissions = async () => {
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
//           setAdmissions(response.data.data);
//         } else {
//           toast.error("Failed to fetch admissions.");
//         }
//       } catch (error) {
//         toast.error("Error fetching admissions: " + error.message);
//       }
//     };

//     fetchAdmissions();
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "admission_id") {
//       // Find the selected admission to get studentid
//       const selectedAdmission = admissions.find(
//         (admission) => admission._id === value
//       );
//       setData((prevData) => ({
//         ...prevData,
//         admission_id: value,
//         studentid: selectedAdmission ? selectedAdmission.studentid : "",
//       }));
//     } else {
//       setData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/fee/add",
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         toast.success("Student fee added successfully!");
//         navigate("/admin-dashboard/feelist");
//       } else {
//         toast.error(response.data.message || "Failed to add student fee.");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong.");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card shadow-lg">
//             <div className="card-header bg-primary text-white text-center">
//               <h2>Add Student Fee</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">Select Student</label>
//                   <select
//                     className="form-control"
//                     name="admission_id"
//                     value={data.admission_id}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">-- Select Student --</option>
//                     {admissions.map((admission) => (
//                       <option key={admission._id} value={admission._id}>
//                         {admission.studentName} (ID: {admission.studentid})
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Student ID</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="studentid"
//                     value={data.studentid}
//                     readOnly
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Hostel Fee</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Hostel Fee"
//                     className="form-control"
//                     name="HostelFee"
//                     value={data.HostelFee}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Amount Paid</label>
//                   <input
//                     type="number"
//                     placeholder="Enter Amount Paid"
//                     className="form-control"
//                     name="amountPaid"
//                     value={data.amountPaid}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Due Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     name="dueDate"
//                     value={data.dueDate}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label">Payment Method</label>
//                   <select
//                     className="form-control"
//                     name="paymentMethod"
//                     value={data.paymentMethod}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="Cash">Cash</option>
//                     <option value="Online">Online</option>
//                   </select>
//                 </div>

//                 <div className="text-center">
//                   <button type="submit" className="btn btn-success me-2">
//                     Submit
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => navigate("/admin-dashboard/fees")}
//                   >
//                     Back
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddFee;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddFee = () => {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState([]);
  const [data, setData] = useState({
    admission_id: "",
    studentid: "",
    HostelFee: "",
    amountPaid: "",
    dueDate: "",
    paymentMethod: "Cash",
  });

  // Fetch student admissions when component loads
  useEffect(() => {
    const fetchAdmissions = async () => {
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
          setAdmissions(response.data.data);
        } else {
          toast.error("Failed to fetch admissions.");
        }
      } catch (error) {
        toast.error("Error fetching admissions: " + error.message);
      }
    };

    fetchAdmissions();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "admission_id") {
      const selectedAdmission = admissions.find(
        (admission) => admission._id === value
      );
      setData((prevData) => ({
        ...prevData,
        admission_id: value,
        studentid: selectedAdmission ? selectedAdmission.phoneNumber : "",
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/fee/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Student fee added successfully!");
        navigate("/admin-dashboard/feelist");
      } else {
        toast.error(response.data.message || "Failed to add student fee.");
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
              <h2>Add Student Fee</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Select Student Dropdown */}
                <div className="mb-3">
                  <label className="form-label">Select Student</label>
                  <select
                    className="form-control"
                    name="admission_id"
                    value={data.admission_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Student --</option>
                    {admissions.map((admission) => (
                      <option key={admission._id} value={admission._id}>
                        {admission.studentName} Student:ID:{" "}
                        {admission.studentid}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hostel Fee */}
                <div className="mb-3">
                  <label className="form-label">Hostel Fee</label>
                  <input
                    type="number"
                    placeholder="Enter Hostel Fee"
                    className="form-control"
                    name="HostelFee"
                    value={data.HostelFee}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Amount Paid */}
                <div className="mb-3">
                  <label className="form-label">Amount Paid</label>
                  <input
                    type="number"
                    placeholder="Enter Amount Paid"
                    className="form-control"
                    name="amountPaid"
                    value={data.amountPaid}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Due Date */}
                <div className="mb-3">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={data.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-control"
                    name="paymentMethod"
                    value={data.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                {/* Submit and Back Buttons */}
                <div className="text-center">
                  <button type="submit" className="btn btn-success me-2">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin-dashboard/fee-list")}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFee;
