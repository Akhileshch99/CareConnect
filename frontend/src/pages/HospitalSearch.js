import React, { useState, useEffect } from "react";
import axios from "axios";

function HospitalSearch() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    department: "",
    search: "",
  });

  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Gynecology",
    "General Surgery",
  ];

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/hospitals/search?";

      if (filters.search) url += `q=${encodeURIComponent(filters.search)}&`;
      if (filters.city) url += `city=${encodeURIComponent(filters.city)}&`;
      if (filters.department) url += `department=${encodeURIComponent(filters.department)}&`;

      const response = await axios.get(url);
      setHospitals(response.data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHospitals();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Find Hospitals</h1>
          <p className="text-green-100 text-lg">Locate healthcare facilities near you</p>
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
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="search"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search hospitals..."
                    value={filters.search}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter city name"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filters.department}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search Hospitals"}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Hospitals ({hospitals.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Searching for hospitals...</p>
              </div>
            ) : hospitals.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {hospitals.map((hospital) => (
                  <div key={hospital._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        🏥
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {hospital.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          📍 {hospital.city}, {hospital.state}
                        </p>
                        <p className="text-gray-600 text-sm">
                          📞 {hospital.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Total Beds:</span>
                          <span className="ml-2 text-gray-900">{hospital.beds}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Available:</span>
                          <span className="ml-2 text-green-600">{hospital.availableBeds}</span>
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700 text-sm">ICU Beds:</span>
                        <span className="ml-2 text-gray-900">{hospital.icuBeds}</span>
                      </div>

                      <div>
                        <span className="font-semibold text-gray-700 text-sm">Rating:</span>
                        <span className="ml-2 text-yellow-600 font-semibold">
                          ⭐ {hospital.rating || "N/A"}
                        </span>
                      </div>

                      {hospital.departments && hospital.departments.length > 0 && (
                        <div>
                          <span className="font-semibold text-gray-700 text-sm">Departments:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {hospital.departments.slice(0, 3).map((dept, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {dept}
                              </span>
                            ))}
                            {hospital.departments.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{hospital.departments.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm">
                        {hospital.hasEmergency && (
                          <span className="inline-flex items-center text-red-600">
                            🚑 Emergency
                          </span>
                        )}
                        {hospital.hasAmbulance && (
                          <span className="inline-flex items-center text-blue-600">
                            🚗 Ambulance
                          </span>
                        )}
                        {hospital.website && (
                          <span className="inline-flex items-center text-green-600">
                            🌐 Website
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200 text-sm"
                        onClick={() => window.open(`tel:${hospital.phone}`)}
                      >
                        📞 Call Hospital
                      </button>
                      {hospital.website && (
                        <button
                          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 text-sm"
                          onClick={() => window.open(hospital.website, "_blank")}
                        >
                          🌐 Visit Website
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hospitals found</h3>
                <p className="text-gray-500">Try adjusting your search filters to find hospitals in your area.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalSearch;