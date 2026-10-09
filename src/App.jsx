import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import AddFood from './pages/AddFood';
import MyDonations from './pages/MyDonations';
import OrganizationDashboard from './pages/OrganizationDashboard';
import Pickups from './pages/Pickups';
import Impact from './pages/Impact';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/organization" element={<OrganizationDashboard />} />
        <Route path="/pickups" element={<Pickups />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
