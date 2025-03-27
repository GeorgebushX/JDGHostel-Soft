import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const AddEmployeeSalary = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeid: "",
    month: currentMonth,
    year: currentYear,
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employee/getall",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          toast.error("Failed to fetch employees.");
        }
      } catch (error) {
        toast.error("Error fetching employees: " + error.message);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/salary/create",
        {
          employeeid: formData.employeeid,
          month: formData.month,
          year: parseInt(formData.year),
          basicSalary: parseFloat(formData.basicSalary) || 0,
          allowances: parseFloat(formData.allowances) || 0,
          deductions: parseFloat(formData.deductions) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Salary created successfully!");
        navigate("/admin-dashboard/salary-list");
      } else {
        toast.error("Error submitting form.");
      }
    } catch (error) {
      toast.error("Error submitting form: " + error.message);
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
              <h2>Add Employee Salary</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Employee</label>
                  <select
                    name="employeeid"
                    className="form-select"
                    value={formData.employeeid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.employeeName} ({employee.employeeid})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Month</label>
                    <select
                      name="month"
                      className="form-select"
                      value={formData.month}
                      onChange={handleChange}
                      required
                    >
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Year</label>
                    <select
                      name="year"
                      className="form-select"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    >
                      {[currentYear, currentYear - 1, currentYear - 2].map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Basic Salary</label>
                  <input
                    type="number"
                    name="basicSalary"
                    className="form-control"
                    value={formData.basicSalary}
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
                    value={formData.allowances}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Deductions</label>
                  <input
                    type="number"
                    name="deductions"
                    className="form-control"
                    value={formData.deductions}
                    onChange={handleChange}
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-success me-2"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
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

export default AddEmployeeSalary;
