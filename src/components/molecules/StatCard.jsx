import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon, trend, color = "primary", className }) => {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                className={`h-4 w-4 ${trend > 0 ? "text-green-500" : "text-red-500"}`} 
              />
              <span className={`text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color} bg-opacity-10`}>
          <ApperIcon name={icon} className={`h-6 w-6 text-${color}`} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;