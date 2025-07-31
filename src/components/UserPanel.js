import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Replaces alert() with toast messages
  const showToast = (message, type = "info") => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warn(message);
        break;
      default:
        toast.info(message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    fetch('http://localhost:8080/allUser', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error('Unauthorized. Please log in again.');
          }
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
        showToast(err.message, 'error');
      });
  }, []);

  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`http://localhost:8080/userdelete?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.email !== email));
        showToast("User deleted successfully.", 'success');
      } else {
        showToast(`Failed to delete user. Status: ${response.status}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong while deleting the user.", 'error');
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2>All Users</h2>

      {loading && <div className="alert alert-info">Loading users...</div>}
      {error && <div className="alert alert-danger">Error: {error}</div>}

      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Mobile</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.email}>
                <td>{user.email}</td>
                <td>{user.fullname}</td>
                <td>{user.mobile}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(user.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      <Link to="/" className="btn btn-secondary mt-3">Back</Link>
    </div>
  );
}

export default UserPanel;
