import { FunctionalComponent } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import { Card, content } from "../content";
import { findCardById } from "../utils";
import Breadcrumb from "./Breadcrumb";
import { parseContent } from "../contentParser";
import { renderContent } from "../contentRenderer";
import { ChangeEvent } from "preact/compat";
import { AdminError } from "./AdminError";
import { TextDiffViewer } from "./TextDiffViewer";
import { AdminArticleHistoryView } from "./AdminArticleHistoryView";
import { isFeatureEnabled } from "../featureFlags";
import { useAuth } from "../contexts/AuthContext";

interface MatchParams {
  articleId: number;
}

export const AdminEditArticle: FunctionalComponent<{
  matches: MatchParams;
}> = ({ matches }) => {
  const { articleId } = matches;
  const [article, setArticle] = useState<Card | null>(null);
  const [loadingError, setLoadingError] = useState<string>("");
  // const { isAuthenticated, isStaff } = useMockAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const id = parseInt(articleId.toString(), 10); // Parse string to number
        if (isNaN(id)) {
          throw new Error("Invalid article ID");
        }
        const fetchedArticle = findCardById(id);
        if (!fetchedArticle) {
          throw new Error("Article not found");
        }
        // REINTRODUCE ONCE API IS UPDATED WITH PLANNED BITWISE PERMUTIL IMPLEMENTATION
        // if (!isStaff()) throw new Error("Unauthorized access");
        setArticle(fetchedArticle);
      } catch (error: any) {
        console.error("Failed to fetch article:", error);
        setLoadingError(error.message || "Failed to load the article.");
      }
    };

    fetchArticle();
  }, [articleId]);
  // }, [articleId, isAuthenticated, isStaff]);

  // if (!isAuthenticated())
  //   return <AdminError message="Please log in to edit articles." />;

  if (loadingError) {
    return <AdminError message={loadingError} />;
  }

  if (!article) return <div>Loading...</div>;

  const [count, setCount] = useState(0);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyUp = () => {
    if (textAreaRef.current) {
      setCount(textAreaRef.current.value.length);
    }
  };

  const [articleText, setArticleText] = useState(
    article.versions.slice(-1)[0].detailedDescription
  );

  const handleTextAreaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    console.log("Input value:", target.value); // Debug log to see the input value
    setArticleText(target.value);
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
    "raw" | "rendered" | "history"
  >("raw");

  const toggleRendered = () => {
    setCurrentView("rendered");
    adjustTextAreaHeight(); // Ensure height adjusts on toggling
  };

  const toggleHistory = () => {
    setCurrentView("history");
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

  const contentElements = parseContent(articleText);
  const renderedContent = renderContent(contentElements);

  const [history, setHistory] = useState(article.versions);

  const saveEdit = (newContent: string) => {
    const user = useAuth().user; // Get the current user details
    if (!user) return null; // Add null check for user

    const newVersion = {
      versionId: history.length + 1,
      title: article.versions.slice(-1)[0].title,
      description: article.versions.slice(-1)[0].description,
      detailedDescription: newContent,
      editedBy: user.userId,
      editDate: new Date().toISOString(),
    };

    const updatedHistory = [...history, newVersion];
    setHistory(updatedHistory);

    // Save the article edit
    if (article) {
      const newArticle = {
        ...article,
        versions: updatedHistory,
      };
      setArticle(newArticle);
      // Update the content object here as well
      const sectionKey = Object.keys(content.sections).find((key) =>
        content.sections[parseInt(key)].cards.some((c) => c.id === article.id)
      );
      if (sectionKey) {
        const section = content.sections[parseInt(sectionKey)];
        const cardIndex = section.cards.findIndex((c) => c.id === article.id);
        if (cardIndex > -1) {
          section.cards[cardIndex] = newArticle;
        }
      }
    }
  };

  // This will determine if the articleText is different from the original article content
  const isContentChanged =
    article &&
    articleText !== article?.versions.slice(-1)[0].detailedDescription;

  // Content display based on the current view
  const displayContent = () => {
    switch (currentView) {
      case "raw":
        return (
          <>
            <section className="mt-8"></section>
            <form>
              <div className="flex w-full flex-col">
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
                    onClick={() => saveEdit(articleText)}
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
                    onClick={() =>
                      setArticleText(
                        article?.versions.slice(-1)[0].detailedDescription
                      )
                    }
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
                <div className="ml-auto text-xs font-semibold text-gray-400 count">
                  {count} / {280}
                </div>
              </div>
            </form>
          </>
        );
      case "rendered":
        return (
          <>
            <section className="mt-8"></section>

            <div className="flex">
            {isFeatureEnabled('PreviewArticle')&& (
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
      case "history":
        return history.length > 1 ? (
          <TextDiffViewer
            oldText={article.versions.slice(-2)[0].detailedDescription}
            newText={articleText}
          />
        ) : (
          <p>No previous versions to display.</p>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Breadcrumb
        path={`/admin/edit/article/${articleId}`}
        articleId={article.id}
      />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Editing: {article.versions.slice(-1)[0].title}
        </h1>
        {isFeatureEnabled("ViewArticleHistoryDiff") && (
          <button
            onClick={() =>
              currentView === "raw" || currentView === "rendered"
                ? toggleHistory()
                : toggleRaw()
            }
            disabled={
              history.length <= 1 &&
              (currentView === "raw" || currentView === "rendered")
            }
          >
            {currentView === "raw" || currentView === "rendered"
              ? "View History"
              : "Back to Edit"}
          </button>
        )}
        {displayContent()}
        {isFeatureEnabled("ViewArticleHistoryChangelog") && (
          <AdminArticleHistoryView card={article} />
        )}
      </div>
    </>
  );
};
