import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateStudentFee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [feeDetails, setFeeDetails] = useState({
    HostelFee: 0,
    amountPaid: 0,
    dueAmount: 0,
    paymentStatus: "Pending",
  });

  // Fetch fee details
  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/fee/getone/${id}`
        );

        if (response.data.success) {
          setFeeDetails(response.data.data);
        } else {
          toast.error("Failed to fetch fee details.");
        }
      } catch (error) {
        toast.error(
          "Error fetching fee details: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchFeeDetails();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeeDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/fee/update/${id}`,
        feeDetails
      );

      if (response.data.success) {
        toast.success("Fee details updated successfully!");
        navigate("/admin-dashboard/feelist");
      } else {
        toast.error("Failed to update fee details.");
      }
    } catch (error) {
      toast.error(
        "Error updating fee details: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h2>Update Student Fee</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Hostel Fee</label>
                  <input
                    type="number"
                    name="HostelFee"
                    className="form-control"
                    value={feeDetails.HostelFee}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Amount Paid</label>
                  <input
                    type="number"
                    name="amountPaid"
                    className="form-control"
                    value={feeDetails.amountPaid}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Due Amount</label>
                  <input
                    type="number"
                    name="dueAmount"
                    className="form-control"
                    value={feeDetails.dueAmount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Status</label>
                  <select
                    name="paymentStatus"
                    className="form-select"
                    value={feeDetails.paymentStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success me-2"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
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

export default UpdateStudentFee;
