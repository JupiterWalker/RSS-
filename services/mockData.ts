import { Article, FeedSource, Platform } from '../types';

const authors = ["TechCrunch", "MKBHD", "TheVerge", "Elon Musk", "React Team", "CNN", "BBC World"];
const tags = ["AI", "Crypto", "Coding", "Politics", "Design", "Apple", "SpaceX"];

const getRandomDate = () => {
  const date = new Date();
  date.setHours(date.getHours() - Math.floor(Math.random() * 48));
  return date;
};

export const MOCK_SOURCES: FeedSource[] = [
  { id: '1', name: 'Tech Reviews', url: 'https://youtube.com/mkbhd', platform: Platform.YOUTUBE },
  { id: '2', name: 'Dev Twitter', url: 'https://x.com/reactjs', platform: Platform.TWITTER },
  { id: '3', name: 'Hacker News', url: 'https://news.ycombinator.com', platform: Platform.BLOG },
  { id: '4', name: 'r/programming', url: 'https://reddit.com/r/programming', platform: Platform.REDDIT },
];

/**
 * Generates mock articles based on the user's actual current sources.
 */
export const generateArticlesFromSources = (sources: FeedSource[], count: number): Article[] => {
  const articles: Article[] = [];
  
  if (sources.length === 0) return [];

  for (let i = 0; i < count; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const platform = source.platform;
    const id = Math.random().toString(36).substring(7);
    
    let title = "";
    let content = "";
    let thumbnail = undefined;

    switch (platform) {
      case Platform.YOUTUBE:
        title = `${source.name}: New Video Analysis ${Math.floor(Math.random() * 100)}`;
        content = "Explore the latest insights from this channel. Today we look at emerging trends and performance benchmarks that are shaping the industry.";
        thumbnail = `https://picsum.photos/seed/${id}/400/225`;
        break;
      case Platform.TWITTER:
        title = `Post from ${source.name}`;
        content = "Just shared some thoughts on the current state of decentralized systems. The community feedback has been incredible! #tech #future";
        break;
      case Platform.REDDIT:
        title = `Trending in ${source.name}`;
        content = "A deep dive into why developers are moving towards minimalist frameworks. Over 500 comments and counting.";
        break;
      default: // BLOG
        title = `${source.name} | Weekly Digest`;
        content = "Our latest editorial covers the intersection of user experience and automated design tools. A must-read for creative professionals.";
        thumbnail = `https://picsum.photos/seed/${id}/400/200`;
    }

    articles.push({
      id,
      sourceId: source.id,
      platform,
      title,
      content,
      author: source.name, // Use the source name as author for clarity
      publishedAt: getRandomDate(),
      url: source.url,
      isRead: Math.random() > 0.9,
      tags: [tags[Math.floor(Math.random() * tags.length)]],
      thumbnail
    });
  }
  
  return articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};