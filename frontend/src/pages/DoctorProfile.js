import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function DoctorProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    gender: "Male",
  });

  const [doctorProfile, setDoctorProfile] = useState({
    specialization: "",
    experienceYears: 0,
    qualifications: [],
    licenseNumber: "",
    hospital: "",
    consultationFees: 0,
    bio: "",
    languages: [],
    rating: 0,
    totalReviews: 0,
  });

  const defaultAvailability = [
    { day: "Monday", startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", startTime: "09:00", endTime: "17:00" },
    { day: "Friday", startTime: "09:00", endTime: "17:00" },
    { day: "Saturday", startTime: "09:00", endTime: "13:00" },
  ];

  const [availability, setAvailability] = useState(defaultAvailability);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data.user);

      if (response.data.doctorProfile) {
        setDoctorProfile(response.data.doctorProfile);
        const availabilityData = response.data.doctorProfile.availability;
        setAvailability(
          Array.isArray(availabilityData) && availabilityData.length > 0
            ? availabilityData
            : defaultAvailability
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorProfile((prev) => ({
      ...prev,
      [name]: value === "true" ? true : value === "false" ? false : value,
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = availability.map((slot, idx) =>
      idx === index ? { ...slot, [field]: value } : slot
    );
    setAvailability(newAvailability);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Update user profile
      await axios.put(
        "http://localhost:5000/api/auth/profile",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update doctor profile
      await axios.put(
        "http://localhost:5000/api/doctors/profile",
        doctorProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update availability
      await axios.put(
        "http://localhost:5000/api/doctors/availability",
        { availability },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
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
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/doctor-dashboard")}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">Doctor Profile</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile.name?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name || "Doctor"}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">Medical Professional</p>
              {doctorProfile.rating > 0 && (
                <p className="text-sm text-yellow-600 font-semibold">
                  ⭐ {doctorProfile.rating.toFixed(1)} ({doctorProfile.totalReviews} reviews)
                </p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>

            {!isEditing ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.gender || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.address || "Not provided"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-3 rounded-lg text-sm">{profile.city || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-3 rounded-lg text-sm">{profile.state || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Professional Information */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Professional Information</h3>

            {!isEditing ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{doctorProfile.specialization || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{doctorProfile.experienceYears || 0} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{doctorProfile.licenseNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{doctorProfile.hospital || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">₹{doctorProfile.consultationFees || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      ⭐ {doctorProfile.rating.toFixed(1)} ({doctorProfile.totalReviews} reviews)
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg min-h-[80px]">{doctorProfile.bio || "Not provided"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      name="specialization"
                      value={doctorProfile.specialization}
                      onChange={handleDoctorChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                    <input
                      type="number"
                      name="experienceYears"
                      value={doctorProfile.experienceYears}
                      onChange={handleDoctorChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={doctorProfile.licenseNumber}
                      onChange={handleDoctorChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hospital</label>
                    <input
                      type="text"
                      name="hospital"
                      value={doctorProfile.hospital}
                      onChange={handleDoctorChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fees (₹)</label>
                    <input
                      type="number"
                      name="consultationFees"
                      value={doctorProfile.consultationFees}
                      onChange={handleDoctorChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={doctorProfile.bio}
                      onChange={handleDoctorChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Availability */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Availability Schedule</h3>

            {isEditing ? (
              <div className="space-y-4">
                {availability.map((slot, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-24">
                      <span className="font-semibold text-gray-700">{slot.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          handleAvailabilityChange(index, "startTime", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          handleAvailabilityChange(index, "endTime", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {availability.map((slot, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">{slot.day}</span>
                    <span className="text-gray-900">{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            {!isEditing ? (
              <button
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200"
                  onClick={() => {
                    setIsEditing(false);
                    fetchDoctorProfile();
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
