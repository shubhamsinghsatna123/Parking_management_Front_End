import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Logout() {
  const [showConfirm] = useState(true); // Removed setShowConfirm to fix ESLint warning
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      {showConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Logout Confirmation</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleLogout}>Yes, Log out</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logout;
