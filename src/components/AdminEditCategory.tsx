import { FunctionalComponent } from "preact";
import { useState, useRef, useContext } from "preact/hooks";
import { route } from "preact-router";
import Breadcrumb from "./Breadcrumb";
import { ContentContext } from "../contexts/ContentContext";
import { checkCategoryExists, updateCategory } from "../utils";

interface CategoryProps {
  id: number;
}

const AdminEditCategory: FunctionalComponent<CategoryProps> = ({ id }) => {
  const [category, setCategory] = useState<{ id: number; title: string; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryExists, setCategoryExists] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [originalTitle, setOriginalTitle] = useState(''); // New state for the original title
  const [newTitle, setNewTitle] = useState(''); // State to hold the new title input by the user



  const fetchCategory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchArticle(id);
      if (data) {
        const latestTitle = data.versions[data.versions.length - 1].title;
        setCategory({ id: data.versions[data.versions.length - 1].versionId, title: latestTitle });
        setOriginalTitle(latestTitle); // Set the original title
      } else {
        setError('Category not found');
      }
    } catch (err) {
      setError('Failed to load category');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSave = async (event: Event) => {
    event.preventDefault();
    if (!category) return;

    // Check if the new title is the same as the original title
    if (newTitle === originalTitle) {
      alert('The category name is the same as the current name.');
      return;
    }

    // Check if the new title already exists
    if (await checkCategoryExists(newTitle)) {
      alert('A category with this name already exists.');
      return;
    }

    setLoading(true);
    try {
      const result = await updateCategory(category.id, { title: newTitle });
      if (result.success) {
        alert('Category updated successfully!');
        route('/admin/dashboard'); // Redirect to the dashboard or appropriate page
      } else {
        setError('Failed to update category');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred while updating the category.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (title: string) => {
    setNewTitle(title); // Update newTitle with the user input
    if (title === originalTitle) {
      setCategoryExists(false); // No error if the title is unchanged
    } else {
      setCategoryExists(await checkCategoryExists(title));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
<>
<Breadcrumb path={`/admin/edit-category`} categoryId={id} />
    <div className="px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
      <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl mb-8">
      Edit Category
      </h1>
      <form ref={formRef} onSubmit={handleSave} noValidate className="space-y-4">
        <div className="block">
          <label className="block text-sm font-medium text-gray-700">
            Category Name:
          </label>
          <input
            type="text"
            className={`mt-1 block w-full px-3 py-2 border ${
              categoryExists ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder={originalTitle} // Use originalTitle for the placeholder
            value={newTitle} // Use newTitle for the input value
            onInput={(e) => handleCategoryChange((e.target as HTMLInputElement).value)}
            required
          />
          {categoryExists && newTitle !== originalTitle && (
            <p className="mt-2 text-sm text-red-600" id="category-error">
              This category name cannot be used. Please choose a different name.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || (categoryExists && newTitle !== originalTitle)}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition ease-in-out duration-300"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
</>
  );
};

export default AdminEditCategory;
