import { useContext, useEffect, useState } from "preact/hooks";
import { FunctionalComponent } from "preact";
import { route } from "preact-router";
import Breadcrumb from "./Breadcrumb";
import { isFeatureEnabled } from "../featureFlags";
import { Article, Category, ContentContext } from "../contexts/ContentContext";

export const AdminDashboard: FunctionalComponent = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const {
    articles,
    categories,
    selectCategory,
    setCategories,
    toggleArticleStaffOnly,
    setArticles,
    loading,
    toggleArticleArchive,
    deleteArticle,
    deleteCategory,
  } = useContext(ContentContext);

  const handleToggleSection = (categoryId: number) => {
    setActiveSection((prevSection) =>
      prevSection === categoryId ? null : categoryId
    );
    if (activeSection !== categoryId) {
      selectCategory(categoryId);
    }
  };

  const handleEdit = (articleId: number) => {
    route(`/admin/edit/article/${articleId}`);
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".popover-container")) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleRoute = (
    path: string,
    event: { stopPropagation: () => void }
  ) => {
    event.stopPropagation();
    route(path);
  };

  const handleToggleStaffOnly = async (articleId: number) => {
    setArticles((prevArticles: Article[]) =>
      prevArticles.map((article) =>
        article.ArticleID === articleId
          ? { ...article, StaffOnly: article.StaffOnly ? 0 : 1 }
          : article
      )
    );

    try {
      await toggleArticleStaffOnly(articleId);
    } catch (error) {
      setArticles((prevArticles: Article[]) =>
        prevArticles.map((article) =>
          article.ArticleID === articleId
            ? { ...article, StaffOnly: article.StaffOnly ? 0 : 1 }
            : article
        )
      );
      console.error("Failed to toggle staff only status:", error);
    }
  };

  const handleToggleArchive = async (articleId: number) => {
    setArticles((prevArticles: Article[]) =>
      prevArticles.map((article) =>
        article.ArticleID === articleId
          ? { ...article, Archived: article.Archived ? 0 : 1 }
          : article
      )
    );

    try {
      await toggleArticleArchive(articleId);
    } catch (error) {
      setArticles((prevArticles: Article[]) =>
        prevArticles.map((article) =>
          article.ArticleID === articleId
            ? { ...article, StaffOnly: article.StaffOnly ? 0 : 1 }
            : article
        )
      );
      console.error("Failed to toggle archive:", error);
    }
  };

  // Optimistically delete an article from the UI
  const handleDeleteArticle = async (articleId: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(articleId);
        alert("Article deleted successfully");
      } catch (error) {
        alert("Failed to delete the article");
        console.error(error);
      }
    }
  };

  // Optimistically delete a category from the UI
  const handleDeleteCategory = async (categoryId: number) => {
    // Check if there are articles in the category
    const categoryArticles = articles.filter(
      (article: { CategoryID: number }) => article.CategoryID === categoryId
    );

    let confirmationMessage = `Are you sure you want to delete this category?`;
    if (categoryArticles.length > 0) {
      confirmationMessage += ` This category has ${categoryArticles.length} associated article(s) that will also be deleted.`;
    }

    const confirmation = confirm(confirmationMessage);
    if (confirmation) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ... rest of the component ...

  return (
    <div>
      <Breadcrumb path={`/admin`} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <span className="text-xs font-medium tracking-widest text-transparent uppercase bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">
          Admin Dashboard
        </span>
        <h1 className="mt-8 text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Imperfect Gamers
        </h1>
        <div className="flex justify-end mt-8">
          {isFeatureEnabled("AdminViewRequests") && (
            <button
              onClick={() => route("/admin/requests")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition ease-in-out duration-300"
            >
              Requests (Beta)
            </button>
          )}
        </div>
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-indigo-600 mb-4 sm:mb-0">
              Content Management
            </h2>
            <div className="relative popover-container space-x-2">
              {isFeatureEnabled("ViewAdminLogs") && (
                <button
                  onClick={() => route("/admin/logs")}
                  className="px-4 py-2 bg-indigo-100 text-stone-800 hover:text-white font-bold rounded hover:bg-indigo-600 transition duration-300 ease-in-out"
                >
                  Visit Admin Logs
                </button>
              )}
              {isFeatureEnabled("ViewRecycleBin") && (
                <button
                  onClick={() => route("/admin/recycle-bin")}
                  className="px-4 py-2 bg-indigo-100 text-stone-800 hover:text-white font-bold rounded hover:bg-indigo-600 transition duration-300 ease-in-out"
                >
                  Recycle Bin
                </button>
              )}
              <button
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                className="px-4 py-2 bg-indigo-50 text-stone-800 transition hover:text-white font-medium rounded-md inline-flex items-center"
              >
                Create New
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {isPopoverOpen && (
                <div className="absolute z-10 mt-2 w-48 right-0 bg-white shadow-lg rounded-md border border-gray-200">
                  <div className="py-1">
                    {isFeatureEnabled("CreateArticle") && (
                      <button
                        onClick={(e) => handleRoute("/admin/create/article", e)}
                        className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      >
                        Article
                      </button>
                    )}
                    {isFeatureEnabled("CreateCategory") && (
                      <button
                        onClick={(e) =>
                          handleRoute("/admin/create/category", e)
                        }
                        className="text-gray-700 block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                      >
                        Category
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {categories.length === 0 && loading ? (
            <>
              <div key="fakeCategory" className="mt-5">
                <div className="flex hover:opacity-80 !space-x-0 justify-between items-center w-full text-left text-lg font-semibold text-stone-900 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none">
                  <div className="flex items-center">
                    <div className="h-5 w-40 bg-gray-200 animate animate-pulse rounded-xl mr-2"></div>{" "}
                    (
                    <div className="h-5 w-4 bg-gray-200 animate animate-pulse rounded-2xl"></div>
                    <span className={"ml-2"}>Articles</span>)
                  </div>
                  <span
                    className={`transform transition-transform duration-300 text-indigo-500 rotate-0`}
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
                </div>
              </div>
            </>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No categories found.</p>
          ) : (
            categories.map((category: Category) => {
              const isActive = activeSection === category.CategoryID;
              const categoryArticles = articles.filter(
                (article: Article) => article.CategoryID === category.CategoryID
              );
              const articleCount = category.ArticleCount;

              return (
                <div key={category.CategoryID} className="mt-5">
                  <button
                    onClick={() => handleToggleSection(category.CategoryID)}
                    className="flex hover:opacity-80 justify-between items-center w-full text-left text-lg font-semibold text-stone-900 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none"
                  >
                    {category.Title} ({articleCount} Articles)
                    <span
                      className={`transform transition-transform duration-300 text-indigo-500 ${
                        isActive ? "rotate-180" : "rotate-0"
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
                  <div
                    className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                      isActive ? "max-h-screen" : "max-h-0"
                    }`}
                  >
                    {(isFeatureEnabled("EditCategory") ||
                      isFeatureEnabled("DeleteCategory")) && (
                      <div className="space-x-4 text-sm">
                        {isFeatureEnabled("EditCategory") && (
                          <button
                            onClick={() =>
                              route(
                                `/admin/edit/category/${category.CategoryID}`
                              )
                            }
                            className="text-stone-500 hover:text-indigo-900 transition duration-300 ease-in-out mb-4"
                          >
                            Edit Category
                          </button>
                        )}
                        {isFeatureEnabled("DeleteCategory") && (
                          <button
                            onClick={() =>
                              handleDeleteCategory(category.CategoryID)
                            }
                            className="text-red-500 hover:underline"
                          >
                            Delete Category
                          </button>
                        )}
                      </div>
                    )}
{articleCount > 0 && loading ? (
  <>
    {Array.from({ length: articleCount }).map((_, index) => {
      const includeBgStone50 = Math.random() < 0.5;
      const includeBorder = Math.random() < 0.5;
      const classes = [
        'flex justify-between items-center mb-4 transition duration-300 ease-in-out p-4 transform',
        includeBgStone50 ? 'bg-stone-50' : '',
        includeBorder ? 'border-l-4 border-indigo-600' : '',
        (includeBgStone50 || includeBorder) ? 'animate animate-pulse' : '',
      ].join(' ').trim();

      const archiveClass = includeBgStone50 ? 'w-20' : 'w-16';
      const publicClass = includeBorder ? 'w-16' : 'w-20';

      return (
        <div key={index} class="border-b border-gray-200 opacity-60">
          <div class={classes}>
            <div>
              <h4 class="font-medium text-lg bg-gray-300 animate animate-pulse w-36 h-4"></h4>
              <p class="mt-1 bg-gray-200 animate animate-pulse w-28 h-4"></p>
              <div class="flex space-x-4 text-sm mt-1">
                <div class={`cursor-pointer focus:cursor-default transition duration-300 ease-in-out text-indigo-500 hover:underline bg-indigo-200 animate animate-pulse ${archiveClass} h-4`}></div>
                <div class={`cursor-pointer focus:cursor-default transition duration-300 ease-in-out text-indigo-500 hover:underline bg-indigo-200 animate animate-pulse ${publicClass} h-4`}></div>
              </div>
            </div>
            <div class="flex space-x-4 text-sm mt-1">
              <button class="transition duration-300 ease-in-out text-red-500 hover:underline bg-red-200 animate animate-pulse w-12 h-4"></button>
              <button class="transition duration-300 ease-in-out bg-indigo-200 animate animate-pulse w-12 h-4"></button>
            </div>
          </div>
        </div>
      );
    })}
  </>
                    ) : categoryArticles.length === 0 && loading ? (
                      <>
                        <div className="bg-gray-200 text-gray-800 h-4 w-24 animate animate-pulse"></div>
                      </>
                    ) : categoryArticles.length === 0 ? (
                      <p className="text-gray-500">No articles found.</p>
                    ) : (
                      categoryArticles.map((article: Article) => (
                        <div key={article.ArticleID}>
                          <div
                            key={article.ArticleID}
                            className="border-b border-gray-200"
                          >
                            <div
                              className={`flex justify-between items-center mb-4 transition duration-300 ease-in-out p-4 transform ${
                                article.Archived ? "bg-stone-50" : ""
                              } ${
                                article.StaffOnly
                                  ? "border-l-4 border-indigo-600"
                                  : ""
                              }`}
                            >
                              <div>
                                <h4 className="font-medium text-lg">
                                  {article.Title}
                                </h4>
                                <p className="mt-1">{article.Description}</p>
                                <div className="flex space-x-4 text-sm mt-1">
                                  {isFeatureEnabled("ArchiveArticle") && (
                                    <button
                                      onClick={() =>
                                        handleToggleArchive(article.ArticleID)
                                      }
                                      className="text-indigo-500 hover:underline"
                                    >
                                      {article.Archived
                                        ? "Unarchive"
                                        : "Archive"}
                                    </button>
                                  )}
                                  {isFeatureEnabled("StaffOnly") && (
                                    <button
                                      onClick={() =>
                                        handleToggleStaffOnly(article.ArticleID)
                                      }
                                      className="text-indigo-500 hover:underline"
                                    >
                                      {article.StaffOnly
                                        ? "Make Public"
                                        : "Make Staff Only"}
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-4 text-sm mt-1">
                                {isFeatureEnabled("DeleteArticle") && (
                                  <button
                                    onClick={() =>
                                      handleDeleteArticle(article.ArticleID)
                                    }
                                    className="text-red-500 hover:underline"
                                  >
                                    Delete
                                  </button>
                                )}
                                {isFeatureEnabled("EditArticle") && (
                                  <button
                                    onClick={() =>
                                      handleEdit(article.ArticleID)
                                    }
                                    className="text-indigo-500 hover:text-indigo-800 transition duration-300 ease-in-out"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};
