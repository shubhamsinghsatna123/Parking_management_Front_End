import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(to right, #667eea, #764ba2)",
        padding: "20px",
      }}
    >
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <h3 className="mb-4 text-center">Login</h3>

        <form onSubmit={handleSubmit}>
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
      <div className="input-group">
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          id="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
        </button>
      </div>
    </div>

          <div className="mb-3 d-flex align-items-center justify-content-between">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/register" className="text-decoration-none">
              Create Account
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
          <Link to="/" className="btn btn-secondary w-100 text-white text-center">
            Back
          </Link>
        </form>

        {/* Conditionally show logout button */}
        {localStorage.getItem("jwtToken") && !showConfirmLogout && (
          <div className="text-center mt-3">
            <button
              className="btn btn-danger"
              onClick={() => setShowConfirmLogout(true)}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Modal - Logout Confirmation */}
      {showConfirmLogout && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Logout Confirmation</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmLogout(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
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
