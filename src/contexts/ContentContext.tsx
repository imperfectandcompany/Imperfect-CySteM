// src/contexts/ContentContext.tsx

import { createContext, useEffect, useState } from "preact/compat";
import {
  fetchCategories,
  fetchArticlesByCategoryId,
  fetchArticleById,
  fetchArticleBySlug,
  toggleArticleArchiveStatus,
  toggleArticleStaffOnlyStatus,
} from "../api";

interface ContentProviderProps {
  children: React.ReactNode;
}

interface ArticleCache {
    [key: string]: Article; // Use the Article type here
  }

export interface Category {
    CategoryID: number;
    Title: string;
    Slug: string;
    CreatedAt: string;
    UpdatedAt: string | null;
    ArticleCount: number;
  }
  
  interface CategoriesResponse {
    status: string;
    categories: Category[];
  }

interface ContentContextType {
    articles: Article[] | IArticle[];
    categories: Category[]; // Use the Category type here
  loading: boolean;
  error: string | null;
  selectCategory: (categoryId: number) => void;
  fetchArticle: (articleId: string) => Promise<any>; // Adjust the return type as needed
  fetchArticleBySlugDirectly: (articleSlug: string) => Promise<any>;
  currentArticle: Article | IArticle | null;
  toggleArticleStaffOnly: (articleId: number) => Promise<void>; // Add this line
  setArticles: (articles: Article[] | IArticle[]) => void;
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

  export interface IArticle {
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

  interface ArticleResponse {
    status: string;
    article: Article[];
  }

export const ContentContext = createContext<ContentContextType | null>(null);


interface CategoryWithArticles {
  category: Category;
  articles: Article[];
}

interface ContentContextType {
  categoryArticles: CategoryWithArticles[];
}

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleCache, setArticleCache] = useState<ArticleCache>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [categoryArticles, setCategoryArticles] = useState<CategoryWithArticles[]>([]);

    // This will hold the articles for each category that has been fetched
    const [categoryArticlesCache, setCategoryArticlesCache] = useState<{ [categoryId: number]: Article[] }>({});



  // const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
  //   null
  // );

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
  // useEffect(() => {
  //   if (selectedCategoryId !== null) {
  //     setLoading(true);
  //     fetchArticlesByCategoryId(selectedCategoryId.toString())
  //       .then((data:ArticlesResponse) => {
  //         setArticles(data.articles);
  //         setLoading(false);
  //       })
  //       .catch((e) => {
  //         setError(e.message);
  //         setLoading(false);
  //       });
  //   }
  // }, [selectedCategoryId]);





  const toggleArticleArchive = async (articleId: string) => {
    setLoading(true);
    try {
      const updatedArticle = await toggleArticleArchiveStatus(articleId);
      // Update the article in the cache and articles state
      setArticleCache(prev => ({ ...prev, [articleId]: updatedArticle }));
      setArticles(prev => prev.map(article => article.ArticleID === updatedArticle.ArticleID ? updatedArticle : article));
      setLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };


  const toggleArticleStaffOnly = async (articleId: number) => {
    setLoading(true);
    try {
      const updatedArticle = await toggleArticleStaffOnlyStatus(articleId);
      // Update the article in the cache
      setArticleCache(prev => {
        const newCache = { ...prev };
        newCache[articleId] = updatedArticle;
        return newCache;
      });
      // Update the articles array
      setArticles(prev => prev.map(article => {
        return article.ArticleID === updatedArticle.ArticleID ? updatedArticle : article;
      }));
      setLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };





  // Function to fetch an article by slug with caching
  const fetchArticleBySlugDirectly = async (slug: string) => {
    // Check if the article is already in the cache
    const cachedArticle = Object.values(articleCache).find(
      (article) => article?.Slug === slug
    );

    if (cachedArticle) {
      setCurrentArticle(cachedArticle);
      return; // Return early as we already have the article
    }

    setLoading(true);
    try {
      const articleData: ArticleResponse = await fetchArticleBySlug(slug);
      const article = articleData.article[0];
      if (article) {
        // Update the cache with the new article
        setArticleCache((prev) => ({ ...prev, [article.ArticleID]: article }));
        setCurrentArticle(article);
      }
      setLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  // Function to fetch an article by ID, with caching
  const fetchArticle = async (articleId: string) => {
    setLoading(true); // Set loading to true at the start of the fetchArticle function
    if (articleCache.hasOwnProperty(articleId)) {
      setLoading(false); // Set loading to false if the article is already in the cache
      return articleCache[articleId];
    } else {
      try {
        const articleData = await fetchArticleById(articleId);
        setArticleCache((prev) => ({ ...prev, [articleId]: articleData }));
        setLoading(false); // Set loading to false after the article data is fetched
        return articleData;
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false); // Ensure loading is set to false if an error occurs
      }
    }
  };


  // Function to handle category selection
  const selectCategory = async (categoryId: number) => {
    // Check if we already have the articles for this category in the cache
    if (categoryArticlesCache[categoryId]) {
      // If we do, just set the articles from the cache
      setArticles(categoryArticlesCache[categoryId]);
    } else {
      // If not, fetch the articles and update the cache
      setLoading(true);
      try {
        const data: ArticlesResponse = await fetchArticlesByCategoryId(categoryId.toString());
        setArticles(data.articles);
        // Update the cache with the new articles
        setCategoryArticlesCache(prev => ({ ...prev, [categoryId]: data.articles }));
        setLoading(false);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    }
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
        fetchArticleBySlugDirectly, // Add this to the context
        currentArticle, // Add this to the context     
        toggleArticleStaffOnly,
        setArticles
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
