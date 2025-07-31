import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [fullname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conformpassword, setConformPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordFormatError, setPasswordFormatError] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const navigate = useNavigate();

  const clearScreen = () => {
    setName("");
    setEmail("");
    setPassword("");
    setMobile("");
    setRole("");
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== conformpassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Validate email format
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
      return;
    } else {
      setEmailError("");
    }

    // Validate password format
    if (!passwordPattern.test(password)) {
      setPasswordFormatError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    } else {
      setPasswordFormatError("");
    }

    const payload = { fullname, email, mobile, password, role, conformpassword };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setModalTitle("Success");
        setModalMessage("Registered successfully!");
        setShowModal(true);
        // After closing modal, navigate to login
      } else {
        const errorMessage = await response.text();
        setModalTitle("Error");
        setModalMessage(errorMessage || "Registration failed.");
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setModalTitle("Error");
      setModalMessage("An error occurred while registering.");
      setShowModal(true);
    }
  };

  // Optional: navigate to login after modal close on success
  const handleModalClose = () => {
    setShowModal(false);
    if (modalTitle === "Success") {
      navigate("/login");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
      }}
    >
    <div className="container w-50 p-3 " >
      <h3>Registration Form</h3>
      <form onSubmit={handleSubmit} className="p-4 container shadow rounded bg-light">
        {/* Fullname */}
        <div className="mb-3">
          <label htmlFor="exampleInputName" className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputName"
            value={fullname}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address:</label>
          <input
            type="email"
            className={`form-control ${emailError ? 'is-invalid' : ''}`}
            id="exampleInputEmail1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>

        {/* Mobile */}
        <div className="mb-3">
          <label htmlFor="exampleInputMobile" className="form-label">Mobile:</label>
          <input
            type="tel"
            className="form-control"
            id="exampleInputMobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>



{/* Password */}
<div className="mb-3">
  <label htmlFor="exampleInputPassword1" className="form-label">Password:</label>
  <div className="input-group">
    <input
      type={showPassword ? "text" : "password"}
      className={`form-control ${passwordFormatError ? 'is-invalid' : ''}`}
      id="exampleInputPassword1"
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
    {passwordFormatError && <div className="invalid-feedback d-block">{passwordFormatError}</div>}
  </div>
</div>

{/* Confirm Password */}
<div className="mb-3">
  <label htmlFor="exampleInputPassword2" className="form-label">Confirm Password:</label>
  <div className="input-group">
    <input
      type={showConfirmPassword ? "text" : "password"}
      className={`form-control ${passwordError ? 'is-invalid' : ''}`}
      id="exampleInputPassword2"
      value={conformpassword}
      onChange={(e) => {
        setConformPassword(e.target.value);
        setPasswordError(
          password && e.target.value !== password ? "Passwords do not match" : ""
        );
      }}
      required
    />
    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      tabIndex={-1}
      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
    >
      {showConfirmPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
    </button>
    {passwordError && <div className="invalid-feedback d-block">{passwordError}</div>}
  </div>
</div>


        {/* Role */}
        <div className="mb-3">
          <label htmlFor="exampleInputRole" className="form-label">Role:</label>
          <select
            className="form-select"
            id="exampleInputRole"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">-- Select Role --</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {/* Agree to terms */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
            required
          />
          <label className="form-check-label" htmlFor="exampleCheck1">Agree to terms</label>
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="reset" className="btn btn-secondary" onClick={clearScreen}>Clear</button>
          <Link to="/" className="btn btn-danger text-white text-decoration-none">Cancel</Link>
        </div>
      </form>

      {/* Modal for showing messages */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className={`modal-header ${modalTitle === "Success" ? "bg-success text-white" : "bg-danger text-white"}`}>
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={handleModalClose}
                />
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalClose}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default Register;
