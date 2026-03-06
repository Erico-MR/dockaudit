import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Activity, CheckCircle, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

function Dashboard() {
    const [latestScan, setLatestScan] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, these would fetch from the FastAPI backend.
        // For now we mock the data to build the beautiful UI.
        setTimeout(() => {
            setLatestScan({
                global_score: 72,
                security_score: 55,
                performance_score: 90,
                reliability_score: 95,
                findings_json: "{}"
            });

            setHistory([
                { time: '10:00', score: 45, security: 20 },
                { time: '11:00', score: 55, security: 35 },
                { time: '12:00', score: 55, security: 35 },
                { time: '13:00', score: 72, security: 55 }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
    const scoreData = [
        { name: 'Passing', value: latestScan?.global_score || 0 },
        { name: 'Failing', value: 100 - (latestScan?.global_score || 0) }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Infrastructure Overview
                    </h1>
                    <p className="text-slate-400 mt-1">Live Docker Environment Audit</p>
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2">
                    <Activity size={18} /> Run New Scan
                </button>
            </header>

            {/* Top Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ScoreCard title="Global Score" score={latestScan.global_score} icon={<BarChart3 className="text-blue-400" />} />
                <ScoreCard title="Security" score={latestScan.security_score} icon={<ShieldAlert className={latestScan.security_score < 60 ? "text-red-400" : "text-green-400"} />} />
                <ScoreCard title="Performance" score={latestScan.performance_score} icon={<Activity className="text-green-400" />} />
                <ScoreCard title="Reliability" score={latestScan.reliability_score} icon={<CheckCircle className="text-green-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                {/* Trend Chart */}
                <div className="glass-panel p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock size={18} className="text-slate-400" /> Score History</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Global Score" />
                                <Line type="monotone" dataKey="security" stroke="#ef4444" strokeWidth={2} name="Security Score" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Global Pie Breakdown */}
                <div className="glass-panel p-6 flex flex-col items-center justify-center">
                    <h2 className="text-lg font-semibold w-full text-left mb-2">Audit Distribution</h2>
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={scoreData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#0ea5e9" />
                                    <Cell fill="#334155" />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold">{latestScan.global_score}</span>
                            <span className="text-xs text-slate-400">/ 100</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Latest Findings (Mocked logic for beautiful rendering) */}
            <div className="glass-panel p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-400" /> Critical Findings</h2>
                <div className="space-y-3">
                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg flex gap-4 items-start">
                        <ShieldAlert className="text-red-400 mt-1 shrink-0" />
                        <div>
                            <h4 className="font-medium text-red-200">Image prici-web:latest uses 'latest' tag</h4>
                            <p className="text-sm text-red-300/80 mt-1">Pinned versions are recommended for reproducible builds. (DA-SECURITY-CRIT)</p>
                        </div>
                    </div>
                    <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg flex gap-4 items-start">
                        <ShieldAlert className="text-red-400 mt-1 shrink-0" />
                        <div>
                            <h4 className="font-medium text-red-200">Container db-1 running as root</h4>
                            <p className="text-sm text-red-300/80 mt-1">Container is running as root. Best practice is to run as a non-root user.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function ScoreCard({ title, score, icon }) {
    return (
        <div className="glass-panel p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-400 font-medium text-sm">{title}</h3>
                {icon}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{score}</span>
                <span className="text-slate-500 text-sm">/ 100</span>
            </div>
            {/* Subtle hover gradient effect */}
            <div className="absolute -inset-x-0 -bottom-2 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
}

export default Dashboard;
