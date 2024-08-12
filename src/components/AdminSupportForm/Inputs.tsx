import { useState, useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

interface Input {
  input_id: number;
  input_version_id: number;
  category_id: number;
  label: string;
  type: string;
  created_at: string;
}

interface Category {
  category_id: number;
  category_name: string;
  default_priority: string | null;
  subcategories: Category[];
  inputs: Input[];
  issue?: {
    issue_version_id: number;
    issue_description: string;
    user_id: number;
  } | null;
}

interface Props {
  token: string;
  categoryId?: string;
  prefillCategoryId?: number;
}

const Inputs = ({ token, categoryId, prefillCategoryId }: Props) => {
  const [inputs, setInputs] = useState<Input[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentInput, setCurrentInput] = useState<
    Partial<Input & { options: string[] }>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    fetchInputs();
    fetchCategories();
  }, []);

  useEffect(() => {
    const catId = getQueryParam("categoryId");
    if (catId) {
      setCurrentInput({ category_id: parseInt(catId) });
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (categoryId && !isModalOpen) {
      setCurrentInput((prev) => ({
        ...prev,
        category_id: parseInt(categoryId),
      }));
    }
  }, [categoryId]);

  const fetchInputs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.imperfectgamers.org/support/requests/inputs",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setInputs(data.data);
      } else {
        setError("Failed to fetch inputs: " + data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inputs:", error);
      setError("Error fetching inputs");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.imperfectgamers.org/support/requests/populate/all",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setCategories(data.data);
      } else {
        setError("Failed to fetch categories: " + data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories");
      setLoading(false);
    }
  };

  const handleDeleteInput = async (inputId: number) => {
    if (!confirm("Are you sure you want to delete this input?")) return;

    try {
      const response = await fetch(
        `https://api.imperfectgamers.org/support/requests/inputs/${inputId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        alert("Input deleted successfully");
        fetchInputs();
      } else {
        alert("Failed to delete input: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting input:", error);
    }
  };

  const handleSaveInput = async () => {
    if (!currentInput.label || !currentInput.category_id) return;

    try {
      const method = currentInput.input_id ? "PUT" : "POST";
      const url = currentInput.input_id
        ? `https://api.imperfectgamers.org/support/requests/inputs/${currentInput.input_id}`
        : "https://api.imperfectgamers.org/support/requests/inputs";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(currentInput),
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Input saved successfully");
        setIsModalOpen(false);
        fetchInputs();
      } else {
        alert("Failed to save input: " + data.message);
      }
    } catch (error) {
      console.error("Error saving input:", error);
    }
  };

  const handleEditInput = (input: Input) => {
    setCurrentInput(input);
    setIsModalOpen(true);
  };

  const findCategoryName = (
    categories: Category[],
    categoryId: number
  ): string => {
    for (const category of categories) {
      if (category.category_id === categoryId) {
        return category.category_name;
      }
      if (category.subcategories.length > 0) {
        const name = findCategoryName(category.subcategories, categoryId);
        if (name !== "Unknown Category") {
          return name;
        }
      }
    }
    return "Unknown Category";
  };

  const renderCategoryOptions = (
    categories: Category[],
    indent: string = ""
  ): JSX.Element[] => {
    return categories.flatMap((category) => {
      const categoryOptions = [
        <option
          key={category.category_id}
          value={category.category_id}
          disabled={!category.issue}
        >
          {indent + category.category_name}
        </option>,
      ];

      if (category.subcategories.length > 0) {
        categoryOptions.push(
          ...renderCategoryOptions(category.subcategories, indent + "--")
        );
      }

      return categoryOptions;
    });
  };

  const isSaveDisabled = () => {
    if (!currentInput.label || !currentInput.category_id) {
      return true;
    }
    if (
      ["radio", "dropdown"].includes(currentInput.type) &&
      (!currentInput.options || currentInput.options.length === 0)
    ) {
      return true;
    }
    return false;
  };

  const hideModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.add("modal-leave");
    }
    setTimeout(() => setIsModalOpen(false), 300);
  };

  function useClickAwayListener(
    ref: React.RefObject<HTMLElement>,
    callback: () => void
  ) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  }

  useClickAwayListener(modalRef, () => hideModal());

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="inputs-container p-4">
      <h2 className="text-2xl font-bold mb-4">Inputs</h2>
      <button
        onClick={() => {
          setCurrentInput({
            category_id: undefined,
            label: "",
            type: "text",
            options: [],
          });
          showModal();
        }}
        className="btn-add-input mb-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add New Input
      </button>
      {loading ? (
        <div className="text-center mt-10">Loading...</div>
      ) : error ? (
        <div className="text-center mt-10 text-red-500">{error}</div>
      ) : (
        <table className="inputs-table w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Label</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input) => (
              <tr key={input.input_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{input.input_id}</td>
                <td className="py-2 px-4 border-b">
                  {findCategoryName(categories, input.category_id)}
                </td>
                <td className="py-2 px-4 border-b">{input.label}</td>
                <td className="py-2 px-4 border-b">{input.type}</td>
                <td className="py-2 px-4 border-b">{input.created_at}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditInput(input)}
                    className="btn-edit-input bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteInput(input.input_id)}
                    className="btn-delete-input bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="modal modal-enter bg-white p-8 rounded shadow-lg w-1/2"
            ref={modalRef as React.RefObject<HTMLDivElement>}
          >
            <div className="modal-header">
              <h2 className="text-2xl mb-4">
                {currentInput.input_id ? "Edit Input" : "Add New Input"}
              </h2>
              <span className="modal-close" onClick={() => hideModal()}>
                &times;
              </span>
            </div>
            <div className="modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveInput();
                }}
              >
                <div className="mb-4">
                  <label className="block mb-2">Category</label>
                  <select
                    value={
                      currentInput.category_id !== undefined
                        ? currentInput.category_id
                        : ""
                    }
                    onChange={(e) => {
                      const target = e.target as HTMLSelectElement;
                      setCurrentInput({
                        ...currentInput,
                        category_id: parseInt(target.value),
                      });
                    }}
                    className="border rounded w-full py-2 px-3"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {renderCategoryOptions(categories)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Label</label>
                  <input
                    type="text"
                    value={currentInput.label || ""}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      setCurrentInput({ ...currentInput, label: target.value });
                    }}
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Type</label>
                  <select
                    value={currentInput.type || "text"}
                    onChange={(e) => {
                      const target = e.target as HTMLSelectElement;
                      setCurrentInput({ ...currentInput, type: target.value });
                    }}
                    className="border rounded w-full py-2 px-3"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="radio" disabled>Radio (Currently Unstable)</option>
                  </select>
                </div>
                {(currentInput.type === "radio" ||
                  currentInput.type === "dropdown") && (
                  <div className="mb-4">
                    <label className="block mb-2">Options</label>
                    <textarea
                      value={
                        currentInput.options
                          ? currentInput.options.join("\n")
                          : ""
                      }
                      onChange={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        setCurrentInput({
                          ...currentInput,
                          options: target.value.split("\n"),
                        });
                      }}
                      className="border rounded w-full py-2 px-3"
                      placeholder="Enter one option per line"
                    ></textarea>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="copy-button"
                    disabled={isSaveDisabled() ? true : false}
                  >
                    Save Input
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inputs;
