// src/components/Breadcrumb.tsx

import { FunctionalComponent } from "preact";
import { Link } from "preact-router";
import { findCardById, generateSlug } from "../utils";
import { isFeatureEnabled } from "../featureFlags";
import { useContext } from "preact/compat";
import { Article, Category, ContentContext } from "../contexts/ContentContext";

interface BreadcrumbProps {
  path: string;
  categorySlug?: string;
  categoryId?: number; // Add this to accept category ID
  categoryTitle?: string;
  articleId?: number;
  articleTitle?: string;
  onBreadcrumbClick?: () => void;
  onBreadcrumbClickHome?: () => void;
}

const Breadcrumb: FunctionalComponent<BreadcrumbProps> = ({
  path,
  categorySlug,
  categoryId, // Add this to destructure the prop
  categoryTitle,
  articleId,
  articleTitle,
  onBreadcrumbClick,
  onBreadcrumbClickHome,
}) => {
  let category: Category | undefined = undefined ;
  let article: Article | undefined = undefined;
  const contentContext = useContext(ContentContext);

  if (categorySlug) {
    // Find the category ID using the slug
    category = contentContext?.categories.find(
      (c: { Slug: string }) => generateSlug(c.Slug) === categorySlug
    );
  }

  if (articleId) {
    // Find the article using the ID from the context
    article = contentContext?.articles.find((a) => a.ArticleID === articleId);
  } else if (articleTitle) {
    // Find the article using the title (slug) from the context
    article = contentContext?.articles.find(
      (a) => generateSlug(a.Title) === articleTitle
    );
  }

  if (categoryId) {
    // Find the article using the ID from the context
    category = contentContext?.categories.find(
      (a) => a.CategoryID === categoryId
    );
  } else if (categoryTitle) {
    // Find the article using the title (slug) from the context
    category = contentContext?.categories.find(
      (a) => generateSlug(a.Title) === categoryTitle
    );
  }

  const breadcrumbItems = [];

  breadcrumbItems.push(
    <li key="home" className="inline">
      <Link
        href="/"
        className="text-indigo-600 hover:text-indigo-800"
        onClick={onBreadcrumbClickHome}
      >
        Home
      </Link>
    </li>
  );

  if (isFeatureEnabled("HomeSearch")) {
    if (path.startsWith("/search")) {
      breadcrumbItems.push(
        <li key="search" className="inline">
          <span className="mx-2 text-gray-500">/</span>
          <Link
            href="/search?query="
            className="text-indigo-600 hover:text-indigo-800"
            onClick={onBreadcrumbClick}
          >
            Search
          </Link>
        </li>
      );
    }
  }

  if (isFeatureEnabled("SupportSystem")) {
    if (path.startsWith("/support")) {
      breadcrumbItems.push(
        <li key="support" className="inline">
          <span className="mx-2 text-gray-500">/</span>
          <Link
            href="/support"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Support
          </Link>
        </li>
      );
    }
  }

  if (isFeatureEnabled("AdminDashboard")) {
    if (path.includes("/admin")) {
      breadcrumbItems.push(
        <li key="admin" className="inline">
          <span className="mx-2 text-gray-500">/</span>
          <Link
            href="/admin"
            className="text-indigo-600 hover:text-indigo-800"
            onClick={onBreadcrumbClick}
          >
            Admin
          </Link>
        </li>
      );
      if (isFeatureEnabled("CreateArticle")) {
        if (path === "/admin/create-article") {
          breadcrumbItems.push(
            <li key="createArticle" className="inline">
              <span className="mx-2 text-gray-500">/</span>
              <Link
                href={`/admin/create/article`}
                className="text-indigo-600 hover:text-indigo-800"
                onClick={onBreadcrumbClick}
              >
                Create Article
              </Link>
            </li>
          );
        }
      }
      if (path === "/admin/requests") {
        breadcrumbItems.push(
          <li key="support" className="inline">
            <span className="mx-2 text-gray-500">/</span>
            <Link
              href={`/admin/requests`}
              className="text-indigo-600 hover:text-indigo-800"
              onClick={onBreadcrumbClick}
            >
              Requests
            </Link>
          </li>
        );
      }
      if (isFeatureEnabled("CreateCategory")) {
        if (path === "/admin/create-category") {
          breadcrumbItems.push(
            <li key="createCategory" className="inline">
              <span className="mx-2 text-gray-500">/</span>
              <Link
                href={`/admin/create/category`}
                className="text-indigo-600 hover:text-indigo-800"
                onClick={onBreadcrumbClick}
              >
                Create Category
              </Link>
            </li>
          );
        }
      }
      if (isFeatureEnabled("ViewAdminLogs")) {
        if (path === "/admin/logs") {
          breadcrumbItems.push(
            <li key="edit" className="inline">
              <span className="mx-2 text-gray-500">/</span>
              <Link
                href={`/admin/logs`}
                className="text-indigo-600 hover:text-indigo-800"
                onClick={onBreadcrumbClick}
              >
                Logs
              </Link>
            </li>
          );
        }
      }
      if (isFeatureEnabled("EditCategory")) {
        if (path.includes("/admin/edit/category") && categoryId) {
          breadcrumbItems.push(
            <li key="editCategory" className="inline">
              <span className="mx-2 text-gray-500">/</span>
              <Link
                href={`/admin/edit/category/${categoryId}`}
                className="text-indigo-600 hover:text-indigo-800"
                onClick={onBreadcrumbClick}
              >
                Edit Category
              </Link>
            </li>
          );

          if (category) {
            breadcrumbItems.push(
              <li
                key={`category-${categoryTitle}`}
                className="inline font-bold"
              >
                <span className="mx-2 text-gray-500">/</span>
                {category.Title} {/* Use Title directly */}
              </li>
            );
          }
        }
      }

      if (isFeatureEnabled("EditArticle")) {
        if (path.includes("/edit/article") && articleId) {
          // Since you already have the article from the context, you don't need to find it again
          if (article) {
            breadcrumbItems.push(
              <li key="edit" className="inline">
                <span className="mx-2 text-gray-500">/</span>
                <Link
                  href={`/admin/edit/article/${articleId}`}
                  className="text-indigo-600 hover:text-indigo-800"
                  onClick={onBreadcrumbClick}
                >
                  Edit Article
                </Link>
              </li>
            );
          }
        }
      }
    }
  }

  if (isFeatureEnabled("CategoriesPage")) {
    if (path === "/categories" || category) {
      breadcrumbItems.push(
        <li key="categories" className="inline">
          <span className="mx-2 text-gray-500">/</span>
          <Link
            href="/categories"
            className="text-indigo-600 hover:text-indigo-800"
            onClick={onBreadcrumbClick}
          >
            Categories
          </Link>
        </li>
      );
    }
  }
  if (isFeatureEnabled("SpecificCategoryPage")) {
    if (category) {
      breadcrumbItems.push(
        <li key={`category-${categorySlug}`} className="inline">
          <span className="mx-2 text-gray-500">/</span>
          <Link
            href={`/category/${categorySlug}`}
            className="text-indigo-600 hover:text-indigo-800"
            onClick={onBreadcrumbClick}
          >
            {category.Title} {/* Use Title directly */}
          </Link>
        </li>
      );
    }
  }

  if (article) {
    breadcrumbItems.push(
      <li key={`article-${articleTitle}`} className="inline font-bold">
        <span className="mx-2 text-gray-500">/</span>
        {article.Title} {/* Use Title directly */}
      </li>
    );
  }

  return (
    <div className="flex flex-col">
      <nav className="bg-white py-3 px-5 md:rounded-md my-4 opacity-80 z-10">
        <ul className="flex flex-wrap ml-2 md:ml-8 text-xs sm:text-sm md:text-md lg:text-lg text-gray-600">
          {breadcrumbItems}
        </ul>
      </nav>
    </div>
  );
};

export default Breadcrumb;
