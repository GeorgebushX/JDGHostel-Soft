
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/get/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setEmployee(response.data.data);
        } else {
          toast.error("Failed to fetch employee details");
        }
      } catch (err) {
        toast.error("Error fetching employee: " + err.message);
        setError("Error fetching employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!employee)
    return (
      <p className="text-secondary text-center mt-5">No employee data found.</p>
    );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-lg p-4 bg-light">
            {/* Employee Profile Picture */}
            {employee.image && (
              <div className="text-center mb-3">
                <div className="border p-2 rounded-circle bg-white d-inline-block shadow">
                  <img
                    src={`http://localhost:5000${employee.image}`}
                    alt="Employee"
                    className="rounded-circle"
                    style={{
                      width: "200px",
                      height: "170px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Employee Information */}
            <div className="text-center">
              <h4 className="fw-bold text-dark">{employee.name}</h4>
              {/* <p className="text-muted">{employee.role}</p> */}
            </div>

            <div className="card-body">
              <div className="border rounded p-3 bg-white shadow-sm">
                <h5 className="text-primary text-center mb-3">
                  Employee Information
                </h5>
                <p>
                  <strong>Employee ID:</strong>{" "}
                  <span className="text-dark">{employee.employeeid}</span>
                </p>
                <p>
                  <strong>Room Number:</strong>{" "}
                  <span className="text-dark">
                    {employee.room_number?.room_number || employee.room_number}
                  </span>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <span className="text-dark">{employee.email}</span>
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  <span className="text-dark">
                    {new Date(employee.dob).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <strong>Gender:</strong>{" "}
                  <span className="text-dark">{employee.gender}</span>
                </p>
                <p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    <span className="text-dark">{employee.phone}</span>
                  </p>
                  <strong>Marital Status:</strong>{" "}
                  <span className="text-dark">{employee.maritalStatus}</span>
                </p>
                <p>
                  <strong>Salary:</strong>{" "}
                  <span className="text-dark">
                    ₹{employee.netSalary?.netSalary}
                  </span>
                </p>
              </div>

              {/* ID Proof Button */}
              {employee.id_proof ? (
                <div className="text-center mt-3">
                  <a
                    href={`http://localhost:5000${employee.id_proof}`}
                    rel="noopener noreferrer"
                    className="btn btn-info text-white shadow-sm px-4 py-2"
                  >
                    View ID Proof
                  </a>
                </div>
              ) : (
                <p className="text-danger text-center fw-bold">
                  ID Proof: Not Available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
