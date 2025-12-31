import React from 'react';
import { LayoutGrid, PlusCircle, Bookmark, Settings, BarChart2, List } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddFeed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, setActiveTab, onAddFeed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'sources', label: 'Subscriptions', icon: List },
    { id: 'stats', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <aside className={`
      fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-20 flex flex-col
      ${isOpen ? 'w-64' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}
    `}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bookmark className="w-5 h-5 text-white" />
        </div>
        <span className={`font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-0 md:w-0'}`}>
          Nexus RSS
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
              ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden md:block'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onAddFeed}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition-all shadow-md group"
        >
          <PlusCircle className="w-5 h-5" />
          <span className={`whitespace-nowrap font-bold text-sm overflow-hidden transition-all duration-200 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden md:block'}`}>
            Add Source
          </span>
        </button>
      </div>
    </aside>
  );
};