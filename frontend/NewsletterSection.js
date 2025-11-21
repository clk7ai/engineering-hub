import React from 'react';

const NewsletterSection = () => {
  const newsletters = [
    {
      id: 1,
      name: 'The Blueprint',
      icon: '🛰️',
      description: 'Daily news digest with the latest engineering, tech & science news',
      frequency: 'Monday to Saturday'
    },
    {
      id: 2,
      name: 'AI Logs',
      icon: '🧠',
      description: 'Latest AI advancements and insights delivered to your inbox',
      frequency: 'Every Monday'
    },
    {
      id: 3,
      name: 'Engineer Pros',
      icon: '🧑🔧',
      description: 'Expert advice on engineering careers and professional development',
      frequency: 'Weekly'
    },
    {
      id: 4,
      name: 'The Vital Component',
      icon: '⚙️',
      description: 'Top engineering stories and deep dives into tech trends',
      frequency: 'Weekly'
    },
    {
      id: 5,
      name: 'Gears in Motion',
      icon: '🔷',
      description: 'Explore the wonders of mechanical engineering',
      frequency: 'Weekly'
    },
    {
      id: 6,
      name: 'IE+ Premium',
      icon: '⭐',
      description: 'Exclusive interviews, analysis and premium content',
      frequency: 'Weekly + Ad-free'
    }
  ];

  return (
    <div className="newsletter-section">
      <h2>Newsletters</h2>
      <p className="subtitle">Choose your favorite topics and get updated directly in your inbox</p>
      
      <div className="newsletters-grid">
        {newsletters.map(newsletter => (
          <div key={newsletter.id} className="newsletter-card">
            <div className="newsletter-icon">{newsletter.icon}</div>
            <h3>{newsletter.name}</h3>
            <p className="newsletter-description">{newsletter.description}</p>
            <p className="newsletter-frequency">📬 {newsletter.frequency}</p>
            <button className="subscribe-btn">Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsletterSection;
