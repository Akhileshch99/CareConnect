import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function DoctorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

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

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
    } catch (err) {
      alert("Failed to update appointment");
    }
  };

  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length;
  const pendingAppointments = appointments.filter((a) => a.status === "pending").length;
  const completedAppointments = appointments.filter((a) => a.status === "completed").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-blue-100">Welcome back, Dr. {user?.name || "Doctor"}!</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/doctor-profile")}
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{totalAppointments}</div>
            <p className="text-gray-600">Total Appointments</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{confirmedAppointments}</div>
            <p className="text-gray-600">Confirmed</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingAppointments}</div>
            <p className="text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">{completedAppointments}</div>
            <p className="text-gray-600">Completed</p>
          </div>
        </div>

        {/* Profile Management */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Management</h2>
          <p className="text-gray-600 mb-4">Update your professional information, qualifications, and consultation fees.</p>
          <button
            onClick={() => navigate("/doctor-profile")}
            className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointments</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{apt.patientId?.name || "N/A"}</td>
                      <td className="py-3 px-4">{new Date(apt.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{apt.time}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : apt.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : apt.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {apt.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateAppointmentStatus(apt._id, "confirmed")}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-700 transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(apt._id, "cancelled")}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {apt.status === "confirmed" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/video-call?appointmentId=${apt._id}`)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-700 transition"
                            >
                              Start Call
                            </button>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(apt._id, "completed")}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 transition"
                            >
                              Complete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No appointments scheduled yet.</p>
              <p className="text-sm text-gray-400">Patients will appear here when they book appointments with you.</p>
            </div>
          )}
        </div>

        {/* Upload Prescription */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Prescription</h2>
          <p className="text-gray-600 mb-4">Upload prescriptions for completed appointments.</p>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Appointment</option>
              {appointments
                .filter((a) => a.status === "completed")
                .map((apt) => (
                  <option key={apt._id} value={apt._id}>
                    {apt.patientId?.name || "N/A"} - {new Date(apt.date).toLocaleDateString()}
                  </option>
                ))}
            </select>
            <input
              type="file"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Upload Prescription
          </button>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Earnings Summary</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <p className="text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">Total Earnings (This Month)</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{appointments
                    .filter((a) => a.status === "completed")
                    .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)}
                </p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <p className="text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ₹{appointments
                    .filter((a) => a.paymentStatus === "unpaid")
                    .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-blue-600">⭐ 4.5 (25 reviews)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;