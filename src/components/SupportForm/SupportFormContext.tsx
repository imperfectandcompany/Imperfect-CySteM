import { createContext, ComponentChildren, JSX } from "preact";
import { useState, useEffect, useContext } from "preact/hooks";
import { fetchIssueCategories } from "../../api";

export interface SubIssueInput {
    id: number;
    label: string;
    type: string;
    placeholder: string;
    tooltip?: string;
    versionId: number;
}

export interface SubIssue {
    id: number;
    label: string;
    versionId: number;
    inputs: SubIssueInput[];
}

export interface SubCategory {
    id: number;
    label: string;
    versionId: number;
    subIssues: SubIssue[];
}

export interface IssueCategory {
    id: number;
    label: string;
    versionId: number;
    subCategories: Record<string, SubCategory>;
}

export interface SupportRequestContextProps {
    categories: IssueCategory[];
    loading: boolean;
    error: string | null;
    getCategoryById: (id: number) => IssueCategory | undefined;
    getSubCategoryById: (categoryId: number, subCategoryId: string) => SubCategory | undefined;
}

const SupportRequestContext = createContext<SupportRequestContextProps | undefined>(undefined);

interface SupportRequestProviderProps {
    children: ComponentChildren;
}

export const SupportRequestProvider = ({ children }: SupportRequestProviderProps): JSX.Element => {
    const [categories, setCategories] = useState<IssueCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await fetchIssueCategories();
                if (response.status === 'success') {
                    setCategories(response.categories);
                } else {
                    setError('Failed to fetch categories due to server error');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const getCategoryById = (id: number) => categories.find(c => c.id === id);
    const getSubCategoryById = (categoryId: number, subCategoryId: string) => {
        const category = getCategoryById(categoryId);
        return category?.subCategories[subCategoryId];
    };

    const contextValue: SupportRequestContextProps = {
        categories,
        loading,
        error,
        getCategoryById,
        getSubCategoryById
    };

    return (
        <SupportRequestContext.Provider value={contextValue}>
            {children}
        </SupportRequestContext.Provider>
    );
};

export const useSupportRequest = (): SupportRequestContextProps => {
    const context = useContext(SupportRequestContext);
    if (context === undefined) {
        throw new Error("useSupportRequest must be used within a SupportRequestProvider");
    }
    return context;
};
