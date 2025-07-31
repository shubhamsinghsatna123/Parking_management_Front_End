import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [fullname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');


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

    // Prepare request body conditionally
    const payload={ fullname, email, mobile, password, role };

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Registered successfully!");
        navigate("/login");
      } else {
        alert("Registration failed. Please check your input.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while registering.");
    }
  };

  return (
    <div className="container w-50 p-3 mt-5">
      <h3>Registration Form</h3>

      <form onSubmit={handleSubmit} className="p-4 container shadow rounded bg-light">
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

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address:</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

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

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

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

        {/* Conditionally show Admin Code input */}
        {/* {role === 'ADMIN' && (
          <div className="mb-3">
            <label htmlFor="adminCode" className="form-label">Admin Code:</label>
            <input
              type="text"
              className="form-control"
              id="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
            />
          </div>
        )} */}

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
    </div>
  );
}

export default Register;
