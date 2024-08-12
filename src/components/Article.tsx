// src/components/Article.tsx

import { useContext, useEffect, useState } from "preact/hooks";
import { ContentContext } from "../contexts/ContentContext";
import { ArticleView } from "./ArticleView";
import Breadcrumb from "./Breadcrumb";
import { route } from "preact-router";
import { CategoryItems } from "./CategoryItems";
import ProgressBar from "../app";

interface ArticleProps {
  title?: string;
  path: string;
  lastRoute: string;
  onBreadcrumbClick: () => void;
}

const Article = ({ title, path, onBreadcrumbClick }: ArticleProps) => {
  const content = useContext(ContentContext);

  useEffect(() => {
    if (title) {
      content?.fetchArticleBySlugDirectly(title); // Fetch the article by slug when the component mounts
    }
  }, [title]);

  const article = content?.currentArticle;
  const category = content?.categories.find(
    (c) => c.CategoryID === article?.CategoryID
  );

  const [fadeOut, setFadeOut] = useState(false);

  const customHistoryStack: string[] = [];

  function handleBackAction() {
    const currentUrl = window.location.href;
    const articleUrlPattern = new RegExp(
      `^${window.location.origin}/article/${title}$`
    );
  
    // Update the custom history stack if it's not the same as the last entry
    if (!customHistoryStack.length || customHistoryStack[customHistoryStack.length - 1] !== currentUrl) {
      customHistoryStack.push(currentUrl);
    }
    if (!articleUrlPattern.test(currentUrl)) {
      history.back();
    } else {
      // Check the previous URL in the custom history stack
      const previousUrl = customHistoryStack[customHistoryStack.length - 2];
  
      if (previousUrl && previousUrl !== currentUrl) {
        // Remove the current URL from the stack
        customHistoryStack.pop();
        // Route to the previous URL in the stack
        route(previousUrl);
      } else {
        // If the previous URL is the same or undefined, redirect to a safe route
        route(`category/${category?.Slug}`);
      }
    }
  }
  
  // Updated function to handle different types of clicks
// Custom history stack to track visited URLs

const handleClick = (clickType: "back" | "breadcrumb") => {
  // Add the current URL to the custom history stack if it's not the same as the last entry
  const currentUrl = window.location.href;
  if (!customHistoryStack.length || customHistoryStack[customHistoryStack.length - 1] !== currentUrl) {
    customHistoryStack.push(currentUrl);
  }

  if (!fadeOut) {
    setFadeOut(true);
    setTimeout(() => {
      if (clickType === "back") {
        handleBackAction();
      } else {
        onBreadcrumbClick();
      }
    }, 500); // Wait for the animation to complete
  }
};




const [showLoading, setShowLoading] = useState(false);
const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

useEffect(() => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  if (content?.loading) {
    setShowLoading(true);
    setLoadingStartTime(Date.now());
  } else if (loadingStartTime !== null) {
    const elapsedTime = Date.now() - loadingStartTime;

    if (elapsedTime < 750) {
      timer = setTimeout(() => {
        setShowLoading(false);
        setLoadingStartTime(null); // Reset loading start time
      }, 750 - elapsedTime);
    } else {
      setShowLoading(false);
      setLoadingStartTime(null); // Reset loading start time
    }
  }

  return () => {
    if (timer) {
      clearTimeout(timer);
    }
  };
}, [content?.loading, loadingStartTime]);

// Handle loading state at the top to avoid rendering additional logic
  return (
    <div className={`${fadeOut ? "fade-out" : "animate-fade-in"}`}>
      {showLoading ?   <div className="fixed inset-0 z-50 space-x-8  mx-auto text-center mr-0 flex items-center w-full justify-center text-3xl font-bold ">
<div className="flex flex-col mr-8 space-y-8">
    <div className="flex items-center mx-auto text-sm font-medium tracking-widest text-transparent uppercase bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500 select-none">Loading Article</div>
<ProgressBar duration={250} color="indigo"/>
</div>
  </div> :
      !article || (article && !category) ? (
        <>
          <div className={"py-3 px-5 my-4 opacity-80 z-10"}>
            <button
              className="flex px-6 py-2 bg-black/15 flex-wrap ml-2 md:ml-8 text-xs sm:text-sm md:text-md lg:text-lg text-gray-600 rounded hover:cursor-pointer focus:cursor-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-in-out !z-20"
              onClick={handleBackAction}
            >
              Go back
            </button>
          </div>
          <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
            <h1 className="mt-8 text-4xl font-normal tracking-tighter text-black/75 sm:text-5xl">
              {title}
            </h1>
            <div className="flex flex-col items-center justify-center h-64 mt-8 text-center bg-gray-100 rounded-lg">
              <svg
                className="w-16 h-16 mb-4 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m-3-3H9m0 0H5.458C4.506 12 4 11.582 4 10.875V8.125C4 7.418 4.506 7 5.458 7H18.542C19.494 7 20 7.418 20 8.125v2.75C20 11.582 19.494 12 18.542 12H16m-2 0v4m0 0H8.458C7.506 16 7 16.418 7 17.125v2.75C7 20.582 7.506 21 8.458 21H15.542C16.494 21 17 20.582 17 19.875v-2.75C17 16.418 16.494 16 15.542 16H12z"
                />
              </svg>
              <p className="text-xl font-semibold text-gray-600">
                Article not available
              </p>
              <p className="mt-2 text-gray-500">
                We're working hard to add more content. Please check back later!
              </p>
            </div>
          </div>
        </>
      ) : (
        <div>
          <Breadcrumb
            path={path}
            categorySlug={category?.Slug}
            articleTitle={title}
            articleId={article.ArticleID}
            onBreadcrumbClick={onBreadcrumbClick}
            onBreadcrumbClickHome={() => handleClick("breadcrumb")}
          />
          {article && category && (
            <ArticleView item={article} onBack={() => handleClick("back")} />
          )}
        </div>
      )}
    </div>
  );
};

export default Article;
