// src/contexts/ContentContext.tsx

import { createContext, useEffect, useState } from "preact/compat";
import {
  fetchCategories,
  fetchArticlesByCategoryId,
  fetchArticleById,
} from "../api";

interface ContentProviderProps {
  children: React.ReactNode;
}

interface ArticleCache {
  [key: string]: any; // Consider specifying a more detailed type instead of any
}

interface Category {
    CategoryID: number;
    Title: string;
    Slug: string;
    CreatedAt: string;
    UpdatedAt: string | null;
  }
  
  interface CategoriesResponse {
    status: string;
    categories: Category[];
  }

interface ContentContextType {
    articles: Article[];
    categories: Category[]; // Use the Category type here
  loading: boolean;
  error: string | null;
  selectCategory: (categoryId: number) => void;
  fetchArticle: (articleId: string) => Promise<any>; // Adjust the return type as needed
}


export interface Article {
    ArticleID: number;
    CategoryID: number;
    Title: string;
    Description: string;
    DetailedDescription: string;
    ImgSrc: string;
    Archived: number;
    StaffOnly: number;
    Slug: string;
    Version: number;
    CreatedAt: string;
    UpdatedAt: string | null;
  }
  
  interface ArticlesResponse {
    status: string;
    articles: Article[];
  }

export const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleCache, setArticleCache] = useState<ArticleCache>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // Fetch categories on mount
  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then((data:CategoriesResponse) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // Fetch articles when a category is selected
  useEffect(() => {
    if (selectedCategoryId !== null) {
      setLoading(true);
      fetchArticlesByCategoryId(selectedCategoryId.toString())
        .then((data:ArticlesResponse) => {
          setArticles(data.articles);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
          setLoading(false);
        });
    }
  }, [selectedCategoryId]);

  // Function to fetch an article by ID, with caching
  const fetchArticle = async (articleId: string) => {
    if (articleCache.hasOwnProperty(articleId)) {
      return articleCache[articleId];
    } else {
      try {
        const articleData = await fetchArticleById(articleId);
        setArticleCache((prev) => ({ ...prev, [articleId]: articleData }));
        return articleData;
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }
  };

  // Function to handle category selection
  const selectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <ContentContext.Provider
      value={{
        articles,
        categories,
        loading,
        error,
        selectCategory,
        fetchArticle,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
