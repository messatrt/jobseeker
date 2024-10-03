import React, { useState, useEffect } from "react";
import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  ExternalLink,
  Filter,
  X,
} from "lucide-react";

const JobSearch = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    district: "",
    experience: "",
    salary: "",
    type: "",
    company: "",
    industry: "",
    skills: "",
    education: "",
    jobLevel: "",
    benefits: "",
  });

  useEffect(() => {
    if (!user) {
      setFilters({
        country: "",
        state: "",
        district: "",
        experience: "",
        salary: "",
        type: "",
        company: "",
        industry: "",
        skills: "",
        education: "",
        jobLevel: "",
        benefits: "",
      });
      setShowFilters(false);
    }
  }, [user]);

  const fetchJobs = async (index = 0) => {
    setLoading(true);
    setError(null);

    try {
      const location = `${filters.country}+${filters.state}+${filters.district}`
        .trim()
        .replace(/\++$/, "");
      const response = await fetch(
        `http://localhost:3000/jobs?q=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}&index=${index}&${new URLSearchParams(filters).toString()}`,
      );
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();

      const transformedJobs = data.jobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        experience: job.experience || "Not specified",
        salary: job.salaryRange || "Not specified",
        description: job.description,
        url: job.jobProviders[0].url,
      }));

      setJobs((prevJobs) =>
        index === 0 ? transformedJobs : [...prevJobs, ...transformedJobs],
      );
      setCurrentIndex(index);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("An error occurred while fetching jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchJobs(0);
  };

  const handleLoadMore = () => {
    fetchJobs(currentIndex + 1);
  };

  const handleViewDetails = (url) => {
    window.open(url, "_blank");
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Discover opportunities that match your skills and aspirations
        </p>
        <div className="relative mb-12">
          <form onSubmit={handleSearch} className="flex">
            {user && (
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-200 text-gray-700 px-4 py-4 rounded-l-full hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <Filter className="w-6 h-6" />
              </button>
            )}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for jobs..."
              className="flex-grow px-6 py-4 text-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-4 rounded-r-full hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Search className="w-6 h-6" />
            </button>
          </form>
          {showFilters && (
            <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  placeholder="Country"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  placeholder="State"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                  placeholder="District"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                  placeholder="Experience"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="salary"
                  value={filters.salary}
                  onChange={handleFilterChange}
                  placeholder="Salary"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  placeholder="Job Type"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="company"
                  value={filters.company}
                  onChange={handleFilterChange}
                  placeholder="Company"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="industry"
                  value={filters.industry}
                  onChange={handleFilterChange}
                  placeholder="Industry"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="skills"
                  value={filters.skills}
                  onChange={handleFilterChange}
                  placeholder="Skills"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="education"
                  value={filters.education}
                  onChange={handleFilterChange}
                  placeholder="Education"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="jobLevel"
                  value={filters.jobLevel}
                  onChange={handleFilterChange}
                  placeholder="Job Level"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="benefits"
                  value={filters.benefits}
                  onChange={handleFilterChange}
                  placeholder="Benefits"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {jobs.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                        {job.title}
                      </h2>
                      <button className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
                        <Bookmark className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <p>{job.company}</p>
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <p>{job.location}</p>
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <p>Experience: {job.experience}</p>
                    </div>
                    <div className="flex items-center mb-4 text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <p>Salary: {job.salary}</p>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    <button
                      onClick={() => handleViewDetails(job.url)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Load More Jobs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
