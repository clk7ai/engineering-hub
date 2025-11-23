import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ArticleCard from '@/components/article/ArticleCard';
import { ArticleGridSkeleton } from '@/components/ui/Loading';
import Pagination from '@/components/ui/Pagination';
import articlesAPI from '@/lib/api/articles';

// Mock data for demonstration - replace with actual API call
const mockFeaturedArticle = {
  _id: '1',
  title: 'Revolutionary Quantum Computer Achieves Major Breakthrough',
  slug: 'quantum-computer-breakthrough',
  excerpt: 'Scientists have successfully created a quantum computer that can solve complex problems 1000x faster than traditional supercomputers, marking a pivotal moment in computing history.',
  content: '',
  featuredImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
  category: {
    _id: 'cat1',
    name: 'Innovation',
    slug: 'innovation',
    description: '',
    color: '#0A7FBF'
  },
  author: {
    _id: 'auth1',
    username: 'Dr. Sarah Chen',
    email: '',
    role: 'author' as const
  },
  tags: ['quantum', 'computing', 'technology'],
  publishedAt: new Date(),
  views: 15420,
  likes: 892,
  readTime: 8,
  isFeatured: true,
  status: 'published' as const,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockArticles = Array.from({ length: 9 }, (_, i) => ({
  _id: `${i + 2}`,
  title: `Engineering Innovation ${i + 1}: Advanced Technology Reshaping the Future`,
  slug: `article-${i + 1}`,
  excerpt: 'Explore how cutting-edge engineering solutions are transforming industries and pushing the boundaries of what\'s possible.',
  content: '',
  featuredImage: `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&auto=format&q=80`,
  category: {
    _id: `cat${(i % 5) + 1}`,
    name: ['Science', 'Technology', 'Innovation', 'Energy', 'Space'][i % 5],
    slug: ['science', 'technology', 'innovation', 'energy', 'space'][i % 5],
    description: '',
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
  },
  author: {
    _id: `auth${i + 2}`,
    username: `Engineer ${i + 1}`,
    email: '',
    role: 'author' as const
  },
  tags: ['engineering', 'technology'],
  publishedAt: new Date(Date.now() - i * 86400000),
  views: Math.floor(Math.random() * 10000) + 1000,
  likes: Math.floor(Math.random() * 500) + 50,
  readTime: Math.floor(Math.random() * 10) + 3,
  isFeatured: false,
  status: 'published' as const,
  createdAt: new Date(),
  updatedAt: new Date()
}));

export default function HomePage() {
  // TODO: Replace with actual data fetching
  // const { data: featuredArticle } = useQuery('featured', () => articlesAPI.getFeatured(1));
  // const { data: articles } = useQuery('articles', () => articlesAPI.getAll({ page: 1, limit: 9 }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection featuredArticle={mockFeaturedArticle} />

      {/* Latest Articles Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900">
            Latest Articles
          </h2>
          <a
            href="/articles"
            className="text-primary-500 hover:text-primary-600 font-medium text-sm flex items-center"
          >
            View All
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockArticles.map((article) => (
            <ArticleCard key={article._id} article={article} variant="default" />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={(page) => {
            console.log('Navigate to page:', page);
            // TODO: Implement pagination logic
          }}
        />
      </section>

      {/* Trending Topics Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            Trending Topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Artificial Intelligence',
              'Renewable Energy',
              'Space Exploration',
              'Quantum Computing',
              'Robotics',
              'Biotechnology',
              '5G Networks',
              'Electric Vehicles',
            ].map((topic) => (
              <a
                key={topic}
                href={`/search?q=${encodeURIComponent(topic)}`}
                className="px-4 py-2 bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-600 rounded-full text-sm font-medium transition-colors shadow-sm"
              >
                {topic}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
