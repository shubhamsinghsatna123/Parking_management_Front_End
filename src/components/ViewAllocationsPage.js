// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Link } from 'react-router-dom';

// function ViewAllocationsPage() {
//   const [allocations, setAllocations] = useState([]);

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [modalTitle, setModalTitle] = useState('');
//   const [modalMessage, setModalMessage] = useState('');
//   const [modalType, setModalType] = useState('success'); // 'success' or 'error'

//   // Function to show modal and auto-close it
//   const showModalMessage = (title, message, type = 'success') => {
//     setModalTitle(title);
//     setModalMessage(message);
//     setModalType(type);
//     setShowModal(true);

//     // Auto-close modal after 2.5 seconds
//     setTimeout(() => {
//       setShowModal(false);

//       // Redirect to login if needed
//       if (title === "Unauthorized" || title === "Session Expired") {
//         window.location.href = "/login";
//       }
//     }, 2500);
//   };

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const token = localStorage.getItem("jwtToken");
//         const email = localStorage.getItem("email");

//         if (!token) {
//           showModalMessage("Unauthorized", "You must be logged in to view allocations.", 'error');
//           return;
//         }

//         const response = await fetch(`http://localhost:8080/allocationsuser?email=${email}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log(data);
          
//           setAllocations(Array.isArray(data) ? data : []);

//           if (Array.isArray(data) && data.length === 0) {
//             showModalMessage("Notice", "No allocations found.", 'success');
//           } else {
//             showModalMessage("Success", "Allocations fetched successfully.", 'success');
//           }
//         } else if (response.status === 401) {
//           showModalMessage("Session Expired", "Session expired. Please log in again.", 'error');
//           localStorage.clear();
//         } else {
//           showModalMessage("Error", "Failed to fetch allocations. Status: " + response.status, 'error');
//         }
//       } catch (error) {
//         console.error("Error fetching allocations:", error);
//         showModalMessage("Error", "Something went wrong while fetching data.", 'error');
//       }
//     }

//     fetchData();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Parking Allocations</h2>

//       <div className="table-responsive">
//         <table className="table table-bordered table-hover table-striped align-middle text-center">
//           <thead className="table-dark">
//             <tr>
//               <th>Allocation ID</th>
//               <th>Number Plate</th>
//               <th>Parking Lot</th>
//               <th>Days</th>
//               <th>From Date</th>
//               <th>Upto Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allocations.length > 0 ? (
//               allocations.map((a) => (
//                 <tr key={a.allocationId}>
//                   <td>{a.allocationId || 'N/A'}</td>
//                   <td>{a.vehicle?.numberPlate || 'N/A'}</td>
//                   <td>{a.parkingLot?.parkingLotNumber || a.parkingLot?.lotNumber || 'N/A'}</td>
//                   <td>{Array.isArray(a.allocatedDays) ? a.allocatedDays.join(', ') : a.allocatedDays || 'N/A'}</td>
//                   <td>{a.fromDate || 'N/A'}</td>
//                   <td>{a.uptoDate || 'N/A'}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6">No allocations found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <br />
//       <button className="btn btn-secondary mt-3">
//         <Link to="/" className="text-white text-decoration-none">Back</Link>
//       </button>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className={`modal-header ${modalType === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
//                 <h5 className="modal-title">{modalTitle}</h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   aria-label="Close"
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <div className={`modal-body ${modalType === 'success' ? 'text-success' : 'text-danger'}`}>
//                 <p>{modalType === 'success' ? '✅' : '❌'} {modalMessage}</p>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ViewAllocationsPage;
