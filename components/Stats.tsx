import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Article, Platform } from '../types';

interface StatsProps {
  articles: Article[];
}

const COLORS = ['#ef4444', '#3b82f6', '#f97316', '#22c55e']; // Youtube Red, Twitter Blue, Reddit Orange, Blog Green

export const Stats: React.FC<StatsProps> = ({ articles }) => {
  const platformCounts = articles.reduce((acc, curr) => {
    acc[curr.platform] = (acc[curr.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(platformCounts).map((key) => ({
    name: key,
    value: platformCounts[key],
  }));

  const readCount = articles.filter(a => a.isRead).length;
  const unreadCount = articles.length - readCount;

  const activityData = [
      { name: 'Read', value: readCount },
      { name: 'Unread', value: unreadCount },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Source Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Consumption Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-indigo-500 text-white p-6 rounded-xl shadow-md">
              <div className="text-indigo-200 text-sm font-medium uppercase">Total Articles</div>
              <div className="text-4xl font-bold mt-2">{articles.length}</div>
          </div>
          <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-md">
              <div className="text-emerald-200 text-sm font-medium uppercase">Total Read</div>
              <div className="text-4xl font-bold mt-2">{readCount}</div>
          </div>
          <div className="bg-violet-500 text-white p-6 rounded-xl shadow-md">
              <div className="text-violet-200 text-sm font-medium uppercase">Sources</div>
              <div className="text-4xl font-bold mt-2">{pieData.length}</div>
          </div>
      </div>
    </div>
  );
};