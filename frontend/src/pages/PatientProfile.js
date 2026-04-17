import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function PatientProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    gender: "Male",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(response.data.user);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      dispatch({ type: "UPDATE_PROFILE", payload: response.data.user });
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/patient-dashboard")}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition duration-200"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">Patient Profile</h1>
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
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile.name?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name || "Patient"}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">Patient Account</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                      {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not provided"}
                    </p>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{profile.zipCode || "Not provided"}</p>
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
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={profile.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={profile.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            {!isEditing ? (
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50"
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
                    fetchProfile();
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

export default PatientProfile;
