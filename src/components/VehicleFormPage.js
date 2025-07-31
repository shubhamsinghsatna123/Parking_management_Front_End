import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function VehicleFormPage({ isModal = false, onClose }) {
  const [vehicle, setVehicle] = useState({
    numberPlate: '',
    vehicleType: '',
    make: '',
    color: '',
    email: localStorage.getItem("email") || ''
  });

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  // Token check
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token && !isModal) {
      navigate("/login");
    }
  }, [isModal, navigate]);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const showModalMessage = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      showModalMessage("Unauthorized", "Please login first.");
      return;
    }

    const payload = {
      numberPlate: vehicle.numberPlate,
      vehicleType: vehicle.vehicleType,
      make: vehicle.make,
      color: vehicle.color,
      user: { email: vehicle.email }
    };

    try {
      const res = await fetch("http://localhost:8080/vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 201) {
        // const savedVehicle = await res.json();
        showModalMessage("Success", "Vehicle registered successfully!");
        setVehicle({
          numberPlate: '',
          vehicleType: '',
          make: '',
          color: '',
          email: vehicle.email
        });
        setTimeout(() => {
          setShowModal(false);
          if (isModal && onClose) onClose();
        }, 1500);
      } else {
        const errorMsg = await res.text();

        if (res.status === 400) {
          showModalMessage("Error", errorMsg || "Invalid data. Employee not found.");
        } else if (res.status === 409) {
          showModalMessage("Error", errorMsg || "Duplicate vehicle number plate.");
        } else {
          showModalMessage("Error", errorMsg || "Something went wrong.");
        }
      }
    } catch (err) {
      showModalMessage("Error", "Network error. Please try again later.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">User Email</label>
          <input type="email" className="form-control" name="email" value={vehicle.email} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Number Plate</label>
          <input
            type="text"
            placeholder='eg. AB01AB1234'
            className="form-control"
            name="numberPlate"
            value={vehicle.numberPlate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Vehicle Type</label>
          <input
            type="text"
            placeholder='eg. car, bike'
            className="form-control"
            name="vehicleType"
            value={vehicle.vehicleType}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Make</label>
          <input
            type="text"
            placeholder='eg. tata, mahindra'
            className="form-control"
            name="make"
            value={vehicle.make}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Color</label>
          <input
            type="text"
            placeholder='eg. white, black'
            className="form-control"
            name="color"
            value={vehicle.color}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register Vehicle</button>
      </form>

      {!isModal && (
        <div className="text-center mt-3">
          <Link to="/" className="btn btn-secondary">Back</Link>
        </div>
      )}

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              {/* <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleFormPage;
