import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Footer from './Footer';
import VehicleFormPage from './VehicleFormPage';
import './DashboardPage.css';
import AllocationFormPage from './AllocationFormPage';
// import UserPanel from './UserPanel';

function DashboardPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVehicleFormModal, setShowVehicleFormModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showAllocationFormModal, setShowAllocationFormModal] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  // const [showUserManageModal, setShowUserManageModal] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedName = localStorage.getItem("name") || '';
    const storedRole = localStorage.getItem("role") || '';
    setIsLoggedIn(loggedIn);
    setUserName(storedName.toUpperCase());
    setRole(storedRole);
  }, []);

  const showModalMessage = (message) => {

    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {

    setShowModal(false);
    setModalMessage('');
  };

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setShowLogoutConfirmModal(true);
    } else {
      navigate("/login");
    }
  };

  const confirmLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName('');
    setRole('');
    setShowLogoutConfirmModal(false);
    // showModalMessage("You have been logged out.");
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
        <div className="container-fluid">
          <span className="navbar-brand">
            {!isLoggedIn ? "Dashboard" : `Welcome, ${userName}`}
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <button
                className="btn btn-outline-light me-2 my-1"
                onClick={() => {
                  if (isLoggedIn) {
                    setShowVehicleFormModal(true);
                  } else {
                    showModalMessage("Please login first to register a vehicle.");
                  }
                }}
              >
                Register Vehicle
              </button>

              <button
                className="btn btn-outline-light me-2 my-1"
                onClick={() => {
                  if (isLoggedIn) {
                    setShowAllocationFormModal(true);
                  } else {
                    showModalMessage("Please login first to allocate parking.");
                  }
                }}
              >
                Allocate Parking
              </button>

              <button
                className="btn btn-outline-light me-2 my-1"
                onClick={() => {
                  if (isLoggedIn) {
                    navigate("/allocations");
                  } else {
                    showModalMessage("Please login first to view allocations.");
                  }
                }}
              >
                View Allocations
              </button>

              {role.toLowerCase() === 'admin' && (
                <>
                  <button className="btn btn-outline-warning me-2 my-1" onClick={() => navigate("/myAdmin")}>
                    Admin Panel
                  </button>
                  {/* <button className="btn btn-outline-light me-2 my-1" onClick={() => setShowUserManageModal(true)}>
                    Manage Users
                  </button> */}
                  <button className="btn btn-outline-light me-2 my-1" onClick={() => navigate("/myUser")}>
                    Manage Users
                  </button>


                </>
              )}

              {(role.toLowerCase() === 'admin' || role.toLowerCase() === 'user') && (
                <button className="btn btn-outline-info me-2 my-1" onClick={() => setShowProfileModal(true)}>
                  My Profile
                </button>
              )}

              <button
                className={`btn ${isLoggedIn ? 'btn-danger' : 'btn-outline-warning'} me-2 my-1`}
                onClick={handleLoginLogout}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </ul>
          </div>
        </div>
      </nav>

      <div className="dashboard-bg" style={{ paddingTop: '100px' }}>
        <Home />
      </div>

      <Footer />

      {/* Notice Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Notice</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              {/* <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div> */}
            </div>
          </div>
        </div>
      )}

 {/* UserProfile Modal */}
      {/* {showUserManageModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Manage Users</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowUserManageModal(false)} />
              </div>
              <div className="modal-body">
                <UserPanel />
              </div>
            </div>
          </div>
        </div>
      )} */}


      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">User Profile</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body">
                <Profile />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Form Modal */}
      {showVehicleFormModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Register Vehicle</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowVehicleFormModal(false)} />
              </div>
              <div className="modal-body">
                <VehicleFormPage isModal={true} onClose={() => setShowVehicleFormModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allocation Form Modal */}
      {showAllocationFormModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Allocate Parking</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowAllocationFormModal(false)} />
              </div>
              <div className="modal-body">
                <AllocationFormPage isModal={true} onClose={() => setShowAllocationFormModal(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Logout</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to log out?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowLogoutConfirmModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmLogout}>Yes, Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardPage;
