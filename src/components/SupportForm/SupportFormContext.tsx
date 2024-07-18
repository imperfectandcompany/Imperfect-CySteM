// supportFormContext.js
import { createContext } from 'preact';
import { useState, useContext } from 'preact/hooks';
import { issueCategories, subIssuesInputs } from './supportFormData';

const SupportFormContext = createContext(null);

export const useSupportFormContext = () => useContext(SupportFormContext);

interface SupportFormProviderProps {
  children: React.ReactNode;
}

export const SupportFormProvider: React.FC<SupportFormProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState(issueCategories);
  const [subIssues, setSubIssues] = useState(subIssuesInputs);

  const handleAddCategory = (newCategory: string | number) => {
    if (newCategory && !categories[newCategory]) {
      setCategories(prev => ({ ...prev, [newCategory]: [] }));
    }
  };

  const handleAddSubIssue = (category: string | number, newSubIssue: string) => {
    if (category && newSubIssue && !categories[category].includes(newSubIssue)) {
      setCategories(prev => ({
        ...prev,
        [category]: [...prev[category], newSubIssue],
      }));
      setSubIssues(prev => ({ ...prev, [newSubIssue]: [] }));
    }
  };

  const contextValue = {
    categories,
    subIssues,
    handleAddCategory,
    handleAddSubIssue
  };
  return (
    <SupportFormContext.Provider value={contextValue as any}>
      {children}
    </SupportFormContext.Provider>
  );
}
