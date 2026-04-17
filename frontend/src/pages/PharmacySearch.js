import React, { useState, useEffect } from "react";
import axios from "axios";

function PharmacySearch() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    medicine: "",
    search: "",
  });

  const commonMedicines = [
    "Paracetamol",
    "Aspirin",
    "Ibuprofen",
    "Amoxicillin",
    "Metformin",
    "Vitamin C",
    "Cough Syrup",
  ];

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/pharmacies/search?";

      if (filters.search) url += `q=${encodeURIComponent(filters.search)}&`;
      if (filters.city) url += `city=${encodeURIComponent(filters.city)}&`;
      if (filters.medicine) url += `medicine=${encodeURIComponent(filters.medicine)}&`;

      const response = await axios.get(url);
      setPharmacies(response.data);
    } catch (err) {
      console.error("Error fetching pharmacies:", err);
      setPharmacies([]);
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
    fetchPharmacies();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Find Pharmacies</h1>
          <p className="text-purple-100 text-lg">Locate pharmacies and check medicine availability</p>
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
                    Pharmacy Name
                  </label>
                  <input
                    type="text"
                    name="search"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Search pharmacies..."
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter city name"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine
                  </label>
                  <select
                    name="medicine"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.medicine}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Medicines</option>
                    {commonMedicines.map((med) => (
                      <option key={med} value={med}>
                        {med}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search Pharmacies"}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Pharmacies ({pharmacies.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Searching for pharmacies...</p>
              </div>
            ) : pharmacies.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {pharmacies.map((pharmacy) => (
                  <div key={pharmacy._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        💊
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {pharmacy.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          📍 {pharmacy.city}, {pharmacy.state}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          📞 {pharmacy.phone}
                        </p>
                        <p className="text-gray-600 text-sm">
                          📧 {pharmacy.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-700">Status:</span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              pharmacy.isOpen
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pharmacy.isOpen ? "🟢 Open" : "🔴 Closed"}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Rating:</span>
                          <span className="ml-2 text-yellow-600 font-semibold">
                            ⭐ {pharmacy.rating || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-semibold text-gray-700">Hours:</span>
                        <span className="ml-2 text-gray-900">
                          {pharmacy.openTime} - {pharmacy.closeTime}
                        </span>
                      </div>

                      {pharmacy.availableMedicines && pharmacy.availableMedicines.length > 0 && (
                        <div>
                          <span className="text-sm font-semibold text-gray-700">Available Medicines:</span>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {pharmacy.availableMedicines.slice(0, 4).map((med, index) => (
                              <span
                                key={index}
                                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                              >
                                {med.name}
                              </span>
                            ))}
                            {pharmacy.availableMedicines.length > 4 && (
                              <span className="text-xs text-gray-500">
                                +{pharmacy.availableMedicines.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-200 text-sm"
                        onClick={() => window.open(`tel:${pharmacy.phone}`)}
                      >
                        📞 Call Pharmacy
                      </button>
                      <button
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 text-sm"
                        onClick={() => window.open(`mailto:${pharmacy.email}`)}
                      >
                        📧 Email
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">💊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No pharmacies found</h3>
                <p className="text-gray-500">Try adjusting your search filters to find pharmacies in your area.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PharmacySearch;