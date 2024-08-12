import { useState, useEffect } from 'preact/hooks';
import AccordionItem from './AccordionItem';
import { JSX } from 'preact/jsx-runtime';
import React from 'preact/compat';

interface Category {
    category_id: number;
    category_name: string;
    parent_id: number | null;
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
/**
 * Fixes the implicit 'any' type errors by explicitly defining the types for the props.
 */
// Start of Selection

// Add StatusIndicator component
// Define the StatusIndicator to accept a third prop 'isValidPath'
const StatusIndicator = ({ isLoading, hasError, isValidPath }: { isLoading: boolean; hasError: boolean, isValidPath: boolean }) => {
    let statusColor, statusText;

    if (isLoading) {
        statusColor = 'bg-yellow-500';
        statusText = 'Checking...';
    } else if (hasError) {
        statusColor = 'bg-red-500';
        statusText = 'Unavailable';
    } else if (!isValidPath) {
        statusColor = 'bg-red-500';
        statusText = 'No Valid Path';
    } else {
        statusColor = 'bg-green-500';
        statusText = 'Live';
    }

    return (
        <div className={`flex items-center space-x-2`}>
            <div className={`h-3 w-3 rounded-full ${statusColor} animate-pulse`}></div>
            <span className="text-sm">{statusText}</span>
        </div>
    );
};


const IssueCategories = ({ token, onAddIssue, onAddInput }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [parentId, setParentId] = useState<number | null>(null);
    const [defaultPriority, setDefaultPriority] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [isValidPath, setIsValidPath] = useState(true);

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


                setLoading(true);
                fetch('https://api.imperfectgamers.org/support/requests/populate/all', {
                    headers: { 'Authorization': token },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const validCategories = filterValidCategories(data.data);
                        // Check if there are usable categories for form submission
                        if (validCategories.length === 0) {
                            setError("No valid path for form submission. Please contact an administrator.");
                            setIsValidPath(false);
                        } else {
                            setIsValidPath(true);
                        }
                    } else {
                        setError(`Failed to fetch categories: ${data.message}`);
                        setIsValidPath(false);
                    }
                })
                .catch(error => {
                    console.error('Error fetching form data:', error);
                    setError('Error fetching form data');
                    setIsValidPath(false);
                })
                .finally(() => {
                    setLoading(false);
                });

    }, [token]);
    
    const filterValidCategories = (categories:any) => {
        return categories.filter((category:any) => isValidCategory(category));
    };
    
    const isValidCategory = (category:any) => {
        // Check current category for direct validity
        if ((category.issue !== null) && (category.inputs && category.inputs.length > 0)) {
            return true;
        }
    
        // Recursively check subcategories
        if (category.subcategories) {
            return category.subcategories.some((subCat:any) => isValidCategory(subCat));
        }
    
        return false;
    };
    
    
    
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
                    setCategories([...categories, { category_id: data.category_id, category_name: name, parent_id: parentId ?? null, hasIssue: false }]);
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

    //prevent nesting until we fix a certain bug.
    // const renderCategoryOptions = (parentId: number | null, indent: string = ''): JSX.Element[] => {
    //     return categories
    //         .filter(category => category.parent_id === parentId)
    //         .flatMap(category => [
    //             <option key={category.category_id} value={category.category_id} disabled={category.hasIssue}>
    //                 {indent + category.category_name} {category.hasIssue ? '(Issue exists)' : ''}
    //             </option>,
    //             ...renderCategoryOptions(category.category_id, indent + '--'),
    //         ]);
    // };

    // const renderCategoryOptions = (parentId: number | null, indent: string = ''): JSX.Element[] => {
    //     return categories
    //         .filter(category => category.parent_id === parentId)
    //         .flatMap(category => {
    //             // Check if the category has subcategories
    //             const hasSubcategories = categories.some(cat => cat.parent_id === category.category_id);
    //             return [
    //                 <option key={category.category_id} value={category.category_id} disabled={hasSubcategories}>
    //                     {indent + category.category_name} {hasSubcategories ? '(Subcategories exist)' : ''}
    //                 </option>,
    //                 // Do not render options for sub-subcategories
    //                 ...(hasSubcategories ? [] : renderCategoryOptions(category.category_id, indent + '--')),
    //             ];
    //         });
    // };

    const renderCategoryOptions = (parentId: number | null, indent: string = ''): JSX.Element[] => {
        return categories
            .filter(category => category.parent_id === parentId)
            .flatMap(category => {
                // Check if the category has an issue
                const isDisabled = category.hasIssue;
    
                const optionElement = (
                    <option key={category.category_id} value={category.category_id} disabled={isDisabled}>
                        {indent + category.category_name}
                    </option>
                );
    
                // Render subcategories with indentation, but do not allow adding beneath them
                const subcategoryOptions = renderCategoryOptions(category.category_id, indent + '--').map(subOption => {
                    // Subcategories should not allow adding beneath them, so disable all subcategory options
                    return React.cloneElement(subOption, { disabled: true });
                });
    
                return [optionElement, ...subcategoryOptions];
            });
    };

    // const renderCategoryOptions = (parentId: number | null) => {
    //     return categories
    //       .filter(category => !category.hasChildren) // Only include categories without children
    //       .map(category => (
    //         <option key={category.category_id} value={category.category_id}>
    //           {category.category_name}
    //         </option>
    //       ));
    //   };

    const renderCategories = (parentId: number | null) => {
        return categories
            .filter(category => category.parent_id === parentId)
            .map(category => {
                const hasChildren = categories.some(cat => cat.parent_id === category.category_id);
                return (
                    <AccordionItem 
                        key={category.category_id} 
                        category={{ 
                            category_id: category.category_id, 
                            category_name: category.category_name, 
                            parent_id: category.parent_id ?? undefined, 
                            hasChildren 
                        }} 
                        fetchCategoryDetails={fetchCategoryDetails}
                        onAddIssue={onAddIssue}  // Pass onAddIssue to AccordionItem
                        onAddInput={onAddInput}  // Pass onAddInput to AccordionItem
                    >
                        {hasChildren && renderCategories(category.category_id)}
                    </AccordionItem>
                );
            });
    };

    // if (loading) {
    //     return <div className="text-center mt-10">Loading...</div>;
    // }

    // if (error) {
    //     return <div className="text-center mt-10 text-red-500">{error}</div>;
    // }

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
            <StatusIndicator isLoading={loading} hasError={!!error} isValidPath={isValidPath} />
        </div>
    );
};

export default IssueCategories;
