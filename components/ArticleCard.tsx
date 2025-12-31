import React from 'react';
import { Article, Platform } from '../types';
import { Youtube, Twitter, Newspaper, MessageCircle, ExternalLink, Sparkles, CheckCheck } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSummarize: (id: string) => void;
  onMarkRead: (id: string) => void;
}

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch (platform) {
    case Platform.YOUTUBE: return <Youtube className="w-4 h-4 text-red-500" />;
    case Platform.TWITTER: return <Twitter className="w-4 h-4 text-blue-400" />;
    case Platform.REDDIT: return <MessageCircle className="w-4 h-4 text-orange-500" />;
    default: return <Newspaper className="w-4 h-4 text-slate-500" />;
  }
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSummarize, onMarkRead }) => {
  const isVideo = article.platform === Platform.YOUTUBE;
  const isTweet = article.platform === Platform.TWITTER;

  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col
      ${article.isRead ? 'opacity-60 bg-slate-50' : ''}
    `}>
      {/* Thumbnail for Video/Blogs */}
      {article.thumbnail && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 group">
          <img 
            src={article.thumbnail} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10">
              <div className="bg-white/90 rounded-full p-3 shadow-lg">
                <Youtube className="w-6 h-6 text-red-600 fill-current" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
              <PlatformIcon platform={article.platform} />
              {article.platform}
            </span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          <a href={article.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <h3 className={`font-bold text-slate-800 mb-2 ${isTweet ? 'text-base' : 'text-lg'}`}>
          {article.title}
        </h3>

        {!isTweet && (
           <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
             {article.content}
           </p>
        )}

        {/* AI Summary Section */}
        {article.summary ? (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2 mb-1 text-xs font-bold text-indigo-700 uppercase tracking-wide">
              <Sparkles className="w-3 h-3" />
              AI Insight
            </div>
            <p className="text-indigo-900 text-sm leading-relaxed">
              {article.summary}
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={`https://ui-avatars.com/api/?name=${article.author}&background=random`} 
              alt={article.author}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-slate-500 font-medium truncate max-w-[100px]">{article.author}</span>
          </div>

          <div className="flex gap-2">
             {!article.summary && (
              <button 
                onClick={() => onSummarize(article.id)}
                disabled={article.isSummarizing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-50"
              >
                {article.isSummarizing ? (
                  <span className="animate-pulse">Thinking...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Summarize
                  </>
                )}
              </button>
            )}
            
            <button 
              onClick={() => onMarkRead(article.id)}
              className={`p-1.5 rounded-md transition-colors ${article.isRead ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
              title="Mark as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};