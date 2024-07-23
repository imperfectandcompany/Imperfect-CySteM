import { useState } from "preact/hooks";
import "tailwindcss/tailwind.css";
import { issueCategories, subIssuesInputs } from "./supportFormData";

function AdminSupportDashboard() {
  const [categories, setCategories] = useState(issueCategories);
  const [subIssues, setSubIssues] = useState(subIssuesInputs);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubIssue, setSelectedSubIssue] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubIssue, setNewSubIssue] = useState("");

  const handleAddCategory = () => {
    if (newCategory && !categories[newCategory]) {
      setCategories({ ...categories, [newCategory]: [] });
      setNewCategory("");
    }
  };

  const handleAddSubIssue = () => {
    if (selectedCategory && newSubIssue && !categories[selectedCategory].includes(newSubIssue)) {
      setCategories({
        ...categories,
        [selectedCategory]: [...categories[selectedCategory], newSubIssue],
      });
      setSubIssues({ ...subIssues, [newSubIssue]: [] });
      setNewSubIssue("");
    }
  };

  const handleAddInputField = (label: string, type: string, placeholder: string, tooltip: string) => {
    if (selectedSubIssue) {
      setSubIssues({
        ...subIssues,
        [selectedSubIssue]: [
          ...(subIssues[selectedSubIssue] || []),
          { label, type, placeholder, tooltip },
        ],
      });
    }
  };

  const handleDeleteCategory = (category: string) => {
    const updatedCategories = { ...categories };
    delete updatedCategories[category];
    setCategories(updatedCategories);
    setSelectedCategory("");
    setSelectedSubIssue("");
  };

  const handleDeleteSubIssue = (subIssue: string) => {
    const updatedCategories = { ...categories };
    updatedCategories[selectedCategory] = updatedCategories[selectedCategory].filter(
      (issue) => issue !== subIssue
    );
    setCategories(updatedCategories);

    const updatedSubIssues = { ...subIssues };
    delete updatedSubIssues[subIssue];
    setSubIssues(updatedSubIssues);
    setSelectedSubIssue("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Support Form Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Add Category</h2>
        <input
          type="text"
          className="border rounded p-2 mb-2"
          value={newCategory}
          onChange={(e) => setNewCategory((e.target as HTMLInputElement).value)}
          placeholder="New Category"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Categories</h2>
        {Object.keys(categories).map((category) => (
          <div key={category} className="mb-2">
            <span className="mr-2">{category}</span>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleDeleteCategory(category)}
            >
              Delete
            </button>
            <button
              className="bg-green-500 text-white px-2 py-1 rounded ml-2"
              onClick={() => setSelectedCategory(category)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      {selectedCategory && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Add Sub-Issue to {selectedCategory}</h2>
          <input
            type="text"
            className="border rounded p-2 mb-2"
            value={newSubIssue}
            onChange={(e) => setNewSubIssue((e.target as HTMLInputElement).value)}
            placeholder="New Sub-Issue"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddSubIssue}
          >
            Add Sub-Issue
          </button>
        </div>
      )}
      {selectedCategory && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Sub-Issues in {selectedCategory}</h2>
          {categories[selectedCategory].map((subIssue) => (
            <div key={subIssue} className="mb-2">
              <span className="mr-2">{subIssue}</span>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDeleteSubIssue(subIssue)}
              >
                Delete
              </button>
              <button
                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                onClick={() => setSelectedSubIssue(subIssue)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedSubIssue && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Add Input Field to {selectedSubIssue}</h2>
          <InputFieldForm onAddField={handleAddInputField} />
        </div>
      )}
      {selectedSubIssue && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Input Fields in {selectedSubIssue}</h2>
          {subIssues[selectedSubIssue].map((input, index) => (
            <div key={index} className="mb-2">
              <span>{input.label}</span>
              <span className="ml-2">{input.type}</span>
              <span className="ml-2">{input.placeholder}</span>
              <span className="ml-2">{input.tooltip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  // Start of Selection
}

function InputFieldForm({ onAddField }: { onAddField: (label: string, type: string, placeholder: string, tooltip: string) => void }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [placeholder, setPlaceholder] = useState("");
  const [tooltip, setTooltip] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    onAddField(label, type, placeholder, tooltip);
    setLabel("");
    setType("text");
    setPlaceholder("");
    setTooltip("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel((e.target as HTMLInputElement).value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Field Label"
          required/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType((e.target as HTMLSelectElement).value)}
          className="mt-1 block w-full border rounded-md p-2"
          required
        >
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="date">Date</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Placeholder</label>
        <input
          type="text"
          value={placeholder}
          onChange={(e) => setPlaceholder((e.target as HTMLInputElement).value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Placeholder Text"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tooltip</label>
        <input
          type="text"
          value={tooltip}
          onChange={(e) => setTooltip((e.target as HTMLInputElement).value)}
          className="mt-1 block w-full border rounded-md p-2"
          placeholder="Tooltip Text (Optional)"
        />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Field
      </button>
    </div>
    </form>
  );
}

export default AdminSupportDashboard;
