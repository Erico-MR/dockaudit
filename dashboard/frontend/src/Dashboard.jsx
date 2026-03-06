import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Activity, CheckCircle, BarChart3, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

function Dashboard() {
    const [latestScan, setLatestScan] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch logic would go here
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
        }, 800);
    }, []);

    const scoreData = [
        { name: 'Passing', value: latestScan?.global_score || 0 },
        { name: 'Failing', value: 100 - (latestScan?.global_score || 0) }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-dockaudit-bg">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    <p className="text-slate-500 text-sm font-medium animate-pulse">Running system audit...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-full space-y-8 animate-in fade-in duration-500">

            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-cyan-500" size={24} />
                        Operational Intelligence
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Real-time infrastructure security and health monitoring</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">Last scan: 2 mins ago</span>
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg transition-colors">
                        <RefreshCw size={18} />
                    </button>
                    <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-cyan-500/10 flex items-center gap-2">
                        Execute Audit
                    </button>
                </div>
            </header>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <ScoreCard title="Safety Index" score={latestScan.security_score} label="Security" color="red" icon={<ShieldAlert />} />
                <ScoreCard title="Capacity Score" score={latestScan.performance_score} label="Performance" color="green" icon={<Activity />} />
                <ScoreCard title="Uptime Rating" score={latestScan.reliability_score} label="Reliability" color="cyan" icon={<CheckCircle />} />
                <ScoreCard title="Infrastr. Score" score={latestScan.global_score} label="Global" color="blue" icon={<BarChart3 />} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Score Evolution */}
                <div className="glass-panel p-6 xl:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider text-xs">
                            <Clock size={14} className="text-slate-400" />
                            Score Trends
                        </h2>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                            <span className="text-[10px] text-slate-400 uppercase">Global</span>
                            <span className="w-3 h-3 rounded-full bg-red-500 ml-2"></span>
                            <span className="text-[10px] text-slate-400 uppercase">Security</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={4} dot={false} activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2, fill: '#fff' }} />
                                <Line type="monotone" dataKey="security" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Score Pie */}
                <div className="glass-panel p-6 flex flex-col items-center relative overflow-hidden">
                    <h2 className="font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider text-xs w-full mb-6">
                        <BarChart3 size={14} className="text-slate-400" />
                        Global Rating
                    </h2>
                    <div className="h-56 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={scoreData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    startAngle={90}
                                    endAngle={450}
                                >
                                    <Cell fill="#0ea5e9" />
                                    <Cell fill="#1e293b" />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-5xl font-black text-white">{latestScan.global_score}</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Passing</span>
                        </div>
                    </div>
                    <div className="mt-6 w-full space-y-2">
                        <div className="flex justify-between text-[11px] font-bold uppercase text-slate-500">
                            <span>Status</span>
                            <span className="text-cyan-400">Stable</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${latestScan.global_score}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="glass-panel overflow-hidden border-orange-500/20">
                <div className="bg-orange-500/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <h2 className="font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider text-xs">
                        <AlertTriangle size={14} className="text-orange-400" />
                        Operational Risks
                    </h2>
                    <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">2 active</span>
                </div>
                <div className="divide-y divide-white/5">
                    <AlertItem
                        title="Insecure Image Tag Configuration"
                        description="Image prici-web:latest uses 'latest' tag which facilitates non-deterministic deployments."
                        severity="high"
                        code="DA-SEC-012"
                    />
                    <AlertItem
                        title="Root Execution Detected"
                        description="Container 'db-1' is running with root privileges which increases host breakout risk."
                        severity="high"
                        code="DA-SEC-005"
                    />
                </div>
            </div>

        </div>
    );
}

function ScoreCard({ title, score, icon, label, color }) {
    const colorMap = {
        red: 'text-red-400 bg-red-500/10 border-red-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    };

    return (
        <div className="glass-panel p-6 group hover:border-slate-500 transition-all cursor-default">
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter self-center">{label}</span>
            </div>
            <div className="mt-5">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-black text-white">{score}</span>
                    <span className="text-xs text-slate-600 font-bold">/100</span>
                </div>
            </div>
        </div>
    );
}

function AlertItem({ title, description, severity, code }) {
    return (
        <div className="px-6 py-5 flex items-start gap-5 hover:bg-white/5 transition-colors group">
            <div className="mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{title}</h4>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5">{code}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>
            </div>
            <div className="self-center">
                <button className="text-[10px] font-black uppercase text-slate-500 hover:text-cyan-400 transition-colors">Details</button>
            </div>
        </div>
    );
}

export default Dashboard;
