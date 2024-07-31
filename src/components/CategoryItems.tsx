// src/components/CategoryItems.tsx

import { FunctionalComponent } from "preact";
import { generateSlug } from "../utils";
import { FeatureCard } from "./FeatureCard";
import Breadcrumb from "./Breadcrumb";
import { AccessRestricted } from "./AccessRestricted";
import { useContext } from "preact/hooks";
import { Article, ContentContext } from "../contexts/ContentContext";
import { useAuth } from "../contexts/AuthContext";

interface CategoryItemsProps {
  categorySlug: string;
}
// TODO HANDLE SITUATIONS WHERE net::ERR_NAME_NOT_RESOLVED. DO NOT SHOW ARTICLES WITH THIS ISSUE. SHOW ARTICLE AS AN ERROR IN ADMIN DASHBOARD PROMPTING THEM TO EITHER FIX DEAD LINK.
// PREVENT FAILURE MODE WHILE CREATING ARTICLE - CHECK TO SEE IF RESULT DOESNT DO net::ERR_NAME_NOT_RESOLVED - IF net::ERR_NAME_NOT_RESOLVED HAPPENS POST CREATION, THEN FLAG AS EDGECASE

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
    (c) => generateSlug(c.Slug) === categorySlug
  );
  if (!category) {
    return <AccessRestricted message="Category not found" />;
  }

  // const userIsStaff = isStaff(); // Call the method to check if user is staff
content?.selectCategory(category.CategoryID)

const { isAuthenticated } = useAuth();

  // Now you have the category ID, you can use it as needed to fetch or reference articles
  const filteredArticles = content?.articles.filter(
    (article) => {
      if (isAuthenticated) {
        return (article.CategoryID === category.CategoryID) && (article.Archived === 0);
      } else {
        return (article.CategoryID === category.CategoryID) && (article.Archived === 0) && (article.StaffOnly === 0);
      }
    }
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