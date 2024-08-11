// src/components/Article.tsx

import { useContext, useEffect, useState } from 'preact/hooks';
import { ContentContext } from '../contexts/ContentContext';
import { ArticleView } from './ArticleView';
import Breadcrumb from './Breadcrumb';

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
  const category = content?.categories.find(c => c.CategoryID === article?.CategoryID);

  if ((!article) || (article && !category)) {
    return (
      <>
            <div className={'py-3 px-5 my-4 opacity-80 z-10'}>
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
    );
  }

  const [fadeOut, setFadeOut] = useState(false);


  function handleBackAction() {
    history.back();
  }
     // Updated function to handle different types of clicks
     const handleClick = (clickType: 'back' | 'breadcrumb') => {
      setFadeOut(true);
      setTimeout(() => {
        if (clickType === 'back') {
          handleBackAction();
        } else {
          onBreadcrumbClick();
        }
      }, 500); // Wait for the animation to complete
    };


  return (
    <div className={`${fadeOut ? 'fade-out' : ''}`}>
      <Breadcrumb path={path} categorySlug={category?.Slug} articleTitle={title} articleId={article.ArticleID} onBreadcrumbClick={onBreadcrumbClick} onBreadcrumbClickHome={()=>handleClick('breadcrumb')} />
      {(article && category) && <ArticleView item={article} onBack={()=>handleClick('back')} />}
    </div>
  );
};

  export default Article;
