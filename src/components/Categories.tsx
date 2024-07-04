// src/components/Categories.tsx

import { Link } from 'preact-router';
import { content } from '../content';
import { generateSlug } from '../utils';
import Breadcrumb from './Breadcrumb';
import { useContext } from 'preact/hooks';
import { ContentContext } from '../contexts/ContentContext';


export const Categories = ({ path, onBreadcrumbClick }: { path: string, onBreadcrumbClick: () => void }) => {
  // const categories = Object.values(content.sections).map(
  //   section => {
  //     const latestVersion = section.versions.slice(-1)[0];
  //     return {
  //       title: latestVersion.title,
  //       slug: generateSlug(latestVersion.title),
  //     };
  //   }
  // );

  const content = useContext(ContentContext);

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Breadcrumb path={path} onBreadcrumbClick={onBreadcrumbClick} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Categories
        </h1>
        <ul className="mt-8">
          {content.categories.map((category) => (
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
      </div>
    </div>
  );
};
