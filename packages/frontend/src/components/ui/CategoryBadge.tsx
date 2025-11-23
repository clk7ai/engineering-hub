import React from 'react';
import { ICategory } from '@shared/types';

interface CategoryBadgeProps {
  category: ICategory | { name: string; slug: string; color?: string };
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  size = 'md',
  clickable = true 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const backgroundColor = category.color || '#0A7FBF';

  const badgeClasses = `
    inline-flex items-center
    ${sizeClasses[size]}
    rounded-full
    font-semibold
    text-white
    transition-all
    duration-200
    ${clickable ? 'hover:opacity-80 cursor-pointer' : ''}
  `.trim();

  const content = (
    <span
      className={badgeClasses}
      style={{ backgroundColor }}
    >
      {category.name}
    </span>
  );

  if (clickable && 'slug' in category) {
    return (
      <a href={`/category/${category.slug}`}>
        {content}
      </a>
    );
  }

  return content;
};

export default CategoryBadge;
