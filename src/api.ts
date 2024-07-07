// src/utils/api.ts

import { ActionLogsResponse } from "./contexts/ContentContext";
import { getToken } from "./utils";

export const API_BASE_URL = 'https://api.imperfectgamers.org/support';

export const fetchArticlesByCategoryId = async (categoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/articles/fetchByCategory/${categoryId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch articles for category ${categoryId}`);
    }
    return response.json();
  };
  
  export const fetchArticleById = async (articleId: number) => {
    const response = await fetch(`${API_BASE_URL}/article/fetchById/${articleId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch article with id ${articleId}`);
    }
    return response.json();
  };
  
  // Add a new function to fetch an article by slug
export const fetchArticleBySlug = async (slug: string) => {
    const response = await fetch(`${API_BASE_URL}/article/fetchBySlug/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch article with slug ${slug}`);
    }
    return response.json();
  };

  export const toggleArticleArchiveStatus = async (articleId: number) => {

    const token = getToken();
        const url = new URL(`${API_BASE_URL}/article/toggleArchive/${articleId}`);
  
    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
    },    
    });
    if (!response.ok) {
      throw new Error(`Failed to toggle staff only status for article ${articleId}`);
    }
    return response.json();
  };


// Function to fetch action logs for an article 
export const fetchArticleActionLogsCall = async (articleId: number) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/article/fetchActionLogs/${articleId}`, {
    headers: {
      'Authorization': `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch action logs for article ${articleId}`);
  }
  const jsonResponse:ActionLogsResponse = await response.json();
  return jsonResponse;
};

export const toggleArticleStaffOnlyStatus = async (articleId: number) => {

  const token = getToken();
      const url = new URL(`${API_BASE_URL}/article/toggleStaffOnly/${articleId}`);
      // if(token){
      //   url.searchParams.append("token", token); // Append token as a query parameter
      // }

  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`,
  },    
  });
  if (!response.ok) {
    throw new Error(`Failed to toggle staff only status for article ${articleId}`);
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