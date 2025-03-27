import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";
import moment from "moment"; // Import moment.js for date formatting

const ListEmployeeSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const salariesPerPage = 5;

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/salary/getall",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setSalaries(response.data.data);
      } else {
        toast.error("Failed to fetch salaries");
      }
    } catch (error) {
      toast.error("Error fetching salaries: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/salary/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Salary record deleted successfully");
        setSalaries(salaries.filter((salary) => salary._id !== id));
      } else {
        toast.error("Failed to delete salary record");
      }
    } catch (error) {
      toast.error("Error deleting salary record: " + error.message);
    }
  };

  // Filter & Search Logic
  const filteredSalaries = salaries
    .filter((salary) =>
      salary?.employeeId?.employeeid
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((salary) =>
      filterStatus === "All" ? true : salary.status === filterStatus
    );

  // Pagination Logic
  const indexOfLastSalary = currentPage * salariesPerPage;
  const indexOfFirstSalary = indexOfLastSalary - salariesPerPage;
  const currentSalaries = filteredSalaries.slice(
    indexOfFirstSalary,
    indexOfLastSalary
  );

  return (
    <div className="container py-3">
      <div className="text-center mb-3">
        <h3 className="fw-bold">Manage Employee's Salaries</h3>
      </div>

      {/* Search & Add Salary Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by Employee ID"
          className="form-control me-2"
          style={{ width: "25%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to="/admin-dashboard/add-salary"
          className="btn btn-primary"
          style={{ width: "25%" }}
        >
          Add Salary
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="d-flex gap-3 mb-4 justify-content-end">
        {["Pending", "Paid", "All"].map((status) => (
          <button
            key={status}
            className={`btn ${
              filterStatus === status ? "btn-success" : "btn-primary"
            }`}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Salary Table */}
      <table className="table table-bordered table-striped">
        <thead style={{ backgroundColor: "blue", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Month</th>
            <th>Year</th>
            <th>BasicSalary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Salary</th>
            <th>Date</th> {/* Added Date Column */}
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSalaries.length > 0 ? (
            currentSalaries.map((salary) => (
              <tr key={salary._id}>
                <td>{salary.employeeId?.employeeid || "N/A"}</td>
                <td>
                  {salary.employeeId?.image ? (
                    <img
                      src={`http://localhost:5000${salary.employeeId.image}`}
                      alt={salary.employeeId.employeeid || "Employee Image"}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{salary.month}</td>
                <td>{salary.year}</td>
                <td>₹{salary.basicSalary}</td>
                <td>₹{salary.allowances}</td>
                <td>₹{salary.deductions}</td>
                <td>₹{salary.netSalary}</td>
                <td>{moment(salary.date).format("DD/MM/YYYY")}</td>{" "}
                {/* Formatted Date */}
                <td>
                  <span
                    className={`btn btn-sm ${
                      salary.status === "Paid" ? "btn-success" : "btn-danger"
                    }`}
                  >
                    {salary.status || "N/A"}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/admin-dashboard/view-salary/${salary._id}`}
                    className="btn btn-primary btn-sm me-2"
                    title="View"
                  >
                    <BsEye />
                  </Link>

                  <Link
                    to={`/admin-dashboard/update-salary/${salary._id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Update"
                  >
                    <BsPencilSquare />
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(salary._id)}
                    title="Delete"
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">
                No salary records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of{" "}
          {Math.max(1, Math.ceil(filteredSalaries.length / salariesPerPage))}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastSalary >= filteredSalaries.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListEmployeeSalary;
