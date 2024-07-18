import { useState } from 'preact/hooks';

interface Category {
    category_id: string;
    category_name: string;
    parent_id?: string;
    hasChildren?: boolean;
}

interface Props {
    category: Category;
    children?: preact.ComponentChildren;
    fetchCategoryDetails: (categoryId: string) => Promise<any>;
}

const AccordionItem = ({ category, children, fetchCategoryDetails }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen && !details && !category.hasChildren) {
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
                            <h3 className="text-lg font-semibold">Details:</h3>
                            <p>{details.issue.issue_description}</p>
                        </div>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
};

export default AccordionItem;
