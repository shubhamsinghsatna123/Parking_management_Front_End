import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
   const token= localStorage.getItem("jwtToken");
   console.log("Token in localStorage:", localStorage.getItem("jwtToken"));

    fetch('http://localhost:8080/allAdmin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>All Users</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Mobile</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No users found.</td>
            </tr>
          )}
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{user.fullname}</td>
              <td>{user.mobile}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
       <Link to="/" className="btn btn-secondary mt-3">Back</Link>
    </div>
  );
}

export default AdminPanel;
