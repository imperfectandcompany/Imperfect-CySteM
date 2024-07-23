import { FunctionalComponent } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import { route } from "preact-router";
import Breadcrumb from "./Breadcrumb";
import { API_BASE_URL } from "../api";
import { generateSlug, getToken } from "../utils";

interface CategoryProps {
  id: number;
}

const AdminEditCategory: FunctionalComponent<CategoryProps> = ({ id }) => {
  const [category, setCategory] = useState<{ id: number; title: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categoryExists, setCategoryExists] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [originalTitle, setOriginalTitle] = useState('');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/category/fetchVersions/${id}`, {
        headers: {
          'Authorization': `${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      const data = await response.json();
      if (data && data.versions && data.versions.length > 0) {
        const latestVersion = data.versions[data.versions.length - 1];
        setCategory({ id, title: latestVersion.title });
        setOriginalTitle(latestVersion.title);
      } else {
        setError('Category not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event: Event) => {
    event.preventDefault();
    if (!category) return;

    if (newTitle === originalTitle) {
      alert('The category name is the same as the current name.');
      return;
    }

    if (categoryExists) {
      alert('A category with this name already exists.');
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/category/update/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ categoryTitle: newTitle }),
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const result = await response.json();
      if (result && result.status === 'success') {
        route('/admin/dashboard');
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
      setSaving(false);
    }
  };

  const handleCategoryChange = async (title: string) => {
    setNewTitle(title);
    if (title === originalTitle) {
      setCategoryExists(false);
      return;
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/category/checkTitleExists?categoryTitle=${encodeURIComponent(title)}`, {
      headers: {
        'Authorization': `${token}`,
      },
    });
    const data = await response.json();
    setCategoryExists(data.exists);
  };

  const handleReset = () => {
    setNewTitle(originalTitle);
    setCategoryExists(false);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Breadcrumb path={`/admin/edit/category/${id}`} categoryId={id} categorySlug={generateSlug(category?.title || '')} />
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
              className={`mt-1 block w-full px-3 py-2 border ${categoryExists ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder={originalTitle}
              value={newTitle}
              onInput={(e) => handleCategoryChange((e.target as HTMLInputElement).value)}
              required
              disabled={loading || saving}
            />
            {categoryExists && newTitle !== originalTitle && (
              <p className="mt-2 text-sm text-red-600" id="category-error">
                This category name cannot be used. Please choose a different name.
              </p>
            )}
          </div>
          <div className="flex space-x-4 flex-end items-end justify-end">
            <button
              type="submit"
              disabled={loading || saving || categoryExists || newTitle.trim() === ''}
              className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition ease-in-out duration-300 relative`}
            >
              {saving ? (
                <>
                  <span className="opacity-0">Save Changes</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-500 hidden hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading || saving}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminEditCategory;
