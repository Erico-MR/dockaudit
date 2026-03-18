import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Database } from 'lucide-react';

function InventoryVolumes() {
    const [volumes, setVolumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/inventory/volumes')
            .then(res => {
                setVolumes(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading volumes...</div>;

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Database className="text-cyan-500" /> Volumes
                </h1>
                <p className="text-slate-500 text-sm">Docker volumes and mount points</p>
            </header>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-xs uppercase text-slate-500 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Driver</th>
                            <th className="px-6 py-4">Scope</th>
                            <th className="px-6 py-4 max-w-xs">Mountpoint</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {volumes.map((vol, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200 truncate max-w-[200px]" title={vol.name}>{vol.name}</td>
                                <td className="px-6 py-4">{vol.driver}</td>
                                <td className="px-6 py-4 uppercase text-[10px] tracking-wide">{vol.scope}</td>
                                <td className="px-6 py-4 font-mono text-[10px] break-all">{vol.mountpoint}</td>
                            </tr>
                        ))}
                        {volumes.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No volumes found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryVolumes;
