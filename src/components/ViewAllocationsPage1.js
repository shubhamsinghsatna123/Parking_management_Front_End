import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function ViewAllocationsPage1() {
  const [allocations, setAllocations] = useState([]);
  const [filteredAllocations, setFilteredAllocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const showModalMessage = (title, message, type = 'success') => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      if (title === "Unauthorized" || title === "Session Expired") {
        window.location.href = "/login";
      }
    }, 2500);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("jwtToken");
        const role = localStorage.getItem("role");
        const email = localStorage.getItem("email");

        if (!token) {
          showModalMessage("Unauthorized", "You must be logged in to view allocations.", 'error');
          return;
        }

        const url = role?.toLowerCase() === "admin"
          ? "http://localhost:8080/allocations"
          : `http://localhost:8080/allocationsuser?email=${encodeURIComponent(email)}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const text = await response.text();
          const data = text ? JSON.parse(text) : [];
          const safeData = Array.isArray(data) ? data : [];
          setAllocations(safeData);
          setFilteredAllocations(safeData); // initialize filtered list

          showModalMessage("Success", safeData.length === 0 ? "No allocations found." : "Allocations fetched successfully.", 'success');
        } else if (response.status === 401) {
          showModalMessage("Session Expired", "Session expired. Please log in again.", 'error');
          localStorage.clear();
        } else {
          showModalMessage("Error", `Failed to fetch allocations. Status: ${response.status}`, 'error');
        }
      } catch (error) {
        console.error("Error fetching allocations:", error);
        showModalMessage("Error", "Something went wrong while fetching data.", 'error');
      }
    }

    fetchData();
  }, []);

  // const handleSearch = () => {
  //   const query = searchQuery.trim().toLowerCase();
  //   if (!query) {
  //     setFilteredAllocations(allocations);
  //     return;
  //   }

    

  //   const filtered = allocations.filter(a =>
  //     (a.vehicle?.numberPlate || '').toLowerCase().includes(query) ||
  //     (a.parkingLot?.lotNumber || a.parkingLot?.parkingLotNumber || '').toLowerCase().includes(query) ||
  //     (a.chargeType || '').toLowerCase().includes(query) ||
  //     (a.location || '').toLowerCase().includes(query)
  //   );

  //   setFilteredAllocations(filtered);
  // };


  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredAllocations(allocations);
      return;
    }

    const filtered = allocations.filter(a =>
      a.allocationId?.toString().toLowerCase().includes(query) ||
      a.vehicle?.numberPlate?.toLowerCase().includes(query)||
       (a.parkingLot?.lotNumber || a.parkingLot?.parkingLotNumber || '').toLowerCase().includes(query) ||
      (a.chargeType || '').toLowerCase().includes(query) ||
      (a.location || '').toLowerCase().includes(query)
    );

    setFilteredAllocations(filtered);
  };


  const handleReset = () => {
    setSearchQuery('');
    setFilteredAllocations(allocations);
  };

  const handleEdit = (allocation) => {
    alert(`Edit functionality for Allocation ID: ${allocation.allocationId} is coming soon!`);
  };

  const handleDelete = async (allocationId) => {
    if (!window.confirm("Are you sure you want to delete this allocation?")) return;

    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`http://localhost:8080/allocations/${allocationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        showModalMessage("Deleted", "Allocation deleted successfully.", 'success');
        setAllocations(prev => prev.filter(item => item.allocationId !== allocationId));
        setFilteredAllocations(prev => prev.filter(item => item.allocationId !== allocationId));
      } else {
        showModalMessage("Error", `Failed to delete. Status: ${response.status}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showModalMessage("Error", "Something went wrong while deleting.", 'error');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Parking Allocations</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Number Plate, Lot, Charge Type, or Location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        <button className="btn btn-outline-secondary ms-2" onClick={handleReset}>Reset</button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Allocation ID</th>
              <th>Number Plate</th>
              <th>Parking Lot</th>
              <th>Period Of time/days</th>
              <th>From Date</th>
              <th>Upto Date</th>
              <th>Location</th>
              <th>Charge Type</th>
              <th>Charges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllocations.length > 0 ? (
              filteredAllocations.map((a) => (
                <tr key={a.allocationId}>
                  <td>{a.allocationId || 'N/A'}</td>
                  <td>{a.vehicle?.numberPlate || 'N/A'}</td>
                  <td>{a.parkingLot?.parkingLotNumber || a.parkingLot?.lotNumber || 'N/A'}</td>
                  <td>{a.allocatedDays} {a.chargeType}</td>
                  <td>{a.fromDate || 'N/A'}</td>
                  <td>{a.uptoDate || 'N/A'}</td>
                  <td>{a.location || 'N/A'}</td>
                  <td>{a.chargeType || 'N/A'}</td>
                  <td>{a.totalAmount || 'N/A'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(a)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.allocationId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="10">No allocations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Link to="/" className="btn btn-secondary mt-3">Back</Link>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${modalType === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className={`modal-body ${modalType === 'success' ? 'text-success' : 'text-danger'}`}>
                <p>{modalType === 'success' ? '✅' : '❌'} {modalMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAllocationsPage1;
