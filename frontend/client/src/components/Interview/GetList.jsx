import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

const GetList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://fake-json-api.mock.beeceptor.com/users"
      );
      const uniqueUsers = removeDuplicates(response.data);
      setUsers(uniqueUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const removeDuplicates = (users) => {
    const uniqueUsers = [];
    const seenIds = new Set();

    users.forEach((user) => {
      if (!seenIds.has(user.id)) {
        seenIds.add(user.id);
        uniqueUsers.push(user);
      }
    });
    return uniqueUsers;
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="container py-3">
      <div className="text-center mb-3">
        <h3 className="fw-bold">User List</h3>
      </div>

      <input
        type="text"
        placeholder="Search by Name"
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table table-bordered table-striped">
        <thead className="bg-primary text-white">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.address}, {user.state}, {user.country}
                </td>
                <td>{user.phone}</td>
                <td>
                  <img
                    src={user.photo}
                    alt={user.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                </td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" title="View">
                    <BsEye />
                  </button>
                  <button className="btn btn-warning btn-sm me-2" title="Edit">
                    <BsPencilSquare />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    title="Delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GetList;
