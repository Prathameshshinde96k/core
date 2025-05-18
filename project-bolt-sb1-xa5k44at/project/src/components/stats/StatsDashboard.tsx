import React, { useState } from "react";
import { useFlashcards } from "../../context/FlashcardContext";
import Card, { CardContent, CardHeader } from "../ui/Card";
import { LineChart, PieChart } from "./Charts";
import { Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface StatsDashboardProps {
  className?: string;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ className = "" }) => {
  const { stats, cards } = useFlashcards();
  const [dateRange, setDateRange] = useState("week");
  
  // Sample data for charts - in a real app this would come from actual review data
  const reviewData = [
    { day: "Mon", reviews: 15 },
    { day: "Tue", reviews: 20 },
    { day: "Wed", reviews: 25 },
    { day: "Thu", reviews: 18 },
    { day: "Fri", reviews: 30 },
    { day: "Sat", reviews: 12 },
    { day: "Sun", reviews: 8 },
  ];
  
  const pieData = [
    { label: "Easy", value: stats.reviewsByRating.easy, color: "#10B981" },
    { label: "Good", value: stats.reviewsByRating.medium, color: "#3B82F6" },
    { label: "Hard", value: stats.reviewsByRating.hard, color: "#F59E0B" },
    { label: "Again", value: stats.reviewsByRating.again, color: "#EF4444" },
  ];
  
  // Get overdue cards
  const now = new Date();
  const overdueCards = cards.filter(card => new Date(card.dueDate) < now);
  
  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Cards Due Today" 
          value={stats.cardsToReview} 
          icon={<Calendar className="text-blue-500" />} 
        />
        
        <StatCard 
          title="Overdue Cards" 
          value={overdueCards.length} 
          icon={<AlertTriangle className="text-amber-500" />} 
        />
        
        <StatCard 
          title="Total Cards Reviewed" 
          value={stats.cardsReviewed} 
          icon={<CheckCircle className="text-green-500" />} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Daily Reviews
              </h3>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="p-1 text-sm border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="year">Last 365 days</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart data={reviewData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Response Distribution
            </h3>
          </CardHeader>
          <CardContent>
            <PieChart data={pieData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mr-4">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsDashboard;