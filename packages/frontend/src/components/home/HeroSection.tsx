'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IArticle } from '@shared/types';
import CategoryBadge from '../ui/CategoryBadge';

interface HeroSectionProps {
  featuredArticle: IArticle;
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredArticle }) => {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <Link
          href={`/articles/${featuredArticle.slug}`}
          className="group block"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Featured Image */}
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={featuredArticle.featuredImage}
                alt={featuredArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {featuredArticle.isFeatured && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-accent-500 text-white text-sm font-bold rounded-full shadow-lg">
                  🔥 FEATURED
                </div>
              )}
            </div>

            {/* Content */}
            <div className="text-white space-y-6">
              <div className="flex items-center space-x-3">
                {featuredArticle.category && (
                  <CategoryBadge
                    category={featuredArticle.category}
                    size="lg"
                  />
                )}
                <span className="text-gray-300 text-sm">
                  {formatDate(featuredArticle.publishedAt!)}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-heading font-bold leading-tight group-hover:text-primary-400 transition-colors">
                {featuredArticle.title}
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span>{featuredArticle.author?.username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{featuredArticle.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  <span>{featuredArticle.readTime} min read</span>
                </div>
              </div>

              <div className="pt-4">
                <span className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors group-hover:shadow-lg">
                  Read Full Story
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
