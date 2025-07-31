import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = 'info') => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isMobile = /^[0-9]{10}$/.test(identifier);
    const payload = {
      password,
      ...(isMobile ? { mobile: identifier } : { email: identifier })
    };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token || data.Token;
        const name = data.Data.fullname;
        const email = data.Data.email;
        const role = data.Data.role;

        if (!token) throw new Error("Token missing in response");

        localStorage.setItem("jwtToken", token);
        localStorage.setItem("name", name);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loginTime", Date.now().toString());

        showToast("Login successful!", "success");

        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        showToast("Invalid login credentials", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("Login failed. Please try again.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowConfirmLogout(false);
    showToast("Logged out successfully!", "success");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <ToastContainer position="top-right" autoClose={2500} />

      <form
        onSubmit={handleSubmit}
        className="p-4 shadow rounded bg-light"
        style={{ minWidth: '350px' }}
      >
        <h3 className="mb-3 text-center">Login</h3>

        <div className="mb-3">
          <label htmlFor="identifier" className="form-label">Email or Mobile</label>
          <input
            type="text"
            placeholder="Enter email or mobile number"
            className="form-control"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/register" className="btn btn-link text-decoration-none text-black p-0">
            Don't have an account?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>

        <Link to="/" className="btn btn-secondary mt-3 w-100 text-white text-decoration-none text-center">
          Back
        </Link>
      </form>

     {/* Conditionally render logout button without logging out immediately */}
{localStorage.getItem("jwtToken") && !showConfirmLogout && (
  <div className="mt-3 text-center">
    <button
      type="button"
      className="btn btn-danger"
      onClick={() => setShowConfirmLogout(true)}
    >
      Logout
    </button>
  </div>
)}

{/* Logout confirmation modal */}
{showConfirmLogout && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    aria-modal="true"
    aria-labelledby="logoutModalLabel"
    aria-describedby="logoutModalDesc"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="logoutModalLabel">Logout Confirmation</h5>
        </div>
        <div className="modal-body" id="logoutModalDesc">
          <p>Are you sure you want to log out?</p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowConfirmLogout(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Yes, Log out
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Login;
