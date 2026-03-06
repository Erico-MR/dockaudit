import React from 'react';
import { Home, BarChart2, Layers, Settings, Shield, Activity, HelpCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 border-l-2 ${active
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="w-64 h-screen bg-dockaudit-bg border-r border-slate-800 flex flex-col shrink-0">
            <div className="p-6 flex items-center gap-3">
                <img src={logo} alt="DockAudit" className="w-10 h-10 object-contain rounded-lg shadow-lg shadow-cyan-500/20" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    DockAudit
                </span>
            </div>

            <nav className="flex-1 mt-4">
                <div className="px-4 mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2">Monitoring</p>
                </div>
                <SidebarItem
                    icon={Home}
                    label="Home Dashboard"
                    active={activeTab === 'dashboard'}
                    onClick={() => setActiveTab('dashboard')}
                />
                <SidebarItem
                    icon={Activity}
                    label="Live Scans"
                    active={activeTab === 'scans'}
                    onClick={() => setActiveTab('scans')}
                />

                <div className="px-4 mt-8 mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2">Inventory</p>
                </div>
                <SidebarItem
                    icon={Layers}
                    label="Image Registry"
                    active={activeTab === 'images'}
                    onClick={() => setActiveTab('images')}
                />
                <SidebarItem
                    icon={Shield}
                    label="Vulnerability DB"
                    active={activeTab === 'cve'}
                    onClick={() => setActiveTab('cve')}
                />

                <div className="px-4 mt-8 mb-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2">Configuration</p>
                </div>
                <SidebarItem
                    icon={Settings}
                    label="Settings"
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                />
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <button className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 transition-colors w-full">
                    <HelpCircle size={18} />
                    <span className="text-sm">Documentation</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
