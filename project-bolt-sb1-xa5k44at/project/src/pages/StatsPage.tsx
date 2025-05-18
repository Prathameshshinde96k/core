import React from "react";
import StatsDashboard from "../components/stats/StatsDashboard";

const StatsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Your Learning Statistics
      </h1>
      
      <StatsDashboard />
    </div>
  );
};

export default StatsPage;