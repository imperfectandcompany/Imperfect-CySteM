// src/components/Categories.tsx

import { Link } from "preact-router";
import { useContext } from "preact/hooks";
import Breadcrumb from "./Breadcrumb";
import { ContentContext, Category } from "../contexts/ContentContext";

export const Categories = ({
  path,
  onBreadcrumbClick,
}: {
  path: string;
  onBreadcrumbClick: () => void;
}) => {
  const { categories } = useContext(ContentContext);

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Breadcrumb path={path} onBreadcrumbClick={onBreadcrumbClick} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Categories
        </h1>
        {categories.length > 0 ? (
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
        ) : (
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
              No Categories Available
            </p>
            <p className="mt-2 text-gray-500">
              We're working hard to add new categories. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
