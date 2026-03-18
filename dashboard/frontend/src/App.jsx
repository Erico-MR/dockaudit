import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './Dashboard';
import InventoryImages from './components/InventoryImages';
import InventoryVolumes from './components/InventoryVolumes';
import InventorySwarm from './components/InventorySwarm';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="flex h-screen bg-dockaudit-bg overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 overflow-y-auto">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'scans' && (
                    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                        <h2 className="text-2xl font-bold text-slate-200">Live Scans</h2>
                        <p className="text-slate-500 mt-2">Historical scan records and live triggers will be listed here.</p>
                    </div>
                )}
                {activeTab === 'images' && <InventoryImages />}
                {activeTab === 'volumes' && <InventoryVolumes />}
                {activeTab === 'swarm' && <InventorySwarm />}
                {activeTab === 'settings' && (
                    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                        <h2 className="text-2xl font-bold text-slate-200">Settings</h2>
                        <p className="text-slate-500 mt-2">Configure scan intervals, Docker socket paths, and OSV API settings.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
