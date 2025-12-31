import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ArticleCard } from './components/ArticleCard';
import { Stats } from './components/Stats';
import { AddSourceModal } from './components/AddSourceModal';
import { SourceList } from './components/SourceList';
import { Article, Platform, FeedSource } from './types';
import { generateArticlesFromSources, MOCK_SOURCES } from './services/mockData';
import { summarizeContent, generateBriefing } from './services/geminiService';
import { Menu, Search, Filter, Sparkles, RefreshCw, Plus } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<FeedSource[]>(MOCK_SOURCES);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [briefing, setBriefing] = useState<string | null>(null);
  const [generatingBriefing, setGeneratingBriefing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data based on current sources
  const fetchData = useCallback((currentSources: FeedSource[], isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setLoading(true);
    
    setTimeout(() => {
      // Use the updated generator that respects our current source list
      const data = generateArticlesFromSources(currentSources, 24);
      setArticles(data);
      setLoading(false);
      setRefreshing(false);
    }, 800);
  }, []);

  // Initialize Data or re-fetch when sources count changes
  useEffect(() => {
    fetchData(sources);
  }, []); // Only on mount. We'll handle source addition separately for better UX

  const handleRefresh = () => {
    fetchData(sources, true);
  };

  const handleSummarize = async (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, isSummarizing: true } : a));
    const article = articles.find(a => a.id === id);
    if (article) {
      const summary = await summarizeContent(article.content, article.platform);
      setArticles(prev => prev.map(a => a.id === id ? { ...a, isSummarizing: false, summary } : a));
    }
  };

  const handleMarkRead = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, isRead: !a.isRead } : a));
  };

  const handleGenerateBriefing = async () => {
    setGeneratingBriefing(true);
    const recentTitles = articles.slice(0, 10).map(a => a.title);
    const result = await generateBriefing(recentTitles);
    setBriefing(result);
    setGeneratingBriefing(false);
  };

  const handleAddSource = (source: FeedSource) => {
    const updatedSources = [...sources, source];
    setSources(updatedSources);
    // After adding, automatically refresh articles to include the new source
    fetchData(updatedSources, true);
  };

  const handleDeleteSource = (id: string) => {
    if (confirm('Are you sure you want to remove this subscription?')) {
      const updatedSources = sources.filter(s => s.id !== id);
      setSources(updatedSources);
      setArticles(prev => prev.filter(a => a.sourceId !== id));
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesPlatform = filterPlatform === 'ALL' || article.platform === filterPlatform;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    if (activeTab === 'stats') {
      return <Stats articles={articles} />;
    }

    if (activeTab === 'sources') {
      return <SourceList sources={sources} onDelete={handleDeleteSource} />;
    }

    return (
      <>
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="relative z-10">
             <div className="flex items-center justify-between mb-3">
               <h2 className="flex items-center gap-2 font-bold text-lg">
                 <Sparkles className="w-5 h-5 text-yellow-300" />
                 Morning Briefing
               </h2>
               <button 
                onClick={handleGenerateBriefing}
                disabled={generatingBriefing}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
               >
                 {generatingBriefing ? 'Generating...' : briefing ? 'Regenerate' : 'Generate with AI'}
               </button>
             </div>
             
             {briefing ? (
               <p className="text-indigo-50 leading-relaxed text-sm md:text-base opacity-90 animate-in fade-in duration-500">
                 {briefing}
               </p>
             ) : (
               <p className="text-indigo-200 text-sm">
                 Tap 'Generate' to let Gemini analyze your {articles.length} unread articles and give you a quick summary of what's happening today.
               </p>
             )}
           </div>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
          <button 
            onClick={() => setFilterPlatform('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${filterPlatform === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            All Feeds
          </button>
          {Object.values(Platform).map(p => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${filterPlatform === p ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
               <div key={i} className="bg-white rounded-xl h-64 animate-pulse p-4">
                 <div className="h-40 bg-slate-200 rounded-lg mb-4"></div>
                 <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                 <div className="h-4 bg-slate-200 rounded w-1/2"></div>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onSummarize={handleSummarize}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Filter className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700">No articles found</h3>
            <p className="text-slate-500">Try adjusting your filters or adding more subscriptions.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddFeed={() => setIsModalOpen(true)}
      />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64 ml-0' : 'md:ml-20 ml-0'} p-4 md:p-8 pt-20 md:pt-8`}>
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-800">Nexus RSS</span>
          <button onClick={() => setIsModalOpen(true)} className="p-2 text-indigo-600">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden md:flex items-center justify-between mb-8">
           <div>
             <h1 className="text-2xl font-bold text-slate-800 capitalize">
               {activeTab === 'dashboard' ? 'Daily Dashboard' : activeTab === 'stats' ? 'Analytics' : 'Subscriptions'}
             </h1>
             <p className="text-slate-500 text-sm mt-1">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </p>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search subscriptions or titles..." 
                 className="pl-10 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 bg-white"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
             <button 
              onClick={handleRefresh} 
              className={`p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all ${refreshing ? 'animate-spin' : ''}`}
              disabled={loading}
             >
               <RefreshCw className="w-5 h-5" />
             </button>
           </div>
        </div>

        {renderContent()}
      </main>

      <AddSourceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddSource} 
      />
    </div>
  );
}