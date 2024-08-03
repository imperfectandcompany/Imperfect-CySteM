import { useState, useEffect } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';

interface Issue {
  issue_id: number;
  issue_version_id: number;
  category_id: number;
  description: string;
  user_id: number;
  created_at: string;
}

interface Category {
  category_id: number;
  category_name: string;
  parent_id?: number;
  hasSubCategories?: boolean;
  hasIssues?: boolean;
}

interface Props {
  token: string;
  prefillCategoryId?: number;
}

const Issues = ({ token, prefillCategoryId }: Props) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIssue, setCurrentIssue] = useState<Partial<Issue>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [issuesPerPage] = useState(10); // Number of issues per page
  const [sortConfig, setSortConfig] = useState<{ key: keyof Issue, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
      fetchCategories();
  }, [issues]);

  useEffect(() => {
    if (prefillCategoryId) {
      setCurrentIssue((prev) => ({ ...prev, category_id: prefillCategoryId }));
      setIsModalOpen(true);
    }
  }, [prefillCategoryId]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.imperfectgamers.org/support/requests/issues/all", {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setIssues(data.data);
      } else {
        setError("Failed to fetch issues: " + data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setError("Error fetching issues");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://api.imperfectgamers.org/support/requests/populate", {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        const updatedCategories = data.data.map((category: Category) => {
          const hasSubCategories = data.data.some((cat: Category) => cat.parent_id === category.category_id);
          const hasIssues = issues.some(issue => issue.category_id === category.category_id);
          return { ...category, hasSubCategories, hasIssues };
        });
        setCategories(updatedCategories);
      } else {
        setError("Failed to fetch categories: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories");
    }
  };

  const fetchIssueVersions = async (issueId: number) => {
    try {
      const response = await fetch(`https://api.imperfectgamers.org/support/requests/issues/${issueId}/versions`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setVersionHistory(data.data);
        setIsHistoryModalOpen(true);
      } else {
        alert("Failed to fetch issue versions: " + data.message);
      }
    } catch (error) {
      console.error("Error fetching issue versions:", error);
    }
  };

  const handleDeleteIssue = async (issueId: number) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    try {
      const response = await fetch(`https://api.imperfectgamers.org/support/requests/issues/${issueId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Issue deleted successfully");
        fetchIssues();
      } else {
        alert("Failed to delete issue: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const handleSaveIssue = async () => {
    try {
      const method = currentIssue.issue_id ? 'PUT' : 'POST';
      const url = currentIssue.issue_id ? `https://api.imperfectgamers.org/support/requests/issues/${currentIssue.issue_id}` : 'https://api.imperfectgamers.org/support/requests/issues';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(currentIssue),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Issue saved successfully');
        setIsModalOpen(false);
        fetchIssues();
      } else {
        alert('Failed to save issue: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving issue:', error);
    }
  };

  const handleEditIssue = (issue: Issue) => {
    setCurrentIssue(issue);
    setIsModalOpen(true);
  };

  const handleAddNewIssue = () => {
    setCurrentIssue({});
    setIsModalOpen(true);
  };

  const handleViewHistory = (issueId: number) => {
    fetchIssueVersions(issueId);
  };

  const sortIssues = (issues: Issue[], config: { key: keyof Issue, direction: 'asc' | 'desc' }) => {
    return issues.sort((a, b) => {
      if (a[config.key] < b[config.key]) {
        return config.direction === 'asc' ? -1 : 1;
      }
      if (a[config.key] > b[config.key]) {
        return config.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedIssues = sortConfig ? sortIssues([...issues], sortConfig) : issues;

  // Calculate the issues to display on the current page
  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = sortedIssues.slice(indexOfFirstIssue, indexOfLastIssue);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const requestSort = (key: keyof Issue) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Issue) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '';
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const renderCategoryOptions = (parentId: number | null, indent: string = ''): JSX.Element[] => {
    return categories
      .filter(category => category.parent_id === parentId)
      .flatMap(category => [
        <option key={category.category_id} value={category.category_id} disabled={category.hasSubCategories || category.hasIssues}>
          {indent + category.category_name} {category.hasSubCategories ? '(Has subcategories)' : ''} {category.hasIssues ? '(Has issues)' : ''}
        </option>,
        ...renderCategoryOptions(category.category_id, indent + '--'),
      ]);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="issues-container p-4">
      <h2 className="text-2xl font-bold mb-4">Issues</h2>
      <button onClick={handleAddNewIssue} className="btn-add-issue mb-4 bg-blue-500 text-white py-2 px-4 rounded">
        Add New Issue
      </button>
      <table className="issues-table w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('issue_id')}>
              Issue ID {getSortIndicator('issue_id')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('issue_version_id')}>
              Issue Version ID {getSortIndicator('issue_version_id')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('category_id')}>
              Category ID {getSortIndicator('category_id')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('description')}>
              Description {getSortIndicator('description')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('user_id')}>
              User ID {getSortIndicator('user_id')}
            </th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('created_at')}>
              Created At {getSortIndicator('created_at')}
            </th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentIssues.map((issue) => (
            <tr key={issue.issue_id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{issue.issue_id}</td>
              <td className="py-2 px-4 border-b">{issue.issue_version_id}</td>
              <td className="py-2 px-4 border-b">{issue.category_id}</td>
              <td className="py-2 px-4 border-b">{issue.description}</td>
              <td className="py-2 px-4 border-b">{issue.user_id}</td>
              <td className="py-2 px-4 border-b">{issue.created_at}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditIssue(issue)}
                  className="btn-edit-issue bg-yellow-500 text-white py-1 px-3 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteIssue(issue.issue_id)}
                  className="btn-delete-issue bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewHistory(issue.issue_id)}
                  className="btn-view-history bg-blue-500 text-white py-1 px-3 rounded"
                >
                  History
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(sortedIssues.length / issuesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-8 rounded shadow-lg w-1/2">
            <h2 className="text-2xl mb-4">{currentIssue.issue_id ? 'Edit Issue' : 'Add New Issue'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveIssue();
              }}
            >
              <div className="mb-4">
                <label className="block mb-2">Category</label>
                <select
                  value={currentIssue.category_id || ''}
                  onChange={(e) => {
                    const target = e.target as HTMLSelectElement;
                    setCurrentIssue({ ...currentIssue, category_id: parseInt(target.value) });
                  }}
                  className="border rounded w-full py-2 px-3"
                >
                  <option value="">Select Category</option>
                  {renderCategoryOptions(null)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Description</label>
                <textarea
                  value={currentIssue.description || ''}
                  onChange={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    setCurrentIssue({ ...currentIssue, description: target.value });
                  }}
                  className="border rounded w-full py-2 px-3"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-save bg-blue-500 text-white py-2 px-4 rounded mr-2"
                  disabled={!currentIssue.category_id}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-cancel bg-gray-300 text-black py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="modal fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-8 rounded shadow-lg w-1/2">
            <h2 className="text-2xl mb-4">Issue Version History</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Version ID</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Created At</th>
                </tr>
              </thead>
              <tbody>
                {versionHistory.map((version) => (
                  <tr key={version.issue_version_id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{version.issue_version_id}</td>
                    <td className="py-2 px-4 border-b">{version.description}</td>
                    <td className="py-2 px-4 border-b">{version.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="btn-close bg-gray-300 text-black py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
