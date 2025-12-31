import React from 'react';
import { FeedSource, Platform } from '../types';
import { Youtube, Twitter, MessageCircle, Newspaper, Trash2, Globe } from 'lucide-react';

interface SourceListProps {
  sources: FeedSource[];
  onDelete: (id: string) => void;
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case Platform.YOUTUBE: return <Youtube className="w-5 h-5 text-red-500" />;
    case Platform.TWITTER: return <Twitter className="w-5 h-5 text-blue-400" />;
    case Platform.REDDIT: return <MessageCircle className="w-5 h-5 text-orange-500" />;
    default: return <Newspaper className="w-5 h-5 text-slate-500" />;
  }
};

export const SourceList: React.FC<SourceListProps> = ({ sources, onDelete }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Your Subscriptions</h2>
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {sources.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <div key={source.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow group">
            <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100`}>
              <PlatformIcon platform={source.platform} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 truncate">{source.name}</h3>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3" />
                {source.url}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                  {source.platform}
                </span>
              </div>
            </div>

            <button
              onClick={() => onDelete(source.id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete subscription"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {sources.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-500 font-medium">No subscriptions yet. Click "Add Source" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};