import React, { useState } from "react";
import axios from "axios";

function About() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About CareConnect</h1>
          <p className="text-xl text-blue-100">Connecting Healthcare Professionals with Patients</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              CareConnect is revolutionizing healthcare by bridging the gap between patients and medical professionals. 
              We provide a comprehensive platform where patients can easily find and consult with qualified doctors, 
              hospitals, and pharmacies all in one place.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our goal is to make healthcare accessible, affordable, and convenient for everyone.
            </p>
          </div>
          <div className="bg-blue-100 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏥</div>
              <p className="text-gray-700 font-semibold">Healthcare at Your Fingertips</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "👨‍⚕️", title: "Find Doctors", desc: "Search and connect with specialists" },
              { icon: "🏥", title: "Hospital Network", desc: "Access trusted hospitals near you" },
              { icon: "💊", title: "Pharmacy Services", desc: "Order medicines conveniently" },
              { icon: "📹", title: "Video Consultation", desc: "Consult doctors from home" },
              { icon: "📅", title: "Appointments", desc: "Easy booking and scheduling" },
              { icon: "🚑", title: "Emergency Help", desc: "24/7 emergency services" },
              { icon: "📋", title: "Prescriptions", desc: "Manage your medical records" },
              { icon: "📚", title: "Health Tips", desc: "Expert health & wellness advice" }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-blue-50 rounded-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose CareConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">✓</div>
                <h3 className="text-lg font-bold text-gray-900">Verified Professionals</h3>
              </div>
              <p className="text-gray-700">All doctors and hospitals are verified and licensed</p>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">✓</div>
                <h3 className="text-lg font-bold text-gray-900">24/7 Support</h3>
              </div>
              <p className="text-gray-700">Round-the-clock customer support for your needs</p>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">✓</div>
                <h3 className="text-lg font-bold text-gray-900">Secure & Private</h3>
              </div>
              <p className="text-gray-700">Your medical data is encrypted and confidential</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Get in Touch</h2>
          <p className="text-center text-gray-600 mb-8">Have questions? We'd love to hear from you</p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">✓ Message sent successfully! We'll get back to you soon.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="font-bold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-700">Healthcare Hub, Medical City, India</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-700">+91-1234-567-890</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700">support@careconnect.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
