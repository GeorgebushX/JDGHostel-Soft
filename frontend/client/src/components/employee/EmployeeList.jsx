import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

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
          toast.error("Failed to fetch employees");
        }
      } catch (error) {
        toast.error("Error fetching employees: " + error.message);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/employee/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Employee deleted successfully");
        setEmployees(employees.filter((employee) => employee._id !== id));
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      toast.error("Error deleting employee: " + error.message);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name &&
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / employeesPerPage)
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container py-3">
      <div className="text-center mb-3">
        <h3 className="fw-bold">Manage Employees</h3>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search By Employee Name"
          className="form-control me-2"
          style={{ width: "25%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="btn btn-primary"
          style={{ width: "25%" }}
        >
          Add New Employee
        </Link>
      </div>

      <div>
        <table className="table table-bordered table-striped">
          <thead style={{ backgroundColor: "blue", color: "white" }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Room</th>
              <th>Image</th>
              <th>Email</th>
              
              <th>Gender</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeid || "N/A"}</td>
                  <td>{employee.name || "N/A"}</td>
                  <td>{employee.room_number?.room_number || "N/A"}</td>
                  <td>
                    {employee.image ? (
                      <img
                        src={`http://localhost:5000${employee.image}`}
                        alt={employee.name || "Employee Image"}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{employee.email || "N/A"}</td>
                 
                  <td>{employee.gender || "N/A"}</td>
                  <td>₹{employee.netSalary?.netSalary || "N/A"}</td>
                  <td>
                    <Link
                      to={`/admin-dashboard/view-employee/${employee._id}`}
                      className="btn btn-primary btn-sm me-2"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      to={`/admin-dashboard/update-employee/${employee._id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(employee._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
