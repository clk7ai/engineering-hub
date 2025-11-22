import { IArticle, APIResponse } from '@shared/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface FetchArticlesParams {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  sort?: 'latest' | 'popular' | 'trending';
}

export const articlesAPI = {
  /**
   * Fetch all articles with pagination and filters
   */
  async getAll(params: FetchArticlesParams = {}): Promise<APIResponse<IArticle[]>> {
    const { page = 1, limit = 10, category, featured, sort = 'latest' } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(featured && { featured: 'true' }),
      sort,
    });

    const response = await fetch(`${API_URL}/articles?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    
    return response.json();
  },

  /**
   * Fetch a single article by slug
   */
  async getBySlug(slug: string): Promise<APIResponse<IArticle>> {
    const response = await fetch(`${API_URL}/articles/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Article not found');
      }
      throw new Error('Failed to fetch article');
    }
    
    return response.json();
  },

  /**
   * Create a new article
   */
  async create(article: Partial<IArticle>): Promise<APIResponse<IArticle>> {
    const response = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create article');
    }
    
    return response.json();
  },

  /**
   * Update an existing article
   */
  async update(id: string, article: Partial<IArticle>): Promise<APIResponse<IArticle>> {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update article');
    }
    
    return response.json();
  },

  /**
   * Delete an article
   */
  async delete(id: string): Promise<APIResponse<void>> {
    const response = await fetch(`${API_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete article');
    }
    
    return response.json();
  },

  /**
   * Like an article
   */
  async like(id: string): Promise<APIResponse<{ likes: number }>> {
    const response = await fetch(`${API_URL}/articles/${id}/like`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to like article');
    }
    
    return response.json();
  },

  /**
   * Get featured articles
   */
  async getFeatured(limit: number = 5): Promise<APIResponse<IArticle[]>> {
    return this.getAll({ featured: true, limit });
  },

  /**
   * Get trending articles
   */
  async getTrending(limit: number = 10): Promise<APIResponse<IArticle[]>> {
    return this.getAll({ sort: 'popular', limit });
  },

  /**
   * Get articles by category
   */
  async getByCategory(categorySlug: string, params: FetchArticlesParams = {}): Promise<APIResponse<IArticle[]>> {
    return this.getAll({ ...params, category: categorySlug });
  },
};

export default articlesAPI;
