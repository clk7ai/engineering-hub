import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IArticle } from '@shared/types';

interface ArticleCardProps {
  article: IArticle;
  variant?: 'default' | 'featured' | 'compact';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'default' }) => {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (variant === 'featured') {
    return (
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300">
          {/* Featured Image */}
          <div className="relative h-96 overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {article.isFeatured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">
                Featured
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: article.category?.color || '#0A7FBF' }}
              >
                {article.category?.name}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary-500 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-600 text-lg mb-4 line-clamp-3">{article.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>{article.author?.username || 'Anonymous'}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt!)}</span>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {article.views}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {article.likes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="flex space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-500 transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center text-xs text-gray-500 space-x-2">
              <span>{formatDate(article.publishedAt!)}</span>
              <span>•</span>
              <span>{article.readTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: article.category?.color || '#0A7FBF' }}
            >
              {article.category?.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>{article.author?.username || 'Anonymous'}</span>
              <span>•</span>
              <span>{formatDate(article.publishedAt!)}</span>
            </div>
            <span>{article.readTime} min read</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {article.views}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" />
                </svg>
                {article.commentsCount || 0}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {article.likes}
              </span>
            </div>
            <span className="text-primary-500 text-xs font-semibold group-hover:underline">
              Read more →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
