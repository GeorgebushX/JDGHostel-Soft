import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const UpdateEmployeeSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [salaryDetails, setSalaryDetails] = useState({
    basicSalary: "",
    allowances: "",
    deductions: "",
    status: "Pending",
  });

  // Fetch existing salary details
  useEffect(() => {
    const fetchSalaryDetails = async () => {
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
          setSalaryDetails(response.data.data);
        } else {
          toast.error("Failed to fetch salary details.");
        }
      } catch (error) {
        toast.error("Error fetching salary details: " + error.message);
      }
    };

    fetchSalaryDetails();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/salary/update/${id}`,
        {
          basicSalary: parseFloat(salaryDetails.basicSalary) || 0,
          allowances: parseFloat(salaryDetails.allowances) || 0,
          deductions: parseFloat(salaryDetails.deductions) || 0,
          status: salaryDetails.status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Salary updated successfully!");
        navigate("/admin-dashboard/salary-list");
      } else {
        toast.error("Failed to update salary.");
      }
    } catch (error) {
      toast.error("Error updating salary: " + error.message);
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
              <h2>Update Employee Salary</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Basic Salary</label>
                  <input
                    type="number"
                    name="basicSalary"
                    className="form-control"
                    value={salaryDetails.basicSalary}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Allowances</label>
                  <input
                    type="number"
                    name="allowances"
                    className="form-control"
                    value={salaryDetails.allowances}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Deductions</label>
                  <input
                    type="number"
                    name="deductions"
                    className="form-control"
                    value={salaryDetails.deductions}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className="form-select"
                    value={salaryDetails.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
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
                    onClick={() => navigate("/admin-dashboard/salary-list")}
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

export default UpdateEmployeeSalary;
