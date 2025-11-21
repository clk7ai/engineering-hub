import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Engineering Hub</h1>
        <p>Latest Engineering News & Innovations</p>
      </header>
      <main>
        {loading ? (
          <p>Loading articles...</p>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <article key={article.id} className="article-card">
                <h2>{article.title}</h2>
                <p className="category">{article.category}</p>
                <p className="date">{article.date}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
