import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HealthBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Nutrition", "Exercise", "Mental Health", "Preventive Care", "Disease Management", "Wellness"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/healthblogs");
      setBlogs(res.data);
      setFilteredBlogs(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.category === category));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = blogs.filter(blog =>
      (selectedCategory === "All" || blog.category === selectedCategory) &&
      (blog.title.toLowerCase().includes(term.toLowerCase()) ||
       blog.description.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredBlogs(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Health & Wellness Blogs</h1>
          <p className="text-lg text-blue-100">Expert tips and advice for a healthier life</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-gray-500 text-sm">{blog.readTime} min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{blog.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-gray-500 text-sm">
                      <span>❤️ {blog.likes}</span>
                      <span>👁️ {blog.views}</span>
                    </div>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found. Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthBlogs;
