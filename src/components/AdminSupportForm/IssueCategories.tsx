import { useState, useEffect } from 'preact/hooks';
import AccordionItem from './AccordionItem';
import { JSX } from 'preact/jsx-runtime';

interface Category {
    category_id: number;
    category_name: string;
    parent_id?: number;
    hasChildren?: boolean;
    hasIssue?: boolean; // Add this field to indicate if the category has an issue
}

interface Props {
    token: string;
    onAddIssue: (categoryId: number) => void;
    onAddInput: (categoryId: number) => void; // Add this prop
}

interface Input {
    input_id: number;
    input_type: string;
    input_version_id: number;
    input_label: string;
    options: string[];
}

interface Issue {
    issue_version_id: number;
    issue_description: string;
}

export interface CategoryDetails {
    inputs: Input[];
    issue: Issue | null;
}

const IssueCategories = ({ token, onAddIssue, onAddInput }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [parentId, setParentId] = useState<number | null>(null);
    const [defaultPriority, setDefaultPriority] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://api.imperfectgamers.org/support/requests/populate', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(async data => {
                if (data.status === 'success') {
                    const categoriesWithIssues = await Promise.all(data.data.map(async (category: Category) => {
                        const details = await fetchCategoryDetails(category.category_id);
                        return {
                            ...category,
                            hasIssue: details.issue !== null,
                        };
                    }));
                    setCategories(categoriesWithIssues);
                } else {
                    setError('Failed to fetch categories');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch categories');
                setLoading(false);
            });
    }, [token]);

    const fetchCategoryDetails = (categoryId: number): Promise<CategoryDetails> => {
        return fetch(`https://api.imperfectgamers.org/support/requests/populate/category/${categoryId}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    return data.data as CategoryDetails; // Type assertion for the returned data
                } else {
                    throw new Error('Failed to fetch details');
                }
            });
    };

    const handleCreateCategory = () => {
        const requestBody: { name: string; parent_id?: number; default_priority?: string } = { name };
        if (parentId !== null) requestBody.parent_id = parentId;
        if (defaultPriority !== null) requestBody.default_priority = defaultPriority;

        fetch('https://api.imperfectgamers.org/support/requests/categories', {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setCategories([...categories, { category_id: data.category_id, category_name: name, parent_id: parentId ?? undefined, hasIssue: false }]);
                    setName('');
                    setParentId(null);
                    setDefaultPriority(null);
                    setSubmitError(null);
                } else {
                    setSubmitError('Failed to create category');
                }
            })
            .catch(() => {
                setSubmitError('Failed to create category');
            });
    };

    const renderCategoryOptions = (parentId: number | null, indent: string = ''): JSX.Element[] => {
        return categories
            .filter(category => category.parent_id === parentId)
            .flatMap(category => [
                <option key={category.category_id} value={category.category_id} disabled={category.hasIssue}>
                    {indent + category.category_name} {category.hasIssue ? '(Issue exists)' : ''}
                </option>,
                ...renderCategoryOptions(category.category_id, indent + '--'),
            ]);
    };

    const renderCategories = (parentId: number | null) => {
        return categories
            .filter(category => category.parent_id === parentId)
            .map(category => {
                const hasChildren = categories.some(cat => cat.parent_id === category.category_id);
                return (
                    <AccordionItem 
                        key={category.category_id} 
                        category={{ ...category, hasChildren }} 
                        fetchCategoryDetails={fetchCategoryDetails}
                        onAddIssue={onAddIssue}  // Pass onAddIssue to AccordionItem
                        onAddInput={onAddInput}  // Pass onAddInput to AccordionItem
                    >
                        {hasChildren && renderCategories(category.category_id)}
                    </AccordionItem>
                );
            });
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-5 text-center">Issue Categories</h1>
            <div className="mb-5 p-5 border rounded-lg shadow-inner bg-gray-50">
                <h2 className="text-2xl mb-3">Create New Category</h2>
                <div className="mb-3">
                    <label className="block mb-1 font-medium">Category Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName((e.target as HTMLInputElement).value)}
                        className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-3">
                    <label className="block mb-1 font-medium">Parent Category (optional)</label>
                    <select 
                        value={parentId ?? ''} 
                        onChange={(e) => setParentId((e.target as HTMLSelectElement).value ? parseInt((e.target as HTMLSelectElement).value) : null)}
                        className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">None</option>
                        {renderCategoryOptions(null)}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="block mb-1 font-medium">Default Priority (optional)</label>
                    <select 
                        value={defaultPriority ?? ''} 
                        onChange={(e) => setDefaultPriority((e.target as HTMLSelectElement).value || null)}
                        className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">None</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <button 
                    onClick={handleCreateCategory} 
                    className="bg-blue-500 text-white py-2 px-4 rounded transition transform hover:scale-105"
                >
                    Create Category
                </button>
                {submitError && <div className="text-red-500 mt-3">{submitError}</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {renderCategories(null)}
            </div>
        </div>
    );
};

export default IssueCategories;
