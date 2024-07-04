// src/components/CategoryItems.tsx

import { FunctionalComponent } from "preact";
import { Card } from "../content";
import { generateSlug } from "../utils";
import { FeatureCard } from "./FeatureCard";
import Breadcrumb from "./Breadcrumb";
import { AccessRestricted } from "./AccessRestricted";
import { useMockAuth } from "./models/userModel";
import { useContext, useEffect } from "preact/hooks";
import { Article, ContentContext } from "../contexts/ContentContext";

interface CategoryItemsProps {
  categorySlug: string;
}

export const CategoryItems: FunctionalComponent<
  CategoryItemsProps & { onCardClick: (item?: Article) => void }
> = ({ categorySlug, onCardClick }) => {
  const contentContext = useContext(ContentContext);

  if (!contentContext) {
    return <AccessRestricted message="Content not available" />;
  }

  const content = useContext(ContentContext);

  // Find the category ID using the slug
  const category = content?.categories.find(
    (c: { Slug: string }) => generateSlug(c.Slug) === categorySlug
  );
  if (!category) {
    return <AccessRestricted message="Category not found" />;
  }
  const { isStaff } = useMockAuth(); // Use the custom hook

  // const userIsStaff = isStaff(); // Call the method to check if user is staff
content?.selectCategory(category.CategoryID)
  // Now you have the category ID, you can use it as needed to fetch or reference articles
  const filteredArticles = content?.articles.filter(
    (article) => article.CategoryID === category.CategoryID
  );

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
          {filteredArticles?.map((article: Article) => (
            <FeatureCard
              key={article.ArticleID} // Use card ID as key
              title={article.Title}
              id={article.ArticleID} // Add the id property
              imgSrc={article.ImgSrc}
              description={article.Description}
              detailedDescription={
                article.DetailedDescription
              }
              slug={article.Slug}
              // matches={article.matches}
              // title: boolean;
              // description: boolean;
              // detailedDescription: boolean;
              matches={{
                title: false,
                description: false,
                detailedDescription: false,
              }}
              onClick={() => onCardClick(article)} // Use onCardClick with the card
              archived={!!article.Archived} // Add the archived property
              staffOnly={!!article.StaffOnly} // Add the staffOnly property
            />
          ))}
        </div>
      </div>
    </div>
  );
};
