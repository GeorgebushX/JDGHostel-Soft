import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const ViewStudentFee = () => {
  const { id } = useParams();
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeeDetails = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/fee/getone/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          //   setFeeDetails(response.data.data);
          // }

          // Ensure response data is an array and take the first record
          const feeData = Array.isArray(response.data.data)
            ? response.data.data[0] // Take the first object from array
            : response.data.data;

          if (!feeData) {
            setError("No fee details found.");
          } else {
            setFeeDetails(feeData);
          }
        } else {
          toast.error("Failed to fetch fee details");
          setError("No fee details found.");
        }
      } catch (err) {
        toast.error("Error fetching fee details: " + err.message);
        setError("Error fetching fee details.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeeDetails();
  }, [id]);

  const handleOnlinePayment = async () => {
    if (!id || !feeDetails) {
      toast.error("Invalid fee details. Please try again.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/fee/payment/${id}/pay`,
        {
          amount: feeDetails.dueAmount, // Ensure correct amount
        }
      );

      if (response.data.success && response.data.order) {
        initializeRazorpay(response.data.order);
      }
    } catch (error) {
      console.error(
        "Payment initiation error:",
        error.response?.data || error.message
      );
      toast.error("Error initiating payment. Please try again.");
    }
  };

  // Initialize Razorpay payment
  const initializeRazorpay = (order) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "JDG Hostel Fee Payment",
      description: "Hostel fee payment",
      order_id: order.id,
      handler: async (payment) => {
        try {
          const verifyResponse = await axios.post(
            "http://localhost:5000/api/fee/validate-payment",
            {
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature,
              amount: feeDetails.dueAmount, // Ensure correct amount
            }
          );

          if (verifyResponse.data.success) {
            setFeeDetails((prev) => ({
              ...prev,
              paymentStatus: "Paid",
              amountPaid: prev.amountPaid + feeDetails.dueAmount,
              dueAmount: 0,
            }));
            toast.success("Payment successful!");
          }
        } catch (error) {
          console.error(
            "Payment verification failed:",
            error.response?.data || error.message
          );
          toast.error("Payment verification failed.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Handle receipt download
  const handleDownloadReceipt = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/fee/download/receipt/${id}`,
        {
          responseType: "blob", // Ensure the response is treated as a binary file
        }
      );

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading receipt.");
      console.error(error);
    }
  };

  if (loading) return <p>Loading fee details...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!feeDetails) return <p>No fee details available.</p>;
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-black text-center">Student Fee Detail</h2>

      {/* Card Container */}
      <div className="card shadow p-4 text-center">
        {/* Centered Student Image */}
        <div className="d-flex justify-content-center mb-3">
          {feeDetails.admission_id?.image ? (
            <img
              src={`http://localhost:5000${feeDetails.admission_id.image}`}
              alt={feeDetails.admission_id.studentid || "Student Image"}
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

        {/* Fee Details Table */}
        <table className="table table-bordered text-start">
          <tbody>
            <tr>
              <th>Student Name</th>
              <td>{feeDetails.admission_id?.name}</td>
            </tr>
            <tr>
              <th>Student ID</th>
              <td>{feeDetails.admission_id?.studentid}</td>
            </tr>
            <tr>
              <th>Room Number</th>
              <td>{feeDetails.admission_id?.room_number?.room_number}</td>
            </tr>
            <tr>
              <th>Hostel Fee</th>
              <td>₹{feeDetails.HostelFee}</td>
            </tr>
            <tr>
              <th>Amount Paid</th>
              <td className="text-primary fw-bold">₹{feeDetails.amountPaid}</td>
            </tr>
            <tr>
              <th>Due Amount</th>
              <td
                className={
                  feeDetails.dueAmount > 0
                    ? "text-danger fw-bold"
                    : "text-success fw-bold"
                }
              >
                ₹{feeDetails.dueAmount}
              </td>
            </tr>
            <tr>
              <th>Payment Status</th>
              <td
                className={
                  feeDetails.paymentStatus === "Paid"
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {feeDetails.paymentStatus}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment & Receipt Buttons */}
        <div className="d-flex justify-content-center gap-5 mt-4">
          <button
            onClick={handleOnlinePayment}
            className="btn btn-primary px-5 mx-3"
          >
            {feeDetails.paymentStatus === "Paid"
              ? "Make Another Payment"
              : "Online Payment"}
          </button>

          <button
            onClick={handleDownloadReceipt}
            className="btn btn-success px-5 mx-3"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentFee;
