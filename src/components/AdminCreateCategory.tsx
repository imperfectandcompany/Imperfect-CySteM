import { FunctionalComponent } from "preact";
import { useState, useRef } from "preact/hooks";
import { route } from "preact-router";
import Breadcrumb from "./Breadcrumb";
import { API_BASE_URL } from "../api";
import { getToken } from "../utils";

export const AdminCreateCategory: FunctionalComponent = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryExists, setCategoryExists] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryChange = (newCategory: string) => {

    setCategoryName(newCategory);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Use the API to check if the category title exists
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/category/checkTitleExists?categoryTitle=${encodeURIComponent(newCategory)}`, {        headers: {
          'Authorization': `${token}`,
        },
      });
      const data = await response.json();
      setCategoryExists(data.exists); // Assuming the API returns a boolean in the `exists` field
    }, 500);
  };

  const handleCreate = async (event: Event) => {
    event.preventDefault();
    if (formRef.current?.checkValidity() === false || categoryExists) {
      formRef.current?.classList.add("shake");
      setTimeout(() => formRef.current?.classList.remove("shake"), 500);
      return;
    }
    setLoading(true);
    // Use the API to create a new category
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/category/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
      body: JSON.stringify({ categoryTitle: categoryName }),
    });

    const result = await response.json();
    console.log('result: ', result);

    setLoading(false);
    if (result && result.status == 'success') {
      // alert("Category created successfully!");
      console.log({result});
      route("/admin/dashboard");
    } else {
      console.log({result});
    console.log('bruhh');
      // alert("Failed to create category");
    }
  };

  return (
    <>
      <Breadcrumb path="/admin/create-category" />
      <div className="px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl mb-8">
          Create New Category
        </h1>
        <form ref={formRef} onSubmit={handleCreate} noValidate className="space-y-4">
          <div className="block">
            <label className="block text-sm font-medium text-gray-700">
              Category Name:
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${
                categoryExists ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              value={categoryName}
              onInput={(e) => handleCategoryChange((e.target as HTMLInputElement).value)}
              required
            />
            {categoryExists && (
              <p className="mt-2 text-sm text-red-600" id="category-error">
                Category already exists. Please use a different name.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || categoryExists}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition ease-in-out duration-300"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </>
  );
};