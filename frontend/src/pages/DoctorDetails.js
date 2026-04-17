import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700">Loading doctor profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700">Doctor profile not found.</div>
      </div>
    );
  }

  const user = doctor.user || doctor.userId || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dr. {user.name || doctor.specialization}</h1>
            <p className="text-blue-100 mt-2">{doctor.specialization} • {user.city || "City not provided"}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "D"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dr. {user.name || doctor.specialization}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Hospital</p>
                <p className="text-gray-900">{doctor.hospital || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultation Fee</p>
                <p className="text-gray-900">₹{doctor.consultationFees || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-gray-900">{doctor.experienceYears || 0} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-gray-900">⭐ {doctor.rating?.toFixed(1) || 0} ({doctor.totalReviews || 0} reviews)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-700 leading-7">{doctor.bio || "No profile description available."}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Qualifications & Languages</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Qualifications</p>
                  {doctor.qualifications?.length ? (
                    <ul className="list-disc list-inside text-gray-700">
                      {doctor.qualifications.map((qualification, idx) => (
                        <li key={idx}>{qualification}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Languages</p>
                  {doctor.languages?.length ? (
                    <p className="text-gray-700">{doctor.languages.join(", ")}</p>
                  ) : (
                    <p className="text-gray-700">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Availability</h2>
              {doctor.availability?.length ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {doctor.availability.map((slot, idx) => (
                    <div key={idx} className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                      <p className="font-semibold text-gray-900">{slot.day}</p>
                      <p className="text-gray-700">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">No availability set yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
