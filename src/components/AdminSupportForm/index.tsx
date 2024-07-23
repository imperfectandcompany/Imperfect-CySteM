import { useState, useEffect } from 'preact/hooks';
import { route, Router } from 'preact-router';
import Tabs from './Tabs';
import IssueCategories from './IssueCategories';
import ActionLogs from './ActionLogs';
import Inputs from './Inputs';
import SupportRequests from './SupportRequests';
import Breadcrumb from '../Breadcrumb';
import { getToken } from '../../utils';
import Issues from './Issues';
import SupportRequestDetails from '../SupportForm/SupportRequestDetails';

const AdminSupportForm = () => {
    const token = getToken();
    const [activeTab, setActiveTab] = useState(0);
    const [prefillCategoryId, setPrefillCategoryId] = useState<number | null>(null);
    const [viewRequestId, setViewRequestId] = useState<number | null>(null); // New state for viewing specific request
    const tabs = ['Issue Categories', 'Issues', 'Action Logs', 'Inputs', 'Support Requests'];

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        setPrefillCategoryId(null);
        setViewRequestId(null);
        route(`/admin/requests?activeTab=${index}`);
    };

    const handleAddIssue = (categoryId: number) => {
        setPrefillCategoryId(categoryId);
        setActiveTab(1);  // Switch to the Issues tab
        route(`/admin/requests?activeTab=1&categoryId=${categoryId}`);
    };

    const handleAddInput = (categoryId: number) => {
        setPrefillCategoryId(categoryId);
        setActiveTab(3);  // Switch to the Inputs tab
        route(`/admin/requests?activeTab=3&categoryId=${categoryId}`);
    };

    const handleViewRequest = (requestId: number) => {
        setViewRequestId(requestId);
        setActiveTab(4);  // Switch to the Support Requests tab
        route(`/admin/requests?activeTab=4&requestId=${requestId}`);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tabParam = searchParams.get('activeTab');
        const categoryParam = searchParams.get('categoryId');
        const requestParam = searchParams.get('requestId');
        const tab = tabParam !== null ? parseInt(tabParam, 10) : NaN;
        const category = categoryParam !== null ? parseInt(categoryParam, 10) : null;
        const request = requestParam !== null ? parseInt(requestParam, 10) : null;

        if (!isNaN(tab) && tab >= 0 && tab < tabs.length) {
            setActiveTab(tab);
        }
        if (category !== null && !isNaN(category)) {
            setPrefillCategoryId(category);
        }
        if (request !== null && !isNaN(request)) {
            setViewRequestId(request);
        }
    }, []);

    return (
        <>
            <Breadcrumb path={`/admin/requests`} />
            <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
                <Tabs tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
                <div className="p-5 border rounded-b">
                    {activeTab === 0 && <IssueCategories token={token || ''} onAddIssue={handleAddIssue} onAddInput={handleAddInput} />}
                    {activeTab === 1 && <Issues token={token || ''} prefillCategoryId={prefillCategoryId} />}
                    {activeTab === 2 && <ActionLogs token={token || ''} />}
                    {activeTab === 3 && <Inputs token={token || ''} prefillCategoryId={prefillCategoryId} />}
                    {activeTab === 4 && (
                        viewRequestId ? (
                            <SupportRequestDetails supportRequestSlug={viewRequestId.toString()} />
                        ) : (
                            <SupportRequests token={token || ''} onViewRequest={handleViewRequest} />
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminSupportForm;
