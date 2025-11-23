import React from 'react';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ArticleCard from '@/components/article/ArticleCard';
import { ArticleGridSkeleton } from '@/components/ui/Loading';
import Pagination from '@/components/ui/Pagination';

// Mock category data
const mockCategory = {
  _id: 'cat1',
  name: 'Innovation',
  slug: 'innovation',
  description: 'Explore groundbreaking innovations and cutting-edge technologies that are shaping the future of engineering and science.',
  color: '#0A7FBF',
  displayOrder: 1
};

const mockArticles = Array.from({ length: 12 }, (_, i) => ({
  _id: `${i + 1}`,
  title: `${mockCategory.name} Article ${i + 1}: Revolutionary Advances in Technology`,
  slug: `innovation-article-${i + 1}`,
  excerpt: 'Discover how innovative solutions are transforming industries and pushing the boundaries of engineering.',
  content: '',
  featuredImage: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=800&h=600&fit=crop`,
  category: mockCategory,
  author: {
    _id: `auth${i + 1}`,
    username: `Engineer ${i + 1}`,
    email: '',
    role: 'author' as const
  },
  tags: ['innovation', 'technology', 'engineering'],
  publishedAt: new Date(Date.now() - i * 86400000),
  views: Math.floor(Math.random() * 15000) + 1000,
  likes: Math.floor(Math.random() * 800) + 100,
  readTime: Math.floor(Math.random() * 12) + 4,
  isFeatured: i === 0,
  status: 'published' as const,
  createdAt: new Date(),
  updatedAt: new Date()
}));

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // TODO: Replace with actual API call
  // const { data: category } = useQuery(['category', params.slug], () => categoriesAPI.getBySlug(params.slug));
  // const { data: articles } = useQuery(['articles', params.slug], () => articlesAPI.getByCategory(params.slug));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <section 
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: mockCategory.color }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="mb-6">
              <CategoryBadge 
                category={mockCategory} 
                size="lg" 
                clickable={false}
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4">
              {mockCategory.name}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              {mockCategory.description}
            </p>
            <div className="mt-8 flex items-center space-x-6 text-white/80">
              <span>{mockArticles.length} Articles</span>
              <span>•</span>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 py-12">
        {/* Filter/Sort Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-heading font-bold text-gray-900">
            Latest in {mockCategory.name}
          </h2>
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Most Recent</option>
              <option>Most Popular</option>
              <option>Most Liked</option>
            </select>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockArticles.map((article) => (
            <ArticleCard 
              key={article._id} 
              article={article} 
              variant="default" 
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={(page) => {
            console.log('Navigate to page:', page);
          }}
          baseUrl={`/category/${params.slug}`}
        />
      </section>

      {/* Related Categories */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Science', slug: 'science', color: '#3B82F6' },
              { name: 'Technology', slug: 'technology', color: '#10B981' },
              { name: 'Energy', slug: 'energy', color: '#F59E0B' },
              { name: 'Space', slug: 'space', color: '#8B5CF6' },
              { name: 'Military', slug: 'military', color: '#EF4444' },
              { name: 'Culture', slug: 'culture', color: '#EC4899' },
            ].map((cat) => (
              <a
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group p-6 bg-gray-50 hover:bg-white rounded-xl transition-all hover:shadow-lg border border-transparent hover:border-gray-200"
              >
                <div
                  className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name[0]}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
                  {cat.name}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
