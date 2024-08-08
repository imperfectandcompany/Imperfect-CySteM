// src/components/AdminCreateArticle.tsx
import { FunctionalComponent } from "preact";
import { useState, useRef, useContext } from "preact/hooks";
import { route } from "preact-router";
import {
  generateSlug,
} from "../utils";
import Breadcrumb from "./Breadcrumb";
import {
  checkArticleSlugExists,
  createArticle,
} from "../api";
import {
  Article,
  ArticleCreateResponse,
  Category,
  ContentContext,
} from "../contexts/ContentContext";
import { parseContent } from "../contentParser";
import { renderContent } from "../contentRenderer";
import EditorModule from "./EditorModule";

export const AdminCreateArticle: FunctionalComponent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [category, setCategory] = useState("");

  // const [categories, setCategories] = useState<
  //   { id: number; title: string }[]
  // >([]);
  const [loading, setLoading] = useState(false);
  const [titleExists, setTitleExists] = useState(false);
  const [failedRegex, setFailedRegex] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const imgDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Use ContentContext to get categories
  const contentContext = useContext(ContentContext);
  const categories = contentContext ? contentContext.categories : [];

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current);
    titleDebounceRef.current = setTimeout(async () => {
      const slug = newTitle.toLowerCase().replace(/ /g, "-");
      if (newTitle !== "") {
        setTitleExists(await checkArticleSlugExists(slug));
      }
    }, 500);
  };

  const handleImgChange = (imgSource: string) => {
    setImgSrc(imgSource);
    if (imgDebounceRef.current) clearTimeout(imgDebounceRef.current);
    imgDebounceRef.current = setTimeout(async () => {
      setFailedRegex(
        !imgSource.match(new RegExp("https?://.+\\.(jpg|jpeg|png|gif)$"))
      );
    }, 500);
  };

  const { setArticles, setCategoryArticlesCache, setCategories } = useContext(ContentContext);

  const handleCreate = async (event: Event) => {
    event.preventDefault();
    if (!formRef.current?.checkValidity() || titleExists) {
      formRef.current?.classList.add("shake");
      setTimeout(() => formRef.current?.classList.remove("shake"), 500);
      return;
    }
    setLoading(true);

    const slug = title.toLowerCase().replace(/ /g, "-");
    const titleOrSlugExists = await checkArticleSlugExists(slug);

    if (titleOrSlugExists) {
      alert("An article with this title or slug already exists.");
      setLoading(false);
      return;
    }

    if (!category) {
      alert("Category is not selected.");
      setLoading(false);
      return;
    }

    if (category) {
      try {
        const result: ArticleCreateResponse = await createArticle({
          title,
          description,
          detailedDescription,
          categoryId: Number(category),
          imgSrc,
        });
        if (result.articleID) {
          // Optimistically update the articles in the context
       const newArticle = {
          ArticleID: result.articleID,
          CategoryID: Number(category),
          Title: title,
          Description: description,
          DetailedDescription: detailedDescription,
          ImgSrc: imgSrc,
          Archived: 0,
          StaffOnly: 0,
          Slug: generateSlug(title),
          Version: result.versionID, // Assuming backend returns version ID
          CreatedAt: new Date().toISOString(),
          UpdatedAt: null,
          DeletedAt: null,
        };



        // Optimistically update the articles in the context
        setArticles((prevArticles:Article[]) => [...prevArticles, newArticle]);

        // Update the category articles cache
        setCategoryArticlesCache((prev: Record<string, Article[]>) => {
          const updatedCache = { ...prev };
          if (updatedCache[category]) {
            updatedCache[category].push(newArticle);
          } else {
            updatedCache[category] = [newArticle];
          }
          return updatedCache;
        });

        // Update the category count in setCategories
        setCategories((prevCategories: Category[]) => 
          prevCategories.map((cat) => 
            cat.CategoryID === Number(category)
              ? { ...cat, ArticleCount: cat.ArticleCount + 1 }
              : cat
          )
        );

        




   
          // // Update the article count for the category
          // setCategories((prevCategories: Category[]) =>
          //   prevCategories.map((cat) => {
          //     if (cat.CategoryID === Number(category)) {
          //       return { ...cat, ArticleCount: 999 };
          //     }
          //     return cat;
          //   })
          // );

          alert("Article created successfully!");
          route(`/admin/edit/article/${result.articleID}`);
        } else {
          alert("Failed to create article");
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(
            error.message || "An error occurred while creating the article."
          );
        } else {
          alert("An unknown error occurred while creating the article.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const [currentView, setCurrentView] = useState("raw"); // Assuming you want to toggle between 'raw' and 'rendered' views

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const toggleView = () => {
    setCurrentView(currentView === "raw" ? "rendered" : "raw");
  };

  // const handleDetailedDescriptionChange = (event: Event) => {
  //   const target = event.target as HTMLTextAreaElement;
  //   setDetailedDescription(target.value);
  // };

  const handleDetailedDescriptionChange = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    setDetailedDescription(target.value);

    // Adjust the number of rows based on the content
    const numberOfLineBreaks = (target.value.match(/\n/g) || []).length;
    // Minimum number of rows to show
    const minRows = 1;
    // Update the rows attribute to be at least the number of line breaks plus one
    target.rows = minRows + numberOfLineBreaks;
  };

  const renderDetailedDescription = () => {
    const contentElements = detailedDescription
      ? parseContent(detailedDescription)
      : "";
    const renderedContent = contentElements
      ? renderContent(contentElements)
      : null;

    return (
      <div className="resize-y w-full text-lg rounded-sm bg-white focus:outline-none">
        
<EditorModule/>

        {/* {currentView === "raw" ? (
          <textarea
            ref={textAreaRef}
            className="border border-gray-300 hover:border-gray-400 resize-y w-full rounded-sm p-2 focus:outline-none"
            placeholder="Enter detailed description..."
            onInput={handleDetailedDescriptionChange}
            value={detailedDescription}
          ></textarea>
        ) : (
          <div className="detail-description border border-gray-300 p-2 rounded-sm">
            {renderedContent || (
              <p className="text-gray-500">Preview will be displayed here.</p>
            )}
          </div>
        )} */}
      </div>
    );
  };

  return (
    <>
      <Breadcrumb path="/admin/create-article" />
      <div className="create-article-form relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl mb-8">
          Create New Article
        </h1>
        <form
          ref={formRef}
          onSubmit={handleCreate}
          noValidate
          className="space-y-4"
        >
          <InputField
            label="Title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            exists={titleExists}
            errorMessage="This title already exists. Please use a different title."
          />
          <TextAreaField
            label="Description"
            value={description}
            onChange={setDescription}
          />
          {/* <TextAreaField
          label="Detailed Description"
          value={detailedDescription}
          onChange={setDetailedDescription}
        /> */}

          <div className="mt-4">
            <label className="block ">Article Contents:</label>
            {renderDetailedDescription()}
            <button
              type="button"
              onClick={toggleView}
              className="mt-2 text-sm text-indigo-500 hover:text-indigo-800 transition duration-300 ease-in-out"
            >
              {currentView === "raw" ? "Preview" : "Edit"}
            </button>
          </div>
          <InputField
            label="Image Source"
            type="text"
            value={imgSrc}
            onChange={handleImgChange}
            failedRegex={failedRegex}
            errorMessage="Please enter a valid image URL ending with .jpg, .jpeg, .png, or .gif"
          />
          <SelectField
            label="Category"
            options={[
              // The "Choose here" option is already included in the SelectField component
              ...categories.map((category) => ({
                id: category.CategoryID,
                title: category.Title,
              })),
            ]}
            selectedValue={category} // Use the category state directly
            onChange={(value: string) => {
              // Update the category state only if a valid category is selected
              if (value) {
                setCategory(value);
              }
            }}
          />
          <button
            className="bg-indigo-700 hover:bg-indigo-800 text-white p-3 w-full mt-4 transition-all duration-300 disabled:opacity-50"
            type="submit"
            disabled={
              loading ||
              titleExists ||
              failedRegex ||
              category === "" || // Check if category is not selected
              !title.trim() || // Check if title is empty or only whitespace
              !description.trim() || // Check if description is empty or only whitespace
              !detailedDescription.trim() || // Check if detailedDescription is empty or only whitespace
              !imgSrc.trim() // Check if imgSrc is empty or only whitespace
            }
          >
            {loading ? "Creating..." : "Create Article"}
          </button>
        </form>
      </div>
    </>
  );
};

const InputField = ({
  label,
  type,
  value,
  onChange,
  exists = false,
  failedRegex = false,
  pattern,
  errorMessage,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  exists?: boolean;
  failedRegex?: boolean;
  pattern?: string;
  errorMessage?: string;
}) => (
  <div className="block">
    <label>{label}:</label>
    <input
      type={type}
      className={`border p-2 w-full transition duration-200 focus:outline-none ${
        exists || failedRegex
          ? "border-red-500"
          : "hover:border-gray-400 focus:border-indigo-500"
      }`}
      value={value}
      onInput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
      required
      pattern={pattern}
    />
    {(exists || failedRegex) && (
      <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
    )}
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <label className="block">
    {label}:
    <textarea
      className="border border-gray-300 hover:border-gray-400 p-2 w-full transition duration-200 focus:outline-none"
      value={value}
      onInput={(e) => onChange(e.currentTarget.value)}
      required
    />
  </label>
);

const SelectField = ({
  label,
  options,
  selectedValue,
  onChange,
}: {
  label: string;
  options: { id: number; title: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}) => (
  <label className="block">
    {label}:
    <select
      className="border border-gray-300 hover:border-gray-400 p-2 w-full transition duration-200 focus:outline-none"
      onChange={(e) => onChange(e.currentTarget.value)}
      value={selectedValue}
      defaultValue={"Choose here"}
      required
    >
      <option value="Choose here" selected disabled>
        Choose here
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id.toString()}>
          {option.title}
        </option>
      ))}
    </select>
  </label>
);
