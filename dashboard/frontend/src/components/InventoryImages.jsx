import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers } from 'lucide-react';

function InventoryImages() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/inventory/images')
            .then(res => {
                setImages(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-slate-400">Loading images...</div>;

    return (
        <div className="p-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Layers className="text-cyan-500" /> Image Registry
                </h1>
                <p className="text-slate-500 text-sm">Locally available Docker images</p>
            </header>

            <div className="glass-panel overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-800/50 text-xs uppercase text-slate-500 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4">Repository:Tag</th>
                            <th className="px-6 py-4">Image ID</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Size</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {images.map((img, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-200">
                                    {img.tags && img.tags.length > 0 ? img.tags.join(', ') : '<none>'}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{img.id.substring(7, 19)}</td>
                                <td className="px-6 py-4">{new Date(img.created).toLocaleString()}</td>
                                <td className="px-6 py-4">{img.size}</td>
                            </tr>
                        ))}
                        {images.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No images found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryImages;
