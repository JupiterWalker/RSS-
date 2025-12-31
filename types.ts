export enum Platform {
  YOUTUBE = 'YOUTUBE',
  TWITTER = 'TWITTER',
  REDDIT = 'REDDIT',
  BLOG = 'BLOG'
}

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  platform: Platform;
  icon?: string;
}

export interface Article {
  id: string;
  sourceId: string;
  platform: Platform;
  title: string;
  content: string; // Text content or description
  author: string;
  publishedAt: Date;
  url: string;
  thumbnail?: string; // For videos or heavy visual content
  isRead: boolean;
  summary?: string; // AI Summary
  isSummarizing?: boolean; // UI state
  tags: string[];
}

export interface DashboardStats {
  totalArticles: number;
  readCount: number;
  platformDistribution: { name: string; value: number }[];
}