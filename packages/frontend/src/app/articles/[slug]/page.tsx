import React from 'react';
import Image from 'next/image';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ArticleCard from '@/components/article/ArticleCard';
import { PageLoader } from '@/components/ui/Loading';

// Mock article data - replace with actual API call
const mockArticle = {
  _id: '1',
  title: 'Revolutionary Quantum Computer Achieves Major Breakthrough in Processing Power',
  slug: 'quantum-computer-breakthrough',
  excerpt: 'Scientists have successfully created a quantum computer that can solve complex problems 1000x faster than traditional supercomputers.',
  content: `
    <p>In a groundbreaking achievement that marks a pivotal moment in computing history, researchers at the Quantum Computing Institute have unveiled a quantum computer capable of solving complex computational problems at unprecedented speeds.</p>
    
    <h2>The Breakthrough</h2>
    <p>The new quantum system, dubbed "Q-Prime," utilizes 1000 qubits operating at near-absolute zero temperatures. This represents a significant leap from previous quantum computers, which typically operated with fewer than 100 stable qubits.</p>
    
    <p>"What we've achieved here is nothing short of revolutionary," says Dr. Sarah Chen, lead researcher on the project. "Problems that would take classical supercomputers thousands of years to solve can now be completed in minutes."</p>
    
    <h2>Real-World Applications</h2>
    <p>The implications of this breakthrough extend far beyond theoretical computer science:</p>
    <ul>
      <li><strong>Drug Discovery:</strong> Simulating molecular interactions for new medicines</li>
      <li><strong>Climate Modeling:</strong> More accurate predictions for climate change</li>
      <li><strong>Cryptography:</strong> Both breaking and creating unbreakable encryption</li>
      <li><strong>Artificial Intelligence:</strong> Training AI models exponentially faster</li>
    </ul>
    
    <h2>Technical Innovation</h2>
    <p>The team overcame one of quantum computing's biggest challenges: maintaining qubit stability. Through a novel cooling system and error-correction algorithms, they achieved coherence times of over 10 minutes—a 100-fold improvement over previous systems.</p>
    
    <h2>What's Next?</h2>
    <p>While this breakthrough is significant, researchers caution that practical quantum computers are still years away from widespread deployment. The current system requires a controlled laboratory environment and extensive calibration.</p>
    
    <p>However, the team is optimistic about future developments. "We're now working on scaling up to 10,000 qubits while maintaining stability," Dr. Chen notes. "That's when we'll truly see quantum supremacy in action."</p>
  `,
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
    role: 'author' as const,
    bio: 'Quantum physicist and technology journalist specializing in cutting-edge computing',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  tags: ['quantum', 'computing', 'technology', 'science'],
  publishedAt: new Date('2025-11-20'),
  views: 15420,
  likes: 892,
  readTime: 8,
  isFeatured: true,
  status: 'published' as const,
  createdAt: new Date(),
  updatedAt: new Date()
};

const relatedArticles = Array.from({ length: 3 }, (_, i) => ({
  _id: `rel-${i}`,
  title: `Related Article ${i + 1}: Exploring Advanced Technologies`,
  slug: `related-${i + 1}`,
  excerpt: 'Discover more about cutting-edge innovations in technology and science.',
  content: '',
  featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
  category: mockArticle.category,
  author: mockArticle.author,
  tags: ['technology'],
  publishedAt: new Date(),
  views: 5000 + i * 1000,
  likes: 200 + i * 50,
  readTime: 5 + i,
  isFeatured: false,
  status: 'published' as const,
  createdAt: new Date(),
  updatedAt: new Date()
}));

export default function ArticlePage({ params }: { params: { slug: string } }) {
  // TODO: Replace with actual API call
  // const { data: article, isLoading } = useQuery(['article', params.slug], () => articlesAPI.getBySlug(params.slug));

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] w-full">
        <Image
          src={mockArticle.featuredImage}
          alt={mockArticle.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
            <div className="mb-6">
              <CategoryBadge category={mockArticle.category} size="lg" />
            </div>

            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              {mockArticle.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <Image
                  src={mockArticle.author.avatar!}
                  alt={mockArticle.author.username}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {mockArticle.author.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(mockArticle.publishedAt!)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {mockArticle.views}
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {mockArticle.likes}
                </span>
                <span>{mockArticle.readTime} min read</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: mockArticle.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {mockArticle.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/search?q=${tag}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-600 rounded-full text-sm transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((article) => (
                <ArticleCard key={article._id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
