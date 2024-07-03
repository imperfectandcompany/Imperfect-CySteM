// src/components/AdminCreateArticle.tsx
import { FunctionalComponent } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import { route } from "preact-router";
import { addNewArticle, checkArticleExists, getAllCategories } from "../utils";
import Breadcrumb from "./Breadcrumb";

export const AdminCreateArticle: FunctionalComponent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [category, setCategory] = useState<number>();
  const [categories, setCategories] = useState<
    { id: number; title: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [titleExists, setTitleExists] = useState(false);
  const [failedRegex, setFailedRegex] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const imgDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const titleDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const categoriesList = await getAllCategories();
      setCategories(categoriesList);
      if (categoriesList.length > 0) {
        setCategory(categoriesList[0].id);
      }
    }
    fetchCategories();
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current);
    titleDebounceRef.current = setTimeout(async () => {
      setTitleExists(await checkArticleExists(newTitle));
    }, 500);
  };

  const handleImgChange = (imgSource: string) => {
    setImgSrc(imgSource);
    if (imgDebounceRef.current) clearTimeout(imgDebounceRef.current);
    imgDebounceRef.current = setTimeout(async () => {
      setFailedRegex(!imgSource.match(new RegExp('https?://.+\\.(jpg|jpeg|png|gif)$')));
    }, 500);
  };

  const handleCreate = async (event: Event) => {
    event.preventDefault();
    if (!formRef.current?.checkValidity() || titleExists) {
      formRef.current?.classList.add("shake");
      setTimeout(() => formRef.current?.classList.remove("shake"), 500);
      const firstInvalidElement = formRef.current?.querySelector(
        "input:invalid, textarea:invalid, select:invalid"
      ) as HTMLInputElement;
      firstInvalidElement?.focus();
      return;
    }
    setLoading(true);

    if(category){
      const result = await addNewArticle({
        title,
        description,
        detailedDescription,
        category,
        imgSrc,
      });
      setLoading(false);
      if (result.success) {
        alert("Article created successfully!");
        route("/admin/dashboard");
      } else {
        alert("Failed to create article");
      }
    }
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
        <TextAreaField
          label="Detailed Description"
          value={detailedDescription}
          onChange={setDetailedDescription}
        />
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
          options={categories}
          selectedValue={category ?? undefined}
          onChange={setCategory}
        />
        <button
          className="bg-indigo-700 hover:bg-indigo-800 text-white p-3 w-full mt-4 transition-all duration-300 disabled:opacity-50"
          type="submit"
          disabled={loading || titleExists || failedRegex}
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
        exists
          ? "border-red-500"
          : "hover:border-gray-400 focus:border-indigo-500"
      }`}
      value={value}
      onInput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
      required
      pattern={pattern}
    />
    {exists || failedRegex && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
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
  selectedValue: number | undefined;
  onChange: (value: number) => void;
}) => (
  <label className="block">
    {label}:
    <select
      className="border border-gray-300 hover:border-gray-400 p-2 w-full transition duration-200 focus:outline-none"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        onChange(Number(e.currentTarget.value))
      }
      value={selectedValue}
      required
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.title}
        </option>
      ))}
    </select>
  </label>
);
