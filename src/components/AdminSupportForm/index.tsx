import { useState } from 'preact/hooks';
import Tabs from './Tabs';
import IssueCategories from './IssueCategories';
import ActionLogs from './ActionLogs';
import Inputs from './Inputs';
import SupportRequests from './SupportRequests';
import Breadcrumb from '../Breadcrumb';
import { getToken } from '../../utils';

const AdminSupportForm = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = ['Issue Categories', 'Action Logs', 'Inputs', 'Support Requests'];
    const token = getToken();

    return (
<>
<Breadcrumb path={`/admin/requests`} />
        <div className="container mx-auto ">
            <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
            <div className="p-5 border rounded-b">
                {activeTab === 0 && <IssueCategories token={token || ''} />}
                {activeTab === 1 && <ActionLogs token={token || ''} />}
                {activeTab === 2 && <Inputs token={token || ''} />}
                {activeTab === 3 && <SupportRequests token={token || ''} />}
            </div>
        </div>
</>
    );
};

export default AdminSupportForm;
