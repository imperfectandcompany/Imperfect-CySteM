import { h, ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';
import { CategoryDetails } from './IssueCategories';
import { route } from 'preact-router';

interface Category {
    category_id: number;
    category_name: string;
    parent_id?: number;
    hasChildren?: boolean;
}

interface Input {
    input_id: number;
    input_type: string;
    input_label: string;
    options?: string[];
    hasNullOption?: boolean;
}

interface Props {
    category: Category;
    children?: ComponentChildren;
    fetchCategoryDetails: (categoryId: number) => Promise<CategoryDetails>;
    onAddIssue: (categoryId: number) => void;  // Add this prop
    onAddInput: (categoryId: number) => void;  // Add this prop
}

const AccordionItem = ({ category, children, fetchCategoryDetails, onAddIssue, onAddInput }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState<CategoryDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = () => {
        setIsOpen(prevIsOpen => {
            // If we're going to open the AccordionItem, fetch details
            if (!prevIsOpen && !details && !category.hasChildren) {
                setLoading(true);
                fetchCategoryDetails(category.category_id)
                    .then(data => {
                        setDetails(data);
                        setLoading(false);
                    })
                    .catch(() => {
                        setError('Failed to fetch details');
                        setLoading(false);
                    });
            }
            // Toggle the open state
            return !prevIsOpen;
        });
    };

    const groupInputs = (inputs: Input[]) => {
        const groupedByType = inputs.reduce((acc, input) => {
            if (!acc[input.input_type]) {
                acc[input.input_type] = [];
            }
            acc[input.input_type].push(input);
            return acc;
        }, {} as Record<string, Input[]>);

        const grouped = Object.keys(groupedByType).reduce((acc, type) => {
            acc[type] = groupedByType[type].reduce((acc, input) => {
                const key = `${input.input_id}-${input.input_type}`;
                if (input.input_type === 'dropdown' || input.input_type === 'radio') {
                    if (!acc[key]) {
                        acc[key] = { ...input, option_values: input.options || [], hasNullOption: false };
                    }
                    if (!input.options) {
                        acc[key].hasNullOption = true;
                    }
                } else {
                    if (!acc[key]) {
                        acc[key] = { ...input, option_values: [], hasNullOption: false };
                    }
                }
                return acc;
            }, {} as Record<string, Input & { option_values: string[]; hasNullOption: boolean }>);
            return acc;
        }, {} as Record<string, Record<string, Input & { option_values: string[]; hasNullOption: boolean }>>);

        const warnings = inputs.reduce((acc, input) => {
            const key = `${input.input_id}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(input);
            return acc;
        }, {} as Record<string, Input[]>);

        const warningGroups = Object.values(warnings).filter(w => w.length > 1 && w.some(input => input.input_type !== 'dropdown' && input.input_type !== 'radio'));

        return { grouped, warnings: warningGroups };
    };

    const identifyIssues = (inputs: Input[]) => {
        const issues = inputs.reduce((acc, input) => {
            const key = `${input.input_id}`;
            if (!acc[key]) {
                acc[key] = { types: new Set<string>(), inputs: [] };
            }
            acc[key].types.add(input.input_type);
            acc[key].inputs.push(input);
            return acc;
        }, {} as Record<string, { types: Set<string>; inputs: Input[] }>);

        return Object.values(issues).filter(issue => issue.inputs.length > 1 && (issue.types.size > 1 || (issue.types.size === 1 && !['dropdown', 'radio'].includes([...issue.types][0]))));
    };

    const countUniqueInputs = (inputs: Input[]) => {
        const uniqueInputs = inputs.reduce((acc, input) => {
            if (!acc[input.input_id]) {
                acc[input.input_id] = true;
            }
            return acc;
        }, {} as Record<number, boolean>);
        return Object.keys(uniqueInputs).length;
    };

    return (
        <div className="mb-4">
            <div
                className="p-4 border rounded shadow cursor-pointer flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition duration-300"
                onClick={handleToggle}
            >
                <div>
                    <h2 className="text-xl font-semibold">{category.category_name}</h2>
                    <p className="text-sm text-gray-600">ID: {category.category_id}</p>
                    {category.parent_id && (
                        <p className="text-sm text-gray-600">Parent ID: {category.parent_id}</p>
                    )}
                </div>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
            </div>
            {isOpen && (
                <div className="ml-5 mt-2 transition duration-300 ease-in-out transform">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {details && (
                        <div>
                            {details.issue ? (
                                <>
                                    <p>{details.issue.issue_description}</p>
                                    <h4 className="text-md font-semibold mt-2">Inputs: {countUniqueInputs(details.inputs)}</h4>
                                    {details.inputs.length === 0 ? (
                                        <p className="text-gray-500">No inputs available.</p>
                                    ) : (
                                        Object.keys(groupInputs(details.inputs).grouped).map(type => {
                                            const uniqueInputs = Object.values(groupInputs(details.inputs).grouped[type]).reduce((acc, input) => {
                                                if (!acc[input.input_id]) {
                                                    acc[input.input_id] = true;
                                                }
                                                return acc;
                                            }, {} as Record<number, boolean>);
                                            const inputCount = Object.keys(uniqueInputs).length;
                                            return (
                                                <div key={type}>
                                                    <h5 className="text-md font-semibold mt-2">{type.charAt(0).toUpperCase() + type.slice(1)}(s) Count: <span className="text-gray-500">{inputCount}</span></h5>
                                                    {Object.values(groupInputs(details.inputs).grouped[type]).map(input => (
                                                        <div key={input.input_id}>
                                                            <p>Label: {input.input_label} (ID: {input.input_id})</p>
                                                            {input.option_values.length > 0 && (
                                                                <ul className="list-disc ml-5">
                                                                    {input.option_values.filter(value => value).map((value, index) => (
                                                                        <li key={index}>{value}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                            {input.hasNullOption && (
                                                                <div className="border border-yellow-500 p-2 mt-2">
                                                                    <p className="text-yellow-700">Warning: Missing option value for input ID {input.input_id}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })
                                    )}
                                    {identifyIssues(details.inputs).map((issue, index) => (
                                        <div key={index} className="border border-yellow-500 p-2 mt-2">
                                            <p className="font-semibold">Warning: Multiple inputs with same ID but different types or mismatched types</p>
                                            <p className="font-semibold">Input ID: {issue.inputs[0].input_id} (Total: {issue.inputs.length})</p>
                                            {issue.inputs.map(input => (
                                                <p key={input.input_id}>{input.input_label} (Type: {input.input_type})</p>
                                            ))}
                                            {issue.types.size > 1 && (
                                                <p className="text-yellow-700">Issue: Different types for the same input ID</p>
                                            )}
                                            {issue.types.size === 1 && !['dropdown', 'radio'].includes([...issue.types][0]) && (
                                                <p className="text-yellow-700">Issue: Type not allowed for grouping</p>
                                            )}
                                        </div>
                                    ))}
                                    <button 
                                        className="bg-blue-500 text-white py-2 px-4 rounded transition transform hover:scale-105 mt-2"
                                        onClick={() => onAddInput(category.category_id)}  // Call onAddInput with category ID
                                    >
                                        Add Input
                                    </button>
                                </>
                            ) : (
                                <div>
                                    <button
                                        className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                                        onClick={() => onAddIssue(category.category_id)}  // Call onAddIssue with category ID
                                    >
                                        Add Issue
                                    </button>
                                    <button
                                        className="bg-green-500 hidden text-white py-2 px-4 rounded mt-2 ml-2"
                                        onClick={() => {
                                            // Logic to add a new subcategory
                                        }}
                                    >
                                        Add Subcategory
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
};

export default AccordionItem;
