import { h } from 'preact';

interface TabProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const Tab = ({ label, isActive, onClick }: TabProps) => (
    <button
        className={`px-4 py-2 ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-t`}
        onClick={onClick}
    >
        {label}
    </button>
);

interface TabsProps {
    tabs: string[];
    activeTab: number;
    onTabClick: (index: number) => void;
}

const Tabs = ({ tabs, activeTab, onTabClick }: TabsProps) => (
    <div className="flex space-x-2 border-b">
        {tabs.map((tab, index) => (
            <Tab
                key={index}
                label={tab}
                isActive={activeTab === index}
                onClick={() => onTabClick(index)}
            />
        ))}
    </div>
);

export default Tabs;
