import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Network } from 'lucide-react';

function InventorySwarm() {
    const [swarm, setSwarm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/inventory/swarm')
            .then(res => {
                setSwarm(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading cluster data...</div>;

    if (!swarm || !swarm.status || !swarm.status.active) {
        return (
            <div className="p-8 animate-in fade-in duration-500">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Network className="text-cyan-500" /> Swarm Cluster
                    </h1>
                </header>
                <div className="glass-panel p-8 text-center bg-orange-500/5 border-orange-500/20">
                    <h2 className="text-xl font-bold text-orange-400 mb-2">Swarm Mode Inactive</h2>
                    <p className="text-slate-400 text-sm">This Docker node is not participating in a Swarm cluster.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Network className="text-cyan-500" /> Swarm Cluster
                </h1>
                <p className="text-slate-500 text-sm">Cluster Status & Nodes</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="glass-panel p-6">
                    <h2 className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-4">Cluster Details</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span className="text-slate-400">Cluster ID:</span> <span className="font-mono text-cyan-400">{swarm.status.id}</span></li>
                        <li className="flex justify-between"><span className="text-slate-400">Total Nodes:</span> <span className="text-slate-200 font-bold">{swarm.status.nodes?.length || 0}</span></li>
                        <li className="flex justify-between"><span className="text-slate-400">Auto-lock Managers:</span> <span className={swarm.status.unlock_key_set ? "text-green-400" : "text-red-400"}>{swarm.status.unlock_key_set ? "Enabled" : "Disabled"}</span></li>
                    </ul>
                </div>
                <div className="glass-panel p-6">
                    <h2 className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-4">Secrets & Configs</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span className="text-slate-400">Active Configs:</span> <span className="text-slate-200 font-bold">{swarm.configs?.length || 0}</span></li>
                        <li className="flex justify-between"><span className="text-slate-400">Active Secrets:</span> <span className="text-slate-200 font-bold">{swarm.secrets?.length || 0}</span></li>
                    </ul>
                </div>
            </div>

            <h2 className="text-lg font-bold text-slate-200 mb-4">Nodes</h2>
            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-xs uppercase text-slate-500 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Hostname</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">State</th>
                            <th className="px-6 py-4">Engine</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {swarm.status.nodes && swarm.status.nodes.map((node, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">{node.hostname}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${node.role === 'manager' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-300'}`}>
                                        {node.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${node.state === 'ready' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {node.state}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{node.engine_version}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default InventorySwarm;
