import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function DoctorSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useSelector((state) => state.user);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [specialization, setSpecialization] = useState("");
  const [minFees, setMinFees] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    reason: "",
    paymentMethod: "online"
  });

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (specialization) params.append("specialization", specialization);
      if (minFees) params.append("minFees", minFees);
      if (maxFees) params.append("maxFees", maxFees);

      const res = await axios.get(
        `http://localhost:5000/api/doctors/search?${params}`
      );
      setResults(res.data);
    } catch (error) {
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!token) {
      alert("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!bookingData.date || !bookingData.time) {
      alert("Please select date and time");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId: selectedDoctor._id,
          date: bookingData.date,
          time: bookingData.time,
          reason: bookingData.reason,
          paymentMethod: bookingData.paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Appointment booked successfully!");
      setSelectedDoctor(null);
      setBookingData({ date: "", time: "", reason: "", paymentMethod: "online" });
      navigate("/patient-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Find a Doctor</h1>
          <p className="text-blue-100 text-lg">Book appointments with qualified healthcare professionals</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Search Filters</h3>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  >
                    <option value="">All Specializations</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Urology">Urology</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Fee
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="₹0"
                      value={minFees}
                      onChange={(e) => setMinFees(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Fee
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="₹5000"
                      value={maxFees}
                      onChange={(e) => setMaxFees(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search Doctors"}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Doctors ({results.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Searching for doctors...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((doctor) => (
                  <div key={doctor._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {doctor.user?.name?.charAt(0) || "D"}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {doctor.user?.name || doctor.userId?.name || "Dr. " + doctor.specialization}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-600">
                              <span className="font-semibold">Specialization:</span> {doctor.specialization}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Experience:</span> {doctor.experienceYears} years
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Hospital:</span> {doctor.hospital || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              <span className="font-semibold">Consultation Fee:</span> ₹{doctor.consultationFees}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Rating:</span> ⭐ {doctor.rating.toFixed(1)} ({doctor.totalReviews} reviews)
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{doctor.bio}</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition duration-200"
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          Book Appointment
                        </button>
                        <button
                          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                          onClick={() => navigate(`/doctor/${doctor._id}`)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-500">Try adjusting your search filters to find more doctors.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Book Appointment
              </h3>
              <p className="text-gray-600 mb-6">
                with {selectedDoctor.user?.name || "Dr. " + selectedDoctor.specialization}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.date}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={bookingData.time}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, time: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Consultation
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    placeholder="Describe your symptoms or reason for visit"
                    value={bookingData.reason}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, reason: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={bookingData.paymentMethod === "online"}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, paymentMethod: e.target.value })
                        }
                        className="mr-2"
                      />
                      <span className="text-gray-700">Online Payment (Razorpay)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={bookingData.paymentMethod === "cash"}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, paymentMethod: e.target.value })
                        }
                        className="mr-2"
                      />
                      <span className="text-gray-700">Cash Payment (Pay at clinic)</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-semibold">
                    Consultation Fee: ₹{selectedDoctor.consultationFees}
                  </p>
                  {bookingData.paymentMethod === "cash" && (
                    <p className="text-blue-600 text-sm mt-1">
                      Pay cash at the clinic during your appointment
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200"
                  onClick={handleBookAppointment}
                >
                  Confirm Booking
                </button>
                <button
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                  onClick={() => setSelectedDoctor(null)}
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

export default DoctorSearch;
