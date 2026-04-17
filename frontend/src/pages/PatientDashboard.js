import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function PatientDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchAppointments();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/appointments/my/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-blue-100">Welcome back, {user?.name || "Patient"}!</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/patient-profile")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => navigate("/doctor-search")}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 text-center cursor-pointer"
          >
            <div className="text-4xl mb-3">👨‍⚕️</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Search Doctor</h3>
            <p className="text-gray-600 text-sm">Find and book appointments</p>
          </div>

          <div
            onClick={() => navigate("/hospital-search")}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 text-center cursor-pointer"
          >
            <div className="text-4xl mb-3">🏥</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Find Hospital</h3>
            <p className="text-gray-600 text-sm">Locate nearby hospitals</p>
          </div>

          <div
            onClick={() => navigate("/pharmacy-search")}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 text-center cursor-pointer"
          >
            <div className="text-4xl mb-3">💊</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Find Pharmacy</h3>
            <p className="text-gray-600 text-sm">Order medicines online</p>
          </div>

          <div
            onClick={() => navigate("/emergency")}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 text-center cursor-pointer"
          >
            <div className="text-4xl mb-3">🚑</div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Emergency</h3>
            <p className="text-gray-600 text-sm">24/7 emergency services</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Doctor Search</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter doctor name or specialization..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => navigate(`/doctor-search?q=${doctorSearch}`)}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* My Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Appointments</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        Dr. {apt.doctorId?.userId?.name || "Doctor"}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        {new Date(apt.date).toLocaleDateString()} at {apt.time}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          apt.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : apt.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    {apt.status === "confirmed" && (
                      <button
                        onClick={() => navigate(`/video-call?appointmentId=${apt._id}`)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Join Call
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No appointments yet.</p>
              <button
                onClick={() => navigate("/doctor-search")}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>

        {/* Health Tracker */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Tracker</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Blood Pressure (mmHg)"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Blood Sugar (mg/dL)"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Weight (kg)"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Save Health Record
          </button>
        </div>

        {/* Medicine Reminder */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Medicine Reminder</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Medicine name"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;