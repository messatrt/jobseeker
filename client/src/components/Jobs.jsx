import React, { useState, useEffect } from "react";
import axios from "axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state to store the search term

  useEffect(() => {
    axios
      .get("http://localhost:3000/getjobs")
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const deleteJob = (id) => {
    axios
      .delete(`http://localhost:3000/job/${id}`)
      .then(() => setJobs(jobs.filter((job) => job.id !== id)))
      .catch((error) => console.error("Error deleting job:", error));
  };

  // Filter the jobs based on the search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      {/* Search input field */}
      <input
        type="text"
        placeholder="Search by title or company..."
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />

      <ul className="space-y-4">
        {filteredJobs.map((job) => (
          <li key={job.id} className="p-4 bg-white shadow-md rounded">
            <div className="flex justify-between items-center">
              <div>
                <strong>{job.title}</strong> - {job.company}
              </div>
              <button
                onClick={() => deleteJob(job.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Jobs;
