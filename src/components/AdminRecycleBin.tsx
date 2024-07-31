import { useContext, useEffect, useState } from "preact/hooks";
import { Article, Category, ContentContext } from "../contexts/ContentContext";

export function AdminRecycleBin() {
  const {
    deletedArticles,
    deletedCategories,
    fetchAndSetDeletedArticles,
    fetchAndSetDeletedCategories,
    handleRestoreArticle,
    handleRestoreCategory
  } = useContext(ContentContext);

  useEffect(() => {
    fetchAndSetDeletedArticles();
    fetchAndSetDeletedCategories();
  }, []);

  const [activeArticleId, setActiveArticleId] = useState<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const toggleArticle = (id: number) => {
    setActiveArticleId(activeArticleId === id ? null : id);
  };

  const toggleCategory = (id: number) => {
    setActiveCategoryId(activeCategoryId === id ? null : id);
  };

const handleRestoreArticleButton = async (articleId: number) => {
  try {
    await handleRestoreArticle(articleId);
    await fetchAndSetDeletedArticles(); // Refresh the list of deleted articles
  } catch (error) {
    console.error("Failed to restore article:", error);
  }
};


  const handleRestoreCategoryButton = async (categoryId: number) => {
    try {
      await handleRestoreCategory(categoryId);
      fetchAndSetDeletedCategories();
    } catch (error) {
      console.error("Failed to restore category:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Deleted Articles</h1>
    {deletedArticles && deletedArticles.map((article: Article) => (
      <div key={article.ArticleID} className="mb-4">
        <button 
          onClick={() => toggleArticle(article.ArticleID)}
          className="flex justify-between items-center w-full text-left text-lg font-semibold text-stone-900 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none"
        >
          {article.Title}
          <span className={`transform transition-transform duration-300 text-indigo-500 ${activeArticleId === article.ArticleID ? "rotate-180" : "rotate-0"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {activeArticleId === article.ArticleID && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 transition-max-height duration-500 ease-in-out overflow-hidden max-h-screen">
                  <div>
                    <p>
                      Created:{" "}
                      {article.CreatedAt
                        ? new Date(article.CreatedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      Deleted:{" "}
                      {article.DeletedAt
                        ? new Date(article.DeletedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestoreArticleButton(article.ArticleID)}
                    className="text-green-500 hover:text-green-700 hover:underline"
                  >
                    Restore
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

      <h1 className="text-2xl font-bold mb-4">Deleted Categories</h1>
      {deletedCategories &&
        deletedCategories.map((category: Category) => (
          <div key={category.CategoryID} className="mb-4">
            <button
              onClick={() => toggleCategory(category.CategoryID)}
              className="flex justify-between items-center w-full text-left text-lg font-semibold text-stone-900 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none"
            >
              {category.Title}
              <span
                className={`transform transition-transform duration-300 text-indigo-500 ${
                  activeCategoryId === category.CategoryID
                    ? "rotate-180"
                    : "rotate-0"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            {activeCategoryId === category.CategoryID && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 transition-max-height duration-500 ease-in-out overflow-hidden max-h-screen">

                  <div>
                    <p>
                      Created:{" "}
                      {category.CreatedAt
                        ? new Date(category.CreatedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      Deleted:{" "}
                      {category.DeletedAt
                        ? new Date(category.DeletedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRestoreCategoryButton(category.CategoryID)}
                    className="text-green-500 hover:text-green-700 hover:underline"
                  >
                    Restore
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
}
