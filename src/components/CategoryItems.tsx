// src/components/CategoryItems.tsx

import { FunctionalComponent } from "preact";
import { generateSlug } from "../utils";
import { FeatureCard } from "./FeatureCard";
import Breadcrumb from "./Breadcrumb";
import { AccessRestricted } from "./AccessRestricted";
import { useContext, useEffect, useState } from "preact/hooks";
import { Article, ContentContext } from "../contexts/ContentContext";
import { useAuth } from "../contexts/AuthContext";

interface CategoryItemsProps {
  categorySlug: string;
}

export const CategoryItems: FunctionalComponent<
  CategoryItemsProps & { onCardClick: (item?: Article) => void }
> = ({ categorySlug, onCardClick }) => {
  const contentContext = useContext(ContentContext);
  const { isAuthenticated } = useAuth();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  if (!contentContext) {
    return <AccessRestricted message="Content not available" />;
  }

  const content = contentContext;

  // Find the category ID using the slug
  const category = content.categories.find(
    (c) => generateSlug(c.Slug) === categorySlug
  );
  if (!category) {
    return <AccessRestricted message="Category not found" />;
  }

  useEffect(() => {
    // Function to filter articles
    const filterArticles = () => {
      const articles = content.articles.filter(
        (article) =>
          article.CategoryID === category.CategoryID &&
          article.Archived === 0 &&
          (isAuthenticated || article.StaffOnly === 0)
      );
      setFilteredArticles(articles);
    };

    // Initial filter and setup
    filterArticles();

    // Listen for changes in the articles list
    // This assumes that `content.articles` will change when articles are updated
    // causing a re-render of this component

  }, [content.articles, category.CategoryID, isAuthenticated]);

  return (
    <div>
      <Breadcrumb
        path={`/category/${categorySlug}`}
        categorySlug={categorySlug}
      />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          {category.Title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {filteredArticles.map((article) => (
            <FeatureCard
              key={article.ArticleID}
              title={article.Title}
              id={article.ArticleID}
              imgSrc={article.ImgSrc}
              description={article.Description}
              detailedDescription={article.DetailedDescription}
              slug={article.Slug}
              matches={{
                title: false,
                description: false,
                detailedDescription: false,
              }}
              onClick={() => onCardClick(article)}
              archived={!!article.Archived}
              staffOnly={!!article.StaffOnly}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
