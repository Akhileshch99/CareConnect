import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctors/search?limit=6");
      setFeaturedDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (location.trim()) params.set("city", location.trim());
    navigate(`/doctor-search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            CareConnect
          </Link>

          <div className="hidden lg:flex gap-8 text-gray-700 font-medium">
            <Link to="/doctor-search" className="hover:text-blue-600 transition">Find Doctors</Link>
            <Link to="/hospital-search" className="hover:text-blue-600 transition">Hospitals</Link>
            <Link to="/pharmacy-search" className="hover:text-blue-600 transition">Pharmacy</Link>
            <Link to="/blogs" className="hover:text-blue-600 transition">Health Blogs</Link>
            <Link to="/about" className="hover:text-blue-600 transition">About</Link>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-blue-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Your Health, Our Priority</h1>
          <p className="text-xl text-blue-100 mb-8">Connect with healthcare professionals anytime, anywhere</p>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="📍 City or Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="text"
                placeholder="🔍 Search doctors, hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 md:col-span-2"
              />
              <button
                className="md:col-span-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Services */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">Our Services</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">Everything you need for your healthcare in one place</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/video-call" className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 p-8 text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">📹</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Video Consultation</h3>
            <p className="text-gray-600 text-sm">Connect with doctors instantly from home</p>
          </Link>

          <Link to="/doctor-search" className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 p-8 text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">👨‍⚕️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Find Doctors</h3>
            <p className="text-gray-600 text-sm">Search & book appointments with specialists</p>
          </Link>

          <Link to="/hospital-search" className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 p-8 text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">🏥</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hospitals</h3>
            <p className="text-gray-600 text-sm">Find top-rated hospitals near you</p>
          </Link>

          <Link to="/pharmacy-search" className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 p-8 text-center">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">💊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pharmacy</h3>
            <p className="text-gray-600 text-sm">Order medicines with doorstep delivery</p>
          </Link>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          to="/emergency"
          className="block bg-gradient-to-r from-red-600 to-red-700 text-white text-center py-6 rounded-2xl text-xl font-bold hover:shadow-2xl transition transform hover:scale-105"
        >
          🚑 Emergency & Ambulance Services
        </Link>
      </div>

      {/* Featured Doctors Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Doctors</h2>
        <p className="text-gray-600 mb-12">Top healthcare professionals with excellent ratings</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading doctors...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredDoctors.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full mb-4 flex items-center justify-center text-white text-xl font-bold">
                  {doctor.user?.name?.charAt(0) || "D"}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {doctor.user?.name || doctor.specialization}
                </h3>
                <p className="text-gray-600 text-sm mb-1">{doctor.specialization}</p>
                <p className="text-gray-500 text-xs mb-4">Experience: {doctor.experienceYears} years</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-yellow-500">⭐ {doctor.rating.toFixed(1)}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
                </div>

                {/* Availability Schedule */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Today's Schedule:</h4>
                  <div className="space-y-1">
                    {doctor.availability && doctor.availability.length > 0 ? (
                      doctor.availability.slice(0, 3).map((slot, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-600">
                          <span>{slot.day}:</span>
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">Schedule not available</p>
                    )}
                  </div>
                </div>

                <Link
                  to="/doctor-search"
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition text-center block"
                >
                  Book Appointment
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Health Blogs Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Health & Wellness Tips</h2>
            <p className="text-gray-600 mt-2">Expert advice and health information</p>
          </div>
          <Link
            to="/blogs"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "Heart Health Tips", cat: "Cardiovascular", idx: 1 },
            { title: "Healthy Skin Guide", cat: "Dermatology", idx: 2 },
            { title: "Boost Your Immunity", cat: "Wellness", idx: 3 },
          ].map((blog) => (
            <div key={blog.idx} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-blue-400 to-teal-400 group-hover:scale-105 transition"></div>
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  {blog.cat}
                </span>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn expert tips and practical advice to improve your health and wellbeing.
                </p>
                <Link
                  to="/blogs"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 py-16 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose CareConnect?</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-bold text-gray-900 mb-2">Verified Professionals</h3>
              <p className="text-gray-600 text-sm">All doctors are licensed and verified</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your data is encrypted and confidential</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">Quick Appointments</h3>
              <p className="text-gray-600 text-sm">Book in minutes with instant confirmation</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Round-the-clock customer service</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 text-lg mb-8">Join thousands of patients who trust CareConnect for their healthcare needs</p>
        <Link
          to="/register"
          className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition transform hover:scale-105"
        >
          Create Your Free Account
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">CareConnect</h3>
              <p className="text-sm">Your trusted online healthcare platform</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="text-sm space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/doctor-search" className="hover:text-white">Find Doctors</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="text-sm space-y-2">
                <li><Link to="/blogs" className="hover:text-white">Health Blogs</Link></li>
                <li><Link to="/hospital-search" className="hover:text-white">Hospitals</Link></li>
                <li><Link to="/pharmacy-search" className="hover:text-white">Pharmacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <p className="text-sm mb-2">Email: support@careconnect.com</p>
              <p className="text-sm">Phone: +91-1234-567-890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>&copy; 2026 CareConnect. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;