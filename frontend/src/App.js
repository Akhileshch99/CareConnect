import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Appointment from "./pages/Appointment";
import HospitalSearch from "./pages/HospitalSearch";
import PharmacySearch from "./pages/PharmacySearch";
import DoctorSearch from "./pages/DoctorSearch";
import EmergencySearch from "./pages/EmergencySearch";
import PatientProfile from "./pages/PatientProfile";
import DoctorProfile from "./pages/DoctorProfile";
import HealthBlogs from "./pages/HealthBlogs";
import About from "./pages/About";

const VideoCall = lazy(() => import("./pages/VideoCall"));
const DoctorDetails = lazy(() => import("./pages/DoctorDetails"));

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/video-call" element={<PrivateRoute><VideoCall /></PrivateRoute>} />
            <Route path="/patient-dashboard" element={<PrivateRoute><PatientDashboard /></PrivateRoute>} />
            <Route path="/doctor-dashboard" element={<PrivateRoute><DoctorDashboard /></PrivateRoute>} />
            <Route path="/appointment" element={<PrivateRoute><Appointment /></PrivateRoute>} />
            <Route path="/hospital-search" element={<HospitalSearch />} />
            <Route path="/pharmacy-search" element={<PharmacySearch />} />
            <Route path="/doctor-search" element={<DoctorSearch />} />
            <Route path="/doctor/:id" element={<DoctorDetails />} />
            <Route path="/emergency" element={<EmergencySearch />} />
            <Route path="/patient-profile" element={<PrivateRoute><PatientProfile /></PrivateRoute>} />
            <Route path="/doctor-profile" element={<PrivateRoute><DoctorProfile /></PrivateRoute>} />
            <Route path="/blogs" element={<HealthBlogs />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
