import { FunctionalComponent } from "preact";
import {
  useState,
  useEffect,
  useRef,
  useContext,
  StateUpdater,
} from "preact/hooks";
import Breadcrumb from "./Breadcrumb";
import { parseContent } from "../contentParser";
import { renderContent } from "../contentRenderer";
import { ChangeEvent } from "preact/compat";
import { AdminError } from "./AdminError";
import { TextDiffViewer } from "./TextDiffViewer";
import { AdminArticleHistoryView } from "./AdminArticleHistoryView";
import { isFeatureEnabled } from "../featureFlags";
import {
  ArticleVersion,
  ArticleVersionsResponse,
  Category,
  ContentContext,
} from "../contexts/ContentContext";

interface Props {
  matches: {
    articleId: string; // Route parameters are strings
  };
}

export const AdminEditArticle: FunctionalComponent<Props> = ({ matches }) => {
  const { articleId } = matches; // Access articleId from matches

  const {
    fetchArticle,
    updateArticle,
    fetchArticleVersions,
    updateArticleById,
    loading,
    fetchArticleActionLogs,
    categories,
    setCategories,
    error,
  } = useContext(ContentContext); // Destructure the needed functions from the context

  const [history, setHistory] = useState<ArticleVersion[]>();

  const [articleText, setArticleText] = useState("");
  const [articleDescription, setArticleDescription] = useState("");
  const [articleImgSrc, setArticleImgSrc] = useState("");

// Initialize selectedCategory with a numeric value or undefined
const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const fetchedArticle: ArticleVersionsResponse =
          await fetchArticleVersions(articleId);
        setHistory(fetchedArticle.versions);
        setArticleText(fetchedArticle.versions[0].DetailedDescription);
        setArticleDescription(fetchedArticle.versions[0].Description);
        setArticleImgSrc(fetchedArticle.versions[0].ImgSrc);
        if (fetchedArticle && fetchedArticle.versions.length > 0) {
          setSelectedCategory(Number(fetchedArticle.versions[0].CategoryID));
        }
        fetchArticleActionLogs(articleId);
      } catch (error: any) {
        console.error("Failed to fetch article:", error);
      }
    };

    fetchArticleData();
  }, []);

  if (loading) {
    return <AdminError message={error} />;
  }

  const [count, setCount] = useState(0);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyUp = () => {
    if (isFeatureEnabled("articleDetailedCharacterLimit")) {
      if (textAreaRef.current) {
        setCount(textAreaRef.current.value.length);
      }
    }
  };

  const handleTextAreaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setArticleText(target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setArticleDescription(target.value);
  };

  const handleImgSrcChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setArticleImgSrc(target.value);
  };

  useEffect(() => {
    adjustTextAreaHeight();
  }, [articleText]); // Adjust text area height only when articleText changes

  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height to calculate new scroll height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set exact scroll height
    }
  };

  const [currentView, setCurrentView] = useState<
    "raw" | "rendered" | "potentialChanges"
  >("raw");

  const toggleRendered = () => {
    setCurrentView("rendered");
    adjustTextAreaHeight(); // Ensure height adjusts on toggling
  };

  const togglePotentialChanges = () => {
    setCurrentView("potentialChanges");
    adjustTextAreaHeight(); // Ensure height adjusts on toggling
  };

  const toggleRaw = () => {
    setCurrentView("raw");
    adjustTextAreaHeight(); // Ensure height adjusts on toggling
  };

  useEffect(() => {
    if (textAreaRef.current) {
      setTimeout(() => adjustTextAreaHeight(), 0); // Ensure DOM updates are processed
    }
  }, [articleText, currentView]);

  const contentElements = articleText ? parseContent(articleText) : null;
  const renderedContent = contentElements
    ? renderContent(contentElements)
    : null;

  const saveEdit = async () => {
    if (!history || !selectedCategory) return;

    const updatedArticleData = {
      categoryId: selectedCategory, // Ensure this is correctly sourced from the selected category dropdown
      title: history[0].Title, // Ensure this is correctly sourced from the current article state or form
      description: articleDescription, // This comes from the state handling the description input
      detailedDescription: articleText, // This comes from the state handling the text area
      imgSrc: articleImgSrc, // This comes from the state handling the image URL input
    };

    try {
      await updateArticleById(history[0].ArticleID, updatedArticleData);

      const versionsHistory: ArticleVersionsResponse =
      await fetchArticleVersions(history[0].ArticleID);

      fetchArticleActionLogs(articleId);

      setCategories((prevCategories: Category[]) =>
        prevCategories.map((cat) => {
          if (cat.CategoryID === history[0].CategoryID) {
            return { ...cat, ArticleCount: cat.ArticleCount ? cat.ArticleCount - 1 : 0 };
          } else if (cat.CategoryID === selectedCategory) {
            return { ...cat, ArticleCount: cat.ArticleCount ? cat.ArticleCount + 1 : 1 };
          }
          return cat;
        })
      );

      setHistory(versionsHistory.versions);
      setArticleText(versionsHistory.versions[0].DetailedDescription);
      setArticleDescription(versionsHistory.versions[0].Description);
      setArticleImgSrc(versionsHistory.versions[0].ImgSrc);

    } catch (error) {
      console.error("Failed to update article:", error);
    }
  };

  const isContentChanged = history && (
    articleText !== history[0]?.DetailedDescription ||
    selectedCategory !== history[0]?.CategoryID ||
    articleDescription !== history[0]?.Description ||
    articleImgSrc !== history[0]?.ImgSrc
  );

  const displayContent = () => {
    switch (currentView) {
      case "raw":
        return (
          <>
            <section className="mt-8"></section>
            <form>
              <div className="flex w-full flex-col">
                <div className="my-4">
                  <label
                    htmlFor="articleDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    id="articleDescription"
                    value={articleDescription}
                    onChange={handleDescriptionChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter article description"
                  />
                </div>
                <div className="my-4">
                  <label
                    htmlFor="articleImgSrc"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="articleImgSrc"
                    value={articleImgSrc}
                    onChange={handleImgSrcChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter image URL"
                  />
                </div>
                <div className="flex">
                  <div className="m-5">
                    <div
                      className="w-10 h-10 font-bold text-center text-white bg-stone-500 border-4 border-stone-400 transition duration-300 rounded-full cursor-pointer hover:bg-stone-600"
                      onClick={toggleRendered}
                    >
                      <svg
                        fill="#FFFFFF"
                        className="h-4 w-4 mx-auto mt-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="m494.8,241.4l-50.6-49.4c-50.1-48.9-116.9-75.8-188.2-75.8s-138.1,26.9-188.2,75.8l-50.6,49.4c-11.3,12.3-4.3,25.4 0,29.2l50.6,49.4c50.1,48.9 116.9,75.8 188.2,75.8s138.1-26.9 188.2-75.8l50.6-49.4c4-3.8 11.7-16.4 0-29.2zm-238.8,84.4c-38.5,0-69.8-31.3-69.8-69.8 0-38.5 31.3-69.8 69.8-69.8 38.5,0 69.8,31.3 69.8,69.8 0,38.5-31.3,69.8-69.8,69.8zm-195.3-69.8l35.7-34.8c27-26.4 59.8-45.2 95.7-55.4-28.2,20.1-46.6,53-46.6,90.1 0,37.1 18.4,70.1 46.6,90.1-35.9-10.2-68.7-29-95.7-55.3l-35.7-34.7zm355,34.8c-27,26.3-59.8,45.1-95.7,55.3 28.2-20.1 46.6-53 46.6-90.1 0-37.2-18.4-70.1-46.6-90.1 35.9,10.2 68.7,29 95.7,55.4l35.6,34.8-35.6,34.7z" />
                      </svg>
                    </div>
                  </div>
                  <textarea
                    id="text"
                    name="article"
                    ref={textAreaRef}
                    className="resize-y flex-1 text-lg rounded-md dark:bg-dark p-2 bg-white resize-none dark:text-light focus:outline-none focus:ring-opacity-10 char-limiter"
                    placeholder="Enter details for the article..."
                    onInput={handleTextAreaInput}
                    onKeyUp={handleKeyUp}
                    rows={3}
                    maxLength={280000}
                    value={articleText}
                    style={{ overflow: "hidden", resize: "vertical" }}
                  ></textarea>
                </div>
                <div className="flex flex-row-reverse mt-4">
                  <button
                    id="updateArticle"
                    type="button"
                    onClick={() => saveEdit()}
                    disabled={!isContentChanged}
                    className="ml-2 p-1 px-4 font-semibold text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition rounded-md disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
                    title={
                      !isContentChanged
                        ? "No changes to update"
                        : "Click to update article"
                    }
                  >
                    Update
                  </button>
                  <button
                    id="resetArticle"
                    type="button"
                    onClick={() => {
                      if (history && history.length > 0) {
                        setArticleText(history[0].DetailedDescription);
                        setArticleDescription(history[0].Description);
                        setArticleImgSrc(history[0].ImgSrc);
                      }
                    }}
                    disabled={!isContentChanged}
                    className="p-1 px-4 font-semibold text-white bg-stone-500 hover:bg-stone-600 focus:ring-2 focus:ring-stone-400 transition rounded-md select-none disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
                    title={
                      !isContentChanged
                        ? "Reset unavailable without changes"
                        : "Click to reset changes"
                    }
                  >
                    Reset
                  </button>
                </div>
                {isFeatureEnabled("articleDetailedCharacterLimit") && (
                  <div className="ml-auto text-xs font-semibold text-gray-400 count">
                    {count} / {280}
                  </div>
                )}
              </div>
            </form>
          </>
        );
      case "rendered":
        return (
          <>
            <section className="mt-8"></section>
            <div className="flex">
              {isFeatureEnabled("PreviewArticle") && (
                <div className="m-5">
                  <div
                    className="w-10 h-10 font-bold text-center text-white bg-stone-500 border-4 border-stone-400 transition duration-300 rounded-full cursor-pointer hover:bg-stone-600"
                    onClick={toggleRaw}
                  >
                    <svg
                      fill="#FFFFFF"
                      className="h-4 w-4 mx-auto mt-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="m494.8,241.4l-50.6-49.4c-50.1-48.9-116.9-75.8-188.2-75.8s-138.1,26.9-188.2,75.8l-50.6,49.4c-11.3,12.3-4.3,25.4 0,29.2l50.6,49.4c50.1,48.9 116.9,75.8 188.2,75.8s138.1-26.9 188.2-75.8l50.6-49.4c4-3.8 11.7-16.4 0-29.2zm-238.8,84.4c-38.5,0-69.8-31.3-69.8-69.8 0-38.5 31.3-69.8 69.8-69.8 38.5,0 69.8,31.3 69.8,69.8 0,38.5-31.3,69.8-69.8,69.8zm-195.3-69.8l35.7-34.8c27-26.4 59.8-45.2 95.7-55.4-28.2,20.1-46.6,53-46.6,90.1 0,37.1 18.4,70.1 46.6,90.1-35.9-10.2-68.7-29-95.7-55.3l-35.7-34.7zm355,34.8c-27,26.3-59.8,45.1-95.7,55.3 28.2-20.1 46.6-53 46.6-90.1 0-37.2-18.4-70.1-46.6-90.1 35.9,10.2 68.7,29 95.7,55.4l35.6,34.8-35.6,34.7z" />
                    </svg>
                  </div>
                </div>
              )}
              <div className="detail-description">{renderedContent}</div>
            </div>
          </>
        );
      case "potentialChanges":
        return history && history[0]?.DetailedDescription !== articleText ? (
          <TextDiffViewer
            oldText={history[0].DetailedDescription}
            newText={articleText}
          />
        ) : (
          <p>No active changes to display.</p>
        );
      default:
        return null;
    }
  };

  const handleCategoryChange = (event: {
    target: { value: StateUpdater<string> };
  }) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <>
      <Breadcrumb
        path={`/admin/edit/article/${articleId}`}
        articleId={history && history[0]?.ArticleID}
      />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Editing: {history && history[0]?.Title}
        </h1>
        {isFeatureEnabled("ViewPotentialArticleChanges") && (
          <button
            className="text-stone-500 hover:text-indigo-900 transition duration-300 ease-in-out disabled:cursor-default disabled:opacity-20"
            onClick={() =>
              currentView === "raw" || currentView === "rendered"
                ? togglePotentialChanges()
                : toggleRaw()
            }
            disabled={
              history &&
              history[0]?.DetailedDescription === articleText &&
              (currentView === "raw" || currentView === "rendered")
            }
          >
            {currentView === "raw" || currentView === "rendered"
              ? "View Potential Changes"
              : "Back to Edit"}
          </button>
        )}

        <div className="my-4">
          <label
            htmlFor="categorySelect"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(event) => {
              const target = event.target as HTMLSelectElement;
              setSelectedCategory(Number(target.value));
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {categories.map((category: Category) => (
              <option key={category.CategoryID} value={category.CategoryID}>
                {category.Title}
              </option>
            ))}
          </select>
        </div>

        {displayContent()}
        {isFeatureEnabled("ViewArticleChangelog") && history && (
          <AdminArticleHistoryView versions={history} />
        )}
      </div>
    </>
  );
};
