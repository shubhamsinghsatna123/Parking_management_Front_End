import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DashboardPage.css';

function AllocationFormPage({ isModal = false, onClose }) {
  const [allocation, setAllocation] = useState({
    numberPlate: '',
    parkingLotNumber: '',
    allocatedDays: '',
    fromDate: '',
    location: '',
    chargeType: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [lots, setLots] = useState([]);
  const [allocatedVehicles, setAllocatedVehicles] = useState([]);
  const [allocatedLots, setAllocatedLots] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('success');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const email = localStorage.getItem("email");

    if (!token && !isModal) {
      navigate('/login');
      return;
    }

    const fetchVehicles = async () => {
      try {
        const res = await fetch(`http://localhost:8080/vehicleuser?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setVehicles(await res.json());
      } catch (err) {
        console.error("Error loading vehicles", err);
      }
    };

    const fetchParkingLots = async () => {
      try {
        const res = await fetch("http://localhost:8080/parking-lots", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setLots(await res.json());
      } catch (err) {
        console.error("Error loading parking lots", err);
      }
    };

    const fetchAllocations = async () => {
      try {
        const res = await fetch("http://localhost:8080/allocations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAllocatedVehicles(data.map(a => a.vehicle?.numberPlate));
          setAllocatedLots(data.map(a => a.parkingLot?.lotNumber));
        }
      } catch (err) {
        console.error("Error loading allocations", err);
      }
    };

    fetchVehicles();
    fetchParkingLots();
    fetchAllocations();
  }, [isModal, navigate]);

  const handleChange = (e) => {
    setAllocation({ ...allocation, [e.target.name]: e.target.value });
  };

  const showModalMessage = (title, message, type = 'success') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      if (type === 'success' && isModal && onClose) onClose();
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      showModalMessage("Unauthorized", "Please log in.", 'error');
      return;
    }

    const payload = {
      vehicle: { numberPlate: allocation.numberPlate },
      parkingLot: { lotNumber: allocation.parkingLotNumber },
      allocatedDays: allocation.allocatedDays,
      fromDate: allocation.fromDate,
      location: allocation.location,
      chargeType: allocation.chargeType
    };

    try {
      const res = await fetch("http://localhost:8080/allocations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        showModalMessage("Unauthorized", "Please login again.", 'error');
        localStorage.removeItem("jwtToken");
        setTimeout(() => window.location.href = "/login", 1500);
        return;
      }

      if (res.ok) {
        showModalMessage("Success", "Parking allocated successfully.", 'success');
        setAllocation({ numberPlate: '', parkingLotNumber: '', allocatedDays: '', fromDate: '' });

        const updated = await fetch("http://localhost:8080/allocations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (updated.ok) {
          const data = await updated.json();
          setAllocatedVehicles(data.map(a => a.vehicle?.numberPlate));
          setAllocatedLots(data.map(a => a.parkingLot?.lotNumber));
        }
      } else {
        const errorText = await res.text();
        showModalMessage("Error", errorText || "Allocation failed.", 'error');
      }
    } catch (err) {
      showModalMessage("Error", "Something went wrong.", 'error');
      console.error("Submission error:", err);
    }
  };

  return (
    <div className={isModal ? '' : 'container mt-5'}>
      <form onSubmit={handleSubmit}>


        <div className="mb-3">
          <label className="form-label">Location</label>
          <select
            className="form-select"
            name="location"
            value={allocation.location || ''}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Location --</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Maharastra">Maharastra</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Kolkata">Kolkata</option>

          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Vehicle</label>
          <select
            className="form-select"
            name="numberPlate"
            value={allocation.numberPlate}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.filter(v => !allocatedVehicles.includes(v.numberPlate)).map(v => (
              <option key={v.numberPlate} value={v.numberPlate}>
                {v.numberPlate} - {v.vehicleType}
              </option>
            ))}
          </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Parking Lot</label>
          <select
            className="form-select"
            name="parkingLotNumber"
            value={allocation.parkingLotNumber}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Lot --</option>
            {lots.filter(lot => !allocatedLots.includes(lot.lotNumber || lot.parkingLotNumber)).map(lot => (
              <option key={lot.lotNumber || lot.parkingLotNumber} value={lot.lotNumber || lot.parkingLotNumber}>
                {lot.lotNumber || lot.parkingLotNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Charge Type</label>
          <select
            className="form-select"
            name="chargeType"
            value={allocation.chargeType}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Charge Type --</option>
            <option value="HOURLY">Hourly</option>
            <option value="DAILY">Daily</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Period Of time/days</label>
          <input
            type="number"
            min="1"
            className="form-control"
            name="allocatedDays"
            placeholder="e.g. 2"
            value={allocation.allocatedDays}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="mb-3">
          <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-control"
            name="fromDate"
            value={allocation.fromDate}
            onChange={handleChange}
            required
          />
        </div> */}
        <div className="mb-3">
          <label className="form-label">From Date</label>
        <input

          type="datetime-local"
          className="form-control"
          name="fromDate"
          value={allocation.fromDate}
          onChange={handleChange}
          min={new Date().toISOString().slice(0,16)}
          required
        />
         </div> 



        <button type="submit" className="btn btn-success w-100">Allocate Parking</button>
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
              <div className={`modal-header ${modalType === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>{modalType === 'success' ? '✅' : '❌'} {modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-primary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}




    </div>
  );
}

export default AllocationFormPage;
