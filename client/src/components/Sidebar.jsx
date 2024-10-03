import React, { useState } from "react";
import Users from "./Users";
import Jobs from "./Jobs";
import AddJob from "./AddJobs";

const Sidebar = () => {
  const [currentView, setCurrentView] = useState("users"); // Default view

  // Function to render the correct component
  const renderView = () => {
    switch (currentView) {
      case "users":
        return <Users />;
      case "jobs":
        return <Jobs />;
      case "add-job":
        return <AddJob />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar navigation */}
      <div className="w-64 h-screen bg-blue-600 text-white p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul>
          <li className="mb-4">
            <button
              onClick={() => setCurrentView("users")}
              className={`block w-full text-left p-2 rounded ${currentView === "users" ? "bg-gray-700" : "hover:bg-gray-600"}`}
            >
              Users
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setCurrentView("jobs")}
              className={`block w-full text-left p-2 rounded ${currentView === "jobs" ? "bg-gray-700" : "hover:bg-gray-600"}`}
            >
              Jobs
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => setCurrentView("add-job")}
              className={`block w-full text-left p-2 rounded ${currentView === "add-job" ? "bg-gray-700" : "hover:bg-gray-600"}`}
            >
              Add Job
            </button>
          </li>
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        {renderView()} {/* Render the selected view */}
      </div>
    </div>
  );
};

export default Sidebar;
