'use client';

import { useState } from 'react';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  variant?: 'horizontal' | 'vertical' | 'floating';
  className?: string;
}

type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'email' | 'copy';

export default function SocialShare({
  title,
  url,
  description = '',
  variant = 'horizontal',
  className = ''
}: SocialShareProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showTooltip, setShowTooltip] = useState<SharePlatform | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareUrls: Record<SharePlatform, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    copy: url
  };

  const handleShare = (platform: SharePlatform) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      return;
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const shareButtons: Array<{
    platform: SharePlatform;
    icon: JSX.Element;
    label: string;
    color: string;
  }> = [
    {
      platform: 'twitter',
      label: 'Twitter',
      color: 'hover:bg-[#1DA1F2] hover:text-white',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      )
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      color: 'hover:bg-[#1877F2] hover:text-white',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      )
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      color: 'hover:bg-[#0A66C2] hover:text-white',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    },
    {
      platform: 'reddit',
      label: 'Reddit',
      color: 'hover:bg-[#FF4500] hover:text-white',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="10" r="1" /><circle cx="15" cy="10" r="1" />
          <path d="M22 11.816c0-1.256-1.02-2.277-2.277-2.277-.593 0-1.122.24-1.526.613a8.864 8.864 0 00-4.422-1.348l.75-3.512 2.452.486c.008 1.055.868 1.915 1.923 1.915 1.064 0 1.923-.859 1.923-1.923S19.964 4.847 18.9 4.847c-.788 0-1.471.477-1.766 1.158l-2.734-.542a.37.37 0 00-.429.296l-.835 3.917a8.846 8.846 0 00-4.458 1.347 2.27 2.27 0 00-1.526-.613C5.02 9.539 4 10.559 4 11.816c0 .827.445 1.548 1.105 1.942a4.124 4.124 0 00-.056.682c0 3.473 4.043 6.29 9.028 6.29 4.986 0 9.028-2.817 9.028-6.29a4.16 4.16 0 00-.056-.682A2.274 2.274 0 0022 11.816z" />
        </svg>
      )
    },
    {
      platform: 'email',
      label: 'Email',
      color: 'hover:bg-gray-600 hover:text-white',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      platform: 'copy',
      label: copiedLink ? 'Copied!' : 'Copy Link',
      color: copiedLink ? 'bg-green-500 text-white' : 'hover:bg-gray-600 hover:text-white',
      icon: copiedLink ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  if (variant === 'floating') {
    return (
      <div className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 space-y-2 ${className}`}>
        <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
          {shareButtons.map(({ platform, icon, label, color }) => (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              onMouseEnter={() => setShowTooltip(platform)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${color} text-gray-600 border border-gray-200`}
              title={label}
            >
              {icon}
              {showTooltip === platform && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                  {label}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`space-y-2 ${className}`}>
        <p className="text-sm font-medium text-gray-700 mb-3">Share this article</p>
        {shareButtons.map(({ platform, icon, label, color }) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${color} text-gray-700 border border-gray-200`}
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <p className="text-sm font-medium text-gray-700 mb-3">Share this article</p>
      <div className="flex flex-wrap gap-2">
        {shareButtons.map(({ platform, icon, label, color }) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${color} text-gray-700 border border-gray-200 text-sm font-medium`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
