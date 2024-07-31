// src/contexts/ContentContext.tsx

import { createContext, useEffect, useState } from "preact/compat";
import {
  fetchCategories,
  fetchArticlesByCategoryId,
  fetchArticleById,
  fetchArticleBySlug,
  toggleArticleArchiveStatus,
  toggleArticleStaffOnlyStatus,
  API_BASE_URL,
  fetchArticleActionLogsCall,
  restoreArticle,
  restoreCategory,
  fetchDeletedArticles,
  fetchDeletedCategories
} from "../api";
import { getToken } from "../utils";

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
    VersionID: number | null;
    DeletedAt: string | null;
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
  fetchArticle: (articleId: number) => Promise<any>; // Adjust the return type as needed
  fetchArticleBySlugDirectly: (articleSlug: string) => Promise<any>;
  currentArticle: Article | IArticle | null;
  toggleArticleArchive: (articleId: number) => Promise<void>; // Add this line
  toggleArticleStaffOnly: (articleId: number) => Promise<void>; // Add this line
  setArticles: (articles: Article[] | IArticle[]) => void;
  setCategories: (categories: Category[]) => void;
  updateArticleById: (articleId: number, updatedData: Partial<Article>) => void; // Fix the implicit 'any' type
  fetchArticleVersions: (articleId: number) => Promise<ArticleVersionsResponse>; // Fix the implicit 'any' type
  fetchCategoryVersions: (categoryId: number) => Promise<CategoryVersionsResponse>; // Fix the implicit 'any' type
  fetchArticleActionLogs: (articleId: number) => Promise<void>;
  actionLogs:any;
  deletedCategories: Category[];
  deletedArticles: Article[];
  handleRestoreArticle: (articleId: number) => Promise<void>;
  handleRestoreCategory: (categoryId: number) => Promise<void>;
  fetchAndSetDeletedCategories: () => Promise<void>;
  fetchAndSetDeletedArticles: () => Promise<void>;
  updateCategory: (updatedCategory: Category) => void;
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
    DeletedAt: string | null;
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
    DeletedAt: string | null;
  }
  
  export interface CategoryVersion {
    VersionID: number;
    CategoryID: number;
    Title: string;
    Slug: string;
    CreatedAt: string;
    DeletedAt: string | null;
  }
  

  export interface ArticleVersion {
    VersionID: number;
    ArticleID: number;
    CategoryID: number;
    Title: string;
    Description: string;
    DetailedDescription: string;
    Slug: string;
    ImgSrc: string;
    CreatedAt: string;
    StaffOnly: number;
    Archived: number;
  }

  export interface ArticleVersionsResponse {
    status: string;
    versions: ArticleVersion[];
  }

  export interface CategoryVersion {
    VersionID: number;
    CategoryID: number;
    Title: string;
    Slug: string;
    CreatedAt: string;
    DeletedAt: string | null;
    ArticleCount: number | 0;
  }

  export interface CategoryVersionsResponse {
    status: string;
    currentVersion: CategoryVersion[];
    versions: CategoryVersion[];
  }

  // export interface CreateArticleResponse {
  //   status: string;
  //   versions: ArticleVers[];
  // }

  export interface ArticleSlugCheckResponse {
    status: string;
    article: Article | 'Article not found';
  }

  export interface CategoryCreateResponse {
    status: string;
    message: string;
    categoryId: number;
  }

  export interface ArticleCreateResponse {
    status: string;
    message: string;
    articleID: number;
  }
  
  interface ArticlesResponse {
    status: string;
    articles: Article[];
  }

  interface ArticleResponse {
    status: string;
    article: Article[];
  }

export  interface DeletedArticlesResponse {
    status: string;
    deletedArticles: Article[];
  }

  export interface DeletedCategoriesResponse {
    status: string;
    deletedCategories: Category[];
  }

// Define an interface for a single log entry
export interface ActionLog {
  LogID: number;
  UserID: number;
  Username: string;
  VersionID: number;
  ActionType: string[]; // Updated to be an array of strings
  CreatedAt: string;
}

// Define an interface for the respo nse from the fetchArticleActionLogs API call
export interface ActionLogsResponse {
  status: string;
  logs: ActionLog[];
}

export const ContentContext = createContext<ContentContextType | null>(null);

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
  const [actionLogs, setActionLogs] = useState<{ [versionId: number]: any[] }>({});

    // This will hold the articles for each category that has been fetched
    const [categoryArticlesCache, setCategoryArticlesCache] = useState<{ [categoryId: number]: Article[] }>({});

// Add new state hooks for deleted categories and articles
const [deletedCategories, setDeletedCategories] = useState<Category[]>([]);
const [deletedArticles, setDeletedArticles] = useState<Article[]>([]);

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


  const toggleArticleArchive = async (articleId: number) => {
    setLoading(true);
  
    // Find the affected article and its category ID
    const affectedArticle = articles.find(article => article.ArticleID === articleId);
    const affectedCategoryId = affectedArticle?.CategoryID;
  
    // Optimistically update the article's Archived status
    if (affectedArticle) {
      const updatedArticle = { ...affectedArticle, Archived: affectedArticle.Archived ? 0 : 1 };
  
      // Update the articles state immediately
      setArticles(prevArticles =>
        prevArticles.map(article =>
          article.ArticleID === articleId ? updatedArticle : article
        )
      );
  
      // Update the article cache immediately
      setArticleCache(prev => {
        const newCache = { ...prev };
        newCache[articleId] = updatedArticle;
        return newCache;
      });
  
      // Update the categoryArticlesCache if applicable
      if (affectedCategoryId) {
        setCategoryArticlesCache(prevCache => {
          const newCache = { ...prevCache };
          if (newCache[affectedCategoryId]) {
            newCache[affectedCategoryId] = newCache[affectedCategoryId].map(article =>
              article.ArticleID === articleId ? updatedArticle : article
            );
          }
          return newCache;
        });
      }
    }
  
    try {
      // Call the API to toggle the archive status
      const response = await toggleArticleArchiveStatus(articleId);
      const { versionID } = response;
  
      // Successfully updated article with correct versionID
      if (affectedArticle) {
        const updatedArticleWithVersion: Article = {
          ...affectedArticle,
          Archived: affectedArticle.Archived ? 0 : 1, // Ensuring the state is consistent
          Version: versionID
        };
  
        // Update the articles state
        setArticles(prevArticles =>
          prevArticles.map(article =>
            article.ArticleID === articleId ? updatedArticleWithVersion : article
          )
        );
  
        // Update the article cache
        setArticleCache(prev => {
          const newCache = { ...prev };
          newCache[articleId] = updatedArticleWithVersion;
          return newCache;
        });
  
        // Update the categoryArticlesCache if applicable
        if (affectedCategoryId) {
          setCategoryArticlesCache(prevCache => {
            const newCache = { ...prevCache };
            if (newCache[affectedCategoryId]) {
              newCache[affectedCategoryId] = newCache[affectedCategoryId].map(article =>
                article.ArticleID === articleId ? updatedArticleWithVersion : article
              );
            }
            return newCache;
          });
        }
      }
    } catch (e) {
      // Revert changes in case of an error
      if (affectedArticle) {
        const revertedArticle = { ...affectedArticle };
  
        setArticles(prevArticles =>
          prevArticles.map(article =>
            article.ArticleID === articleId ? revertedArticle : article
          )
        );
  
        setArticleCache(prev => {
          const newCache = { ...prev };
          newCache[articleId] = revertedArticle;
          return newCache;
        });
  
        if (affectedCategoryId) {
          setCategoryArticlesCache(prevCache => {
            const newCache = { ...prevCache };
            if (newCache[affectedCategoryId]) {
              newCache[affectedCategoryId] = newCache[affectedCategoryId].map(article =>
                article.ArticleID === articleId ? revertedArticle : article
              );
            }
            return newCache;
          });
        }
      }
  
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  


  const toggleArticleStaffOnly = async (articleId: number) => {
    setLoading(true);
  
    // Find the affected article and its category ID
    const affectedArticle = articles.find(article => article.ArticleID === articleId);
    const affectedCategoryId = affectedArticle?.CategoryID;
  
    // Optimistically update the article's StaffOnly status
    if (affectedArticle) {
      const updatedArticle = { ...affectedArticle, StaffOnly: affectedArticle.StaffOnly ? 0 : 1 };
  
      // Update the articles state immediately
      setArticles(prevArticles =>
        prevArticles.map(article =>
          article.ArticleID === articleId ? updatedArticle : article
        )
      );
  
      // Update the article cache immediately
      setArticleCache(prev => {
        const newCache = { ...prev };
        newCache[articleId] = updatedArticle;
        return newCache;
      });
  
      // Update the categoryArticlesCache if applicable
      if (affectedCategoryId) {
        setCategoryArticlesCache(prevCache => {
          const newCache = { ...prevCache };
          if (newCache[affectedCategoryId]) {
            newCache[affectedCategoryId] = newCache[affectedCategoryId].map(article =>
              article.ArticleID === articleId ? updatedArticle : article
            );
          }
          return newCache;
        });
      }
    }
  
    try {
      // Call the API to toggle the staff-only status
      const response = await toggleArticleStaffOnlyStatus(articleId);
      const { versionID } = response;
  
      // Update the article with the new version ID
      if (affectedArticle) {
        const updatedArticleWithVersion: Article = {
          ...affectedArticle,
          StaffOnly: affectedArticle.StaffOnly ? 0 : 1, // Ensuring the state is consistent
          Version: versionID
        };
  
        // Update the articles state
        setArticles(prevArticles =>
          prevArticles.map(article =>
            article.ArticleID === articleId ? updatedArticleWithVersion : article
          )
        );
  
        // Update the article cache
        setArticleCache(prev => {
          const newCache = { ...prev };
          newCache[articleId] = updatedArticleWithVersion;
          return newCache;
        });
  
        // Update the categoryArticlesCache if applicable
        if (affectedCategoryId) {
          setCategoryArticlesCache(prevCache => {
            const newCache = { ...prevCache };
            if (newCache[affectedCategoryId]) {
              newCache[affectedCategoryId] = newCache[affectedCategoryId].map(article =>
                article.ArticleID === articleId ? updatedArticleWithVersion : article
              );
            }
            return newCache;
          });
        }
      }
    } catch (e) {
      // Revert changes in case of an error
      if (affectedArticle) {
        const revertedArticle = { ...affectedArticle };
  
        setArticles(prevArticles =>
          prevArticles.map(article =>
            article.ArticleID === articleId ? revertedArticle : article
          )
        );
  
        setArticleCache(prev => {
          const newCache = { ...prev };
          newCache[articleId] = revertedArticle;
          return newCache;
        });
  
        if (affectedCategoryId) {
          setCategoryArticlesCache(prevCache => {
            const newCache = { ...prevCache };
            if (newCache[affectedCategoryId]) {
              newCache[affectedCategoryId] = newCache[affectedCategoryId].map(article =>
                article.ArticleID === articleId ? revertedArticle : article
              );
            }
            return newCache;
          });
        }
      }
  
      if (e instanceof Error) {
        alert(e.message);
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
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



  const updateCategory = (updatedCategory: Category) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.CategoryID === updatedCategory.CategoryID ? updatedCategory : cat
      )
    );
  };


// Update the fetchArticleActionLogs function with proper typing
const fetchAndSetArticleActionLogs = async (articleId: number): Promise<void> => {
  setLoading(true);
  try {
    const logsData: ActionLogsResponse = await fetchArticleActionLogsCall(articleId);
    setActionLogs(prev => ({ ...prev, [articleId]: logsData.logs }));
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
  const fetchArticle = async (articleId: number) => {
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
      return data;
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


const updateArticleById = async (articleId: number, updatedArticleData: any) => {
  const token = getToken();

  // Optimistically update the article state and cache with the provided data
  const optimisticUpdate: Partial<Article> = {
    CategoryID: updatedArticleData.categoryId,
    Title: updatedArticleData.title,
    Description: updatedArticleData.description,
    DetailedDescription: updatedArticleData.detailedDescription,
    ImgSrc: updatedArticleData.imgSrc,
    Version: undefined,  // This will be updated after receiving the version ID from the backend
  };

  // Determine the old category ID by searching in the categoryArticlesCache
  let oldCategoryId: number | undefined;
  for (const [categoryId, articles] of Object.entries(categoryArticlesCache)) {
    if (articles.some(article => article.ArticleID === articleId)) {
      oldCategoryId = Number(categoryId);
      break;
    }
  }

  const newCategoryId = updatedArticleData.categoryId;

  // Update the articles state immediately
  setArticles(prevArticles =>
    prevArticles.map(article =>
      article.ArticleID === articleId ? { ...article, ...optimisticUpdate } : article
    ) as Article[]
  );

  // Update the article cache immediately
  setArticleCache(prevCache => ({
    ...prevCache,
    [articleId]: { ...prevCache[articleId], ...optimisticUpdate }
  }));

  // Update the categoryArticlesCache
  setCategoryArticlesCache(prev => {
    const updatedCache = { ...prev };

    // Remove the article from the old category's articles if it's changing categories
    if (oldCategoryId && oldCategoryId !== newCategoryId) {
      updatedCache[oldCategoryId] = updatedCache[oldCategoryId].filter(
        article => article.ArticleID !== articleId
      );
    }

    // Add or update the article in the new category's articles
    if (updatedCache[newCategoryId]) {
      updatedCache[newCategoryId] = updatedCache[newCategoryId].some(article => article.ArticleID === articleId)
        ? updatedCache[newCategoryId].map(article =>
            article.ArticleID === articleId ? { ...article, ...optimisticUpdate } : article
          )
        : [...updatedCache[newCategoryId], { ...optimisticUpdate, ArticleID: articleId } as Article];
    } else {
      // If the new category does not exist in the cache, create it
      updatedCache[newCategoryId] = [{ ...optimisticUpdate, ArticleID: articleId } as Article];
    }

    return updatedCache;
  });

  // Call the API endpoint to update the article
  try {
    const response = await fetch(`${API_BASE_URL}/article/update/${articleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify(updatedArticleData),
    });

    if (!response.ok) {
      throw new Error('Failed to update article');
    }

    const result = await response.json();
    const { versionID } = result;

    // Finalize the update with the correct version ID
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.ArticleID === articleId ? { ...article, Version: versionID } : article
      ) as Article[]
    );

    setArticleCache(prevCache => ({
      ...prevCache,
      [articleId]: { ...prevCache[articleId], Version: versionID }
    }));

    setCategoryArticlesCache(prev => {
      const updatedCache = { ...prev };

      // Update the article in the new category with the correct version ID
      if (updatedCache[newCategoryId]) {
        updatedCache[newCategoryId] = updatedCache[newCategoryId].map(article =>
          article.ArticleID === articleId ? { ...article, Version: versionID } : article
        );
      }

      return updatedCache;
    });

    return versionID;
  } catch (error) {
    // Handle the error and potentially revert the optimistic update
    if (error instanceof Error) {
      console.error('Error updating article:', error);
      setError(error.message);
    } else {
      console.error('Error updating article:', error);
      setError('An unknown error occurred');
    }
    throw error;
  }
};




  
  


  async function fetchArticleVersions(articleId: number): Promise<ArticleVersionsResponse> {
    
    const token = getToken();

    // Call the API endpoint to fetch article versions
    const response = await fetch(`${API_BASE_URL}/article/fetchVersions/${articleId}`, {
      headers: {
        'Authorization': `${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch article versions');
    }
    const data: ArticleVersionsResponse = await response.json();
    return data;
  };
  
  async function fetchCategoryVersions(categoryId: number): Promise<CategoryVersionsResponse> {
    
    const token = getToken();

    // Call the API endpoint to fetch article versions
    const response = await fetch(`${API_BASE_URL}/category/fetchVersions/${categoryId}`, {
      headers: {
        'Authorization': `${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch article versions');
    }
    const data: CategoryVersionsResponse = await response.json();
    return data;
  };

// Function to fetch deleted categories
const fetchAndSetDeletedCategories = async () => {
  setLoading(true);
  try {
    const response:DeletedCategoriesResponse = await fetchDeletedCategories();
    setDeletedCategories(response.deletedCategories);
    setLoading(false);
  } catch (error) {
    setError('Failed to fetch deleted categories');
    setLoading(false);
  }
};

// Function to fetch deleted articles
const fetchAndSetDeletedArticles = async () => {
  setLoading(true);
  try {
    const response:DeletedArticlesResponse = await fetchDeletedArticles();
    setDeletedArticles(response.deletedArticles);
    setLoading(false);
  } catch (error) {
    setError('Failed to fetch deleted articles');
    setLoading(false);
  }
};


// Function to restore an article and update context
const handleRestoreArticle = async (articleId: number) => {
  try {
    await restoreArticle(articleId);
    // Optionally remove the article from deletedArticles state or refetch deleted articles
    setDeletedArticles(prev => prev.filter(article => article.ArticleID !== articleId));
    // You might also want to update the articles state if needed
  } catch (error) {
    console.error(error);
  }
};

// Function to restore a category and update context
const handleRestoreCategory = async (categoryId: number) => {
  try {
    await restoreCategory(categoryId);
    // Optionally remove the category from deletedCategories state or refetch deleted categories
    setDeletedCategories(prev => prev.filter(category => category.CategoryID !== categoryId));
    // You might also want to update the categories state if needed
  } catch (error) {
    console.error(error);
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
        actionLogs,
        fetchArticleActionLogs: fetchAndSetArticleActionLogs,
        toggleArticleArchive,
        toggleArticleStaffOnly,
        setArticles,
        updateArticleById,
        setCategories,
        fetchArticleVersions,
        fetchCategoryVersions,
        deletedCategories,
        deletedArticles,
        handleRestoreArticle,
        handleRestoreCategory,
        fetchAndSetDeletedCategories,
        fetchAndSetDeletedArticles,
        updateCategory
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
