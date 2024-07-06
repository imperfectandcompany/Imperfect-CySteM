// src/components/Article.tsx

import { useContext, useEffect } from 'preact/hooks';
import { ContentContext } from '../contexts/ContentContext';
import { generateSlug } from '../utils';
import { AccessRestricted } from './AccessRestricted';
import { ArticleView } from './ArticleView';
import Breadcrumb from './Breadcrumb';
// import { useMockAuth } from './models/userModel';

interface ArticleProps {
  title?: string;
  path: string;
  lastRoute: string;
  onBreadcrumbClick: () => void;
}

const Article = ({ title, path, onBreadcrumbClick }: ArticleProps) => {
  // const { isStaff } = useMockAuth(); // Use the custom hook

  // const userIsStaff = isStaff(); // Call the method to check if user is staff

  // if (!card || card.archived || (card.staffOnly && !userIsStaff)) {
  //   return <AccessRestricted message="Article not available" />;
  // }

  const content = useContext(ContentContext);
  

  // // Find the article by slug within the selected category's articles
  // const article = title ? content?.articles.find(a => a.Slug === title) : null;


  useEffect(() => {
    if (title) {
      content?.fetchArticleBySlugDirectly(title); // Fetch the article by slug when the component mounts
    }
  }, [title]);

  const article = content?.currentArticle;

console.log(article); 
  
  const category = content?.categories.find(c => c.CategoryID === article?.CategoryID);

      if (article === (null || undefined)) {
        if(undefined) {

        } else{
          return <AccessRestricted message="Article not available" />;

        }

      }


  function handleBackAction() {
    history.back();
  }

  return (
    <div>
      <Breadcrumb path={path} categorySlug={category?.Slug} articleTitle={title} onBreadcrumbClick={onBreadcrumbClick} />
    {article && <ArticleView item={article} onBack={handleBackAction} />}
    </div>
  );
};

export default Article;
