// src/utils/api.ts

import {
  ActionLogsResponse,
  Article,
  ArticleSlugCheckResponse,
  Category,
  DeletedArticlesResponse,
  DeletedCategoriesResponse,
} from "./contexts/ContentContext";
import { getToken } from "./utils";

export const API_BASE_URL = "https://api.imperfectgamers.org/support";

export const fetchArticlesByCategoryId = async (categoryId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/articles/fetchByCategory/${categoryId}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch articles for category ${categoryId}`);
  }
  return response.json();
};

export const fetchArticleById = async (articleId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/article/fetchById/${articleId}`
  );
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
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to toggle staff only status for article ${articleId}`
    );
  }
  return response.json();
};

export const deleteArticle = async (articleId: number): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/article/delete/${articleId}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete article");
  }
};

export const deleteCategory = async (categoryId: number): Promise<void> => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/category/delete/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
};

// Function to fetch action logs for an article
export const fetchArticleActionLogsCall = async (articleId: number) => {
  const token = getToken();
  const response = await fetch(
    `${API_BASE_URL}/article/fetchActionLogs/${articleId}`,
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch action logs for article ${articleId}`);
  }
  const jsonResponse: ActionLogsResponse = await response.json();
  return jsonResponse;
};

export const createArticle = async (articleData: {
  title: string;
  description: string;
  detailedDescription: string;
  categoryId: number;
  imgSrc: string;
}): Promise<any> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/article/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(articleData),
  });
  if (!response.ok) {
    throw new Error("Failed to create article");
  }
  return response.json();
};

export const checkArticleSlugExists = async (
  slug: string
): Promise<boolean> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/article/fetchBySlug/${slug}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to check if article title or slug exists");
  }
  const data: ArticleSlugCheckResponse = await response.json();
  if (data.article === "Article not found") {
    return false;
  } else {
    return true;
  }
};

export const toggleArticleStaffOnlyStatus = async (articleId: number) => {
  const token = getToken();
  const url = new URL(`${API_BASE_URL}/article/toggleStaffOnly/${articleId}`);
  // if(token){
  //   url.searchParams.append("token", token); // Append token as a query parameter
  // }

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to toggle staff only status for article ${articleId}`
    );
  }
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

// Function to fetch deleted categories
export const fetchDeletedCategories = async (): Promise<DeletedCategoriesResponse> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/categories/deleted`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch deleted categories");
  }
  return response.json();
};

// Function to fetch deleted articles
export const fetchDeletedArticles = async (): Promise<DeletedArticlesResponse> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/articles/deleted`, {
    headers: {
      Authorization: `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch deleted articles");
  }
  return response.json();
};

// Function to restore a deleted article
export const restoreArticle = async (articleId: number): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/article/restore/${articleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to restore article with ID ${articleId}`);
  }
};

// Function to restore a deleted category
export const restoreCategory = async (categoryId: number): Promise<void> => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/category/restore/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to restore category with ID ${categoryId}`);
  }
};