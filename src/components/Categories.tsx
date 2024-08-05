// src/components/Categories.tsx

import { Link } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import Breadcrumb from "./Breadcrumb";
import { ContentContext, Category } from "../contexts/ContentContext";
import ProgressBar from "../app";

export const Categories = ({
  path,
  onBreadcrumbClick,
}: {
  path: string;
  onBreadcrumbClick: () => void;
}) => {
  const { categories, loading } = useContext(ContentContext);


  const [showLoading, setShowLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (loading) {
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
  }, [loading, loadingStartTime]);

 // Handle loading state at the top to avoid rendering additional logic
 if (showLoading) {
  return (
    <div className="fixed inset-0 z-50 space-x-8  mx-auto text-center mr-0 flex items-center w-full justify-center animate-pulse text-3xl font-bold bg-white">
<div className="flex flex-col mr-8 space-y-8">
      <div className="flex items-center mx-auto text-sm font-medium tracking-widest text-transparent uppercase bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">Loading Categories</div>
<ProgressBar duration={250} color="indigo"/>
</div>
    </div>
  );
}


  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Breadcrumb path={path} onBreadcrumbClick={onBreadcrumbClick} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className={`text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl ${loading ? 'opacity-20 text-black/50':''}`}>
          Categories
        </h1>
        {categories.length === 0 && loading ? (
          <ul className="mt-8">
  {Array.from({ length: Math.floor(Math.random() * (8 - 4 + 1)) + 4 }, (_, index) => (
    <li key={index} className="mb-4">
      <div
        className={`bg-indigo-200 animate-pulse h-3 ${
          ['w-16', 'w-20', 'w-24', 'w-28', 'w-32', 'w-36'][Math.floor(Math.random() * 6)]
        }`}
      >
      </div>
    </li>
  ))}
</ul>
        ) : categories.length > 0 ? 
        <ul className="mt-8">
        {categories.map((category: Category) => (
          <li key={category.CategoryID} className="mb-4">
            <Link
              href={`/category/${category.Slug}`}
              className="text-indigo-500 hover:underline"
              onClick={onBreadcrumbClick}
            >
              {category.Title}
            </Link>
          </li>
        ))}
      </ul>
        : (
          <div className="flex flex-col items-center justify-center h-64 mt-8 bg-gray-100 rounded-lg text-center">
            <p className="text-xl font-semibold text-gray-600">No Categories Available</p>
            <p className="mt-2 text-gray-500">Check back later or explore our other websites.</p>
          </div>
        )}
      </div>
    </div>
  );
};
