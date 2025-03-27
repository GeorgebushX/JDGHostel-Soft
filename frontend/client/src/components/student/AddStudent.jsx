
import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import HomeNavibar from "../../pages/HomeNavibar";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const AddStudent = () => {
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
    role: "student",
    password: "",
  });

  const [files, setFiles] = useState({});
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataObj.append(key, value)
    );
    Object.entries(files).forEach(([key, value]) =>
      formDataObj.append(key, value)
    );

    try {
      const res = await axios.post(
        "http://localhost:5000/api/student/add",
        formDataObj,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(res);
      setMessage("Admission created successfully. Proceed to payment.");
      setOrderId(res.data.order.id); // Save order ID for payment
    } catch (error) {
      setMessage(error.response?.data?.message || "Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  // Handle payment

  const handlePayment = async () => {
    if (!orderId) return alert("No order found, please submit the form first.");

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: 20000, // Amount in paise (₹200)
      currency: "INR",
      name: "JDG Hostel Admissions",
      description: "Admission Fee Payment",
      order_id: orderId,
      handler: async (response) => {
        try {
          // Validate payment
          const validateRes = await axios.post(
            "http://localhost:5000/api/student/validate/payment",
            response
          );

          if (validateRes.data.success) {
            // Call verifyPayment after successful validation
            const verifyRes = await axios.post(
              "http://localhost:5000/api/student/verify/payment",
              response
            );

            if (verifyRes.data.success) {
              setMessage(
                "Payment successful! Admission confirmed. Check your email."
              );
            } else {
              setMessage("Payment verification failed.");
            }
          } else {
            setMessage("Payment validation failed.");
          }
        } catch (error) {
          setMessage("Payment verification failed.");
          console.error("Payment Verification Error:", error);
        }
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phonenumber,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", (response) => {
      alert("Payment Failed: " + response.error.description);
    });

    rzp1.open();
  };

  return (
    <div>
      <HomeNavibar />
      <Container className="mt-4">
        <h2>Admission Form</h2>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phonenumber"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nationality</Form.Label>
                <Form.Control
                  type="text"
                  name="nationality"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Aadhaar Number</Form.Label>
                <Form.Control
                  type="text"
                  name="aadhaarNumber"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Course</Form.Label>
                <Form.Control
                  type="text"
                  name="course"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Guardian Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="guardianNumber"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Upload ID Proof</Form.Label>
                <Form.Control
                  type="file"
                  name="id_proof"
                  onChange={handleFileChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" className="mt-3" disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Form>

        {orderId && (
          <Button className="mt-3" variant="success" onClick={handlePayment}>
            Proceed to Payment
          </Button>
        )}
      </Container>
    </div>
  );
};

export default AddStudent;
