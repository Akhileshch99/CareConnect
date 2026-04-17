import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Appointment() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");

  useEffect(() => {
    fetchAppointments();
  }, []);

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
      alert("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (appointmentId, amount, paymentMethod) => {
    try {
      // Create payment order
      const orderResponse = await axios.post(
        "http://localhost:5000/api/payments/checkout",
        {
          appointmentId,
          amount,
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (paymentMethod === "cash") {
        fetchAppointments();
        setShowPaymentModal(false);
        alert("Cash payment recorded! Appointment confirmed.");
        return;
      }

      // In real app, integrate with Razorpay
      alert("Payment functionality - Integrate with Razorpay for production");

      // For demo, directly verify payment
      await axios.post(
        "http://localhost:5000/api/payments/verify",
        {
          appointmentId,
          razorpay_payment_id: "demo_payment_id",
          razorpay_order_id: orderResponse.data.order.id,
          razorpay_signature: "demo_signature",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchAppointments();
      setShowPaymentModal(false);
      alert("Payment successful! Appointment confirmed.");
    } catch (err) {
      alert("Payment failed: " + err.response?.data?.message);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.put(
          `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchAppointments();
        alert("Appointment cancelled successfully");
      } catch (err) {
        alert("Failed to cancel appointment");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
              <p className="text-blue-100">Manage your healthcare appointments</p>
            </div>
            <button
              onClick={() => navigate("/doctor-search")}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 flex items-center gap-2"
            >
              <span>+</span> Book New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading appointments...</span>
          </div>
        ) : appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">👨‍⚕️</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        Dr. {apt.doctorId?.userId?.name || "N/A"}
                      </h3>
                      <p className="text-blue-100 text-sm">{apt.doctorId?.specialization}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Date:</span>
                      <span className="text-gray-900">{new Date(apt.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Time:</span>
                      <span className="text-gray-900">{apt.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Fee:</span>
                      <span className="text-gray-900 font-semibold">₹{apt.consultationFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Reason:</span>
                      <span className="text-gray-900">{apt.reason || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(apt.paymentStatus)}`}>
                      {apt.paymentStatus.charAt(0).toUpperCase() + apt.paymentStatus.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {apt.status === "confirmed" && (
                      <button
                        onClick={() => navigate(`/video-call?appointmentId=${apt._id}`)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center justify-center gap-2"
                      >
                        <span>📹</span> Join Call
                      </button>
                    )}
                    {apt.paymentStatus === "unpaid" && (
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setShowPaymentModal(true);
                        }}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                      >
                        Pay Now
                      </button>
                    )}
                    {apt.status !== "completed" && apt.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancelAppointment(apt._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Appointments Yet</h3>
            <p className="text-gray-600 mb-6">You haven't booked any appointments. Start your healthcare journey today!</p>
            <button
              onClick={() => navigate("/doctor-search")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
            >
              Book Your First Appointment
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
              <h3 className="text-xl font-bold">Payment Confirmation</h3>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-semibold">Dr. {selectedAppointment.doctorId?.userId?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-semibold">{selectedAppointment.doctorId?.specialization}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{new Date(selectedAppointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{selectedAppointment.time}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Online Payment (Razorpay)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Cash Payment (Pay at clinic)</span>
                    </label>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-2xl text-green-600">₹{selectedAppointment.consultationFee}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handlePayment(selectedAppointment._id, selectedAppointment.consultationFee, paymentMethod)
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-200"
                >
                  {paymentMethod === "cash" ? "Confirm Cash Payment" : "Pay Now"}
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointment;
