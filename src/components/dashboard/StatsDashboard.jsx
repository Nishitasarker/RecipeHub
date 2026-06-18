"use client";
import React from "react";
import StatCard from "./StatCard";

export default function StatsDashboard({ statsData = [] }) {
  if (!statsData || statsData.length === 0) {
    return <div className="text-zinc-500 text-sm">No statistics available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statsData.map((stat, index) => (
        <StatCard
          key={stat.id || index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}