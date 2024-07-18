import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import AccordionItem from './AccordionItem';

interface Category {
    category_id: string;
    category_name: string;
    parent_id?: string;
    hasChildren?: boolean;
}

interface Props {
    token: string;
}

const IssueCategories = ({ token }: Props) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://api.imperfectgamers.org/support/requests/populate', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setCategories(data.data);
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

    const fetchCategoryDetails = (categoryId: string) => {
        return fetch(`https://api.imperfectgamers.org/support/requests/populate/category/${categoryId}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    return data.data;
                } else {
                    throw new Error('Failed to fetch details');
                }
            });
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    const renderCategories = (parentId: string | null) => {
        return categories
            .filter(category => category.parent_id === parentId)
            .map(category => {
                const hasChildren = categories.some(cat => cat.parent_id === category.category_id);
                return (
                    <AccordionItem 
                        key={category.category_id} 
                        category={{ ...category, hasChildren }} 
                        fetchCategoryDetails={fetchCategoryDetails}
                    >
                        {hasChildren && renderCategories(category.category_id)}
                    </AccordionItem>
                );
            });
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-5 text-center">Issue Categories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {renderCategories(null)}
            </div>
        </div>
    );
};

export default IssueCategories;
