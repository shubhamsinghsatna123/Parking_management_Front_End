import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardPage from './components/DashboardPage';
import VehicleFormPage from './components/VehicleFormPage';
import AllocationFormPage from './components/AllocationFormPage';
// import ViewAllocationsPage from './components/ViewAllocationsPage';
import ViewAllocationsPage1 from './components/ViewAllocationsPage1';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import Logout from './components/Logout';



function App() {
  return (
    
    <BrowserRouter  >
      <Routes  >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vehicle" element={<VehicleFormPage />} />
        <Route path="/allocate" element={<AllocationFormPage />} />
        {/* <Route path="/allocations" element={<ViewAllocationsPage />} /> */}
        <Route path="/allocations" element={<ViewAllocationsPage1 />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route path="/myAdmin" element={<AdminPanel />} />
        <Route path="/myUser" element={<UserPanel />} />
        <Route path="/logout" element={<Logout />} />
     
    


      </Routes>
    </BrowserRouter>
  
  );
}

export default App;
