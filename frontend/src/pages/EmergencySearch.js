import React, { useState, useEffect } from "react";
import axios from "axios";

function EmergencySearch() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    search: "",
  });

  const emergencyTypes = ["ambulance", "fire", "police", "hospital"];

  useEffect(() => {
    fetchEmergencyServices();
  }, []);

  const fetchEmergencyServices = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/emergency/search?";

      if (filters.search) url += `q=${encodeURIComponent(filters.search)}&`;
      if (filters.city) url += `city=${encodeURIComponent(filters.city)}&`;
      if (filters.type) url += `type=${encodeURIComponent(filters.type)}&`;

      const response = await axios.get(url);
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setServices([]);
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
    fetchEmergencyServices();
  };

  const callEmergency = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case "ambulance":
        return "🚑";
      case "fire":
        return "🚒";
      case "police":
        return "🚔";
      case "hospital":
        return "🏥";
      default:
        return "🚨";
    }
  };

  const getServiceColor = (type) => {
    switch (type) {
      case "ambulance":
        return "from-red-500 to-red-600";
      case "fire":
        return "from-orange-500 to-orange-600";
      case "police":
        return "from-blue-500 to-blue-600";
      case "hospital":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Emergency Services</h1>
          <p className="text-red-100 text-lg">Find emergency services and contact information</p>
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
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="search"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Search services..."
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter city name"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    name="type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    {emergencyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search Services"}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Emergency Services ({services.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Searching for emergency services...</p>
              </div>
            ) : services.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div key={service._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200 border-l-4 border-red-500">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getServiceColor(service.type)} rounded-full flex items-center justify-center text-white text-xl flex-shrink-0`}>
                        {getServiceIcon(service.type)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {service.name}
                          </h3>
                          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                            {service.type?.charAt(0).toUpperCase() + service.type?.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          📍 {service.city}, {service.state}
                        </p>
                        <p className="text-gray-600 text-sm">
                          📞 {service.phone}
                        </p>
                        {service.alternatePhone && (
                          <p className="text-gray-600 text-sm">
                            📞 Alternate: {service.alternatePhone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Response Time:</span>
                          <span className="ml-2 text-gray-900 font-semibold">
                            {service.responseTime} minutes
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Status:</span>
                          <span
                            className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              service.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {service.isAvailable ? "🟢 Available" : "🔴 Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200 text-sm"
                        onClick={() => callEmergency(service.phone)}
                      >
                        🚨 Call Now
                      </button>
                      {service.alternatePhone && (
                        <button
                          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 text-sm"
                          onClick={() => callEmergency(service.alternatePhone)}
                        >
                          📞 Alternate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">🚨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No emergency services found</h3>
                <p className="text-gray-500">Try adjusting your search filters to find emergency services in your area.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencySearch;