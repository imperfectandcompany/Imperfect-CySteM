// src/utils/api.ts

const API_BASE_URL = 'https://api.imperfectgamers.org/support';

export const fetchArticlesByCategoryId = async (categoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/articles/fetchByCategory/${categoryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch articles for category ${categoryId}`);
    }
    return response.json();
  };
  
  export const fetchArticleById = async (articleId: string) => {
    const response = await fetch(`${API_BASE_URL}/article/fetchById/${articleId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch article with id ${articleId}`);
    }
    return response.json();
  };

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};