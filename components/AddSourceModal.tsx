import React, { useState } from 'react';
import { Platform, FeedSource } from '../types';
import { X, Youtube, Twitter, MessageCircle, Newspaper } from 'lucide-react';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (source: FeedSource) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.BLOG);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    onAdd({
      id: Math.random().toString(36).substring(7),
      name,
      url,
      platform,
    });
    
    // Reset and close
    setName('');
    setUrl('');
    setPlatform(Platform.BLOG);
    onClose();
  };

  const platforms = [
    { id: Platform.YOUTUBE, icon: Youtube, color: 'text-red-500', bg: 'bg-red-50' },
    { id: Platform.TWITTER, icon: Twitter, color: 'text-blue-400', bg: 'bg-blue-50' },
    { id: Platform.REDDIT, icon: MessageCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: Platform.BLOG, icon: Newspaper, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Add New Source</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Select Platform</label>
            <div className="grid grid-cols-4 gap-3">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    platform === p.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <p.icon className={`w-6 h-6 mb-1 ${p.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">{p.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Source Name</label>
            <input
              type="text"
              required
              placeholder="e.g. My Favorite Tech Blog"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">URL / Handle</label>
            <input
              type="text"
              required
              placeholder="https://example.com/rss or @username"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            Add Source
          </button>
        </form>
      </div>
    </div>
  );
};