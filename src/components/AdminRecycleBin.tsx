import { useContext, useEffect, useState } from "preact/hooks";
import { Article, Category, ContentContext } from "../contexts/ContentContext";
import Breadcrumb from "./Breadcrumb";

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
    <>
      <Breadcrumb path="/admin/recycle-bin" />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl mb-8">
          Recycle Bin
        </h1>
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Deleted Articles</h2>
          {deletedArticles.length === 0 ? (
            <div className="text-gray-500">No deleted articles found.</div>
          ) : (
            deletedArticles.map((article: Article) => (
              <div key={article.ArticleID} className="mb-4 border-b border-gray-200 pb-2">
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
                  <div className="py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Created: {article.CreatedAt ? new Date(article.CreatedAt).toLocaleDateString() : "N/A"}</p>
                        <p>Deleted: {article.DeletedAt ? new Date(article.DeletedAt).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreArticleButton(article.ArticleID)}
                        className="text-green-500 hover:text-green-700 hover:underline"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          <h2 className="text-2xl font-bold mt-8 mb-4">Deleted Categories</h2>
          {deletedCategories.length === 0 ? (
            <div className="text-gray-500">No deleted categories found.</div>
          ) : (
            deletedCategories.map((category: Category) => (
              <div key={category.CategoryID} className="mb-4 border-b border-gray-200 pb-2">
                <button
                  onClick={() => toggleCategory(category.CategoryID)}
                  className="flex justify-between items-center w-full text-left text-lg font-semibold text-stone-900 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none"
                >
                  {category.Title}
                  <span className={`transform transition-transform duration-300 text-indigo-500 ${activeCategoryId === category.CategoryID ? "rotate-180" : "rotate-0"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {activeCategoryId === category.CategoryID && (
                  <div className="py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Created: {category.CreatedAt ? new Date(category.CreatedAt).toLocaleDateString() : "N/A"}</p>
                        <p>Deleted: {category.DeletedAt ? new Date(category.DeletedAt).toLocaleDateString() : "N/A"}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreCategoryButton(category.CategoryID)}
                        className="text-green-500 hover:text-green-700 hover:underline"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}