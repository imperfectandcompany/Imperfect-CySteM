// SupportRequests.tsx
import { useState } from 'preact/hooks';
import { useFetch } from './useFetch';

interface Input {
    id: string;
    label: string;
    type: string;
    value: string;
    created_at: string;
    updated_at: string;
}

interface RequestDetails {
    id: number;
    category_id: number;
    issue_version_id: number;
    current_version_id: number;
    created_at: string;
    updated_at: string;
    inputs: Input[];
}

interface Request {
    id: number;
    category_id: number;
    issue_version_id: number;
    current_version_id: number;
    created_at: string;
    updated_at: string;
}

interface RequestVersion {
    id: number;
    version: number;
    status: string;
    priority: string;
    email: string;
    ip_address: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    token: string;
}

const SupportRequests = ({ token }: Props) => {
    const { data: requests, loading, error } = useFetch<Request[]>('https://api.imperfectgamers.org/support/requests', token);
    const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
    const [requestVersions, setRequestVersions] = useState<RequestVersion[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    const fetchRequestDetails = (requestId: number) => {
        setLoadingDetails(true);
        fetch(`https://api.imperfectgamers.org/support/requests/${requestId}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setRequestDetails(data.data);
                } else {
                    setErrorDetails('Failed to fetch request details');
                }
                setLoadingDetails(false);
            })
            .catch(() => {
                setErrorDetails('Failed to fetch request details');
                setLoadingDetails(false);
            });
    };

    const fetchRequestVersions = (requestId: number) => {
        setLoadingDetails(true);
        fetch(`https://api.imperfectgamers.org/support/requests/${requestId}/versions`, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setRequestVersions(data.data);
                } else {
                    setErrorDetails('Failed to fetch request versions');
                }
                setLoadingDetails(false);
            })
            .catch(() => {
                setErrorDetails('Failed to fetch request versions');
                setLoadingDetails(false);
            });
    };

    if (loading || loadingDetails) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error || errorDetails) {
        return <div className="text-center mt-10 text-red-500">{error || errorDetails}</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Category ID</th>
                        <th className="py-2 px-4 border-b">Issue Version ID</th>
                        <th className="py-2 px-4 border-b">Current Version ID</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Updated At</th>
                        <th className="py-2 px-4 border-b">Details</th>
                        <th className="py-2 px-4 border-b">Versions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests?.map(request => (
                        <tr key={request.id}>
                            <td className="py-2 px-4 border-b">{request.id}</td>
                            <td className="py-2 px-4 border-b">{request.category_id}</td>
                            <td className="py-2 px-4 border-b">{request.issue_version_id}</td>
                            <td className="py-2 px-4 border-b">{request.current_version_id}</td>
                            <td className="py-2 px-4 border-b">{request.created_at}</td>
                            <td className="py-2 px-4 border-b">{request.updated_at}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                                    onClick={() => fetchRequestDetails(request.id)}
                                >
                                    View Details
                                </button>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => fetchRequestVersions(request.id)}
                                >
                                    View Versions
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {requestDetails && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-5">Request Details</h2>
                    <div className="bg-gray-100 p-5 rounded shadow">
                        <p><strong>ID:</strong> {requestDetails.id}</p>
                        <p><strong>Category ID:</strong> {requestDetails.category_id}</p>
                        <p><strong>Issue Version ID:</strong> {requestDetails.issue_version_id}</p>
                        <p><strong>Current Version ID:</strong> {requestDetails.current_version_id}</p>
                        <p><strong>Created At:</strong> {requestDetails.created_at}</p>
                        <p><strong>Updated At:</strong> {requestDetails.updated_at}</p>
                        <h3 className="text-xl font-semibold mt-5">Inputs</h3>
                        {requestDetails.inputs.length === 0 ? (
                            <p className="text-gray-500">No inputs available.</p>
                        ) : (
                            <ul className="list-disc ml-5">
                                {requestDetails.inputs.map(input => (
                                    <li key={input.id}>
                                        <p><strong>Label:</strong> {input.label}</p>
                                        <p><strong>Type:</strong> {input.type}</p>
                                        <p><strong>Value:</strong> {input.value}</p>
                                        <p><strong>Created At:</strong> {input.created_at}</p>
                                        <p><strong>Updated At:</strong> {input.updated_at}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
            {requestVersions.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-5">Request Versions</h2>
                    <div className="bg-gray-100 p-5 rounded shadow">
                        <ul className="list-disc ml-5">
                            {requestVersions.map(version => (
                                <li key={version.id}>
                                    <p><strong>Version:</strong> {version.version}</p>
                                    <p><strong>Status:</strong> {version.status}</p>
                                    <p><strong>Priority:</strong> {version.priority}</p>
                                    <p><strong>Email:</strong> {version.email}</p>
                                    <p><strong>IP Address:</strong> {version.ip_address}</p>
                                    <p><strong>Created At:</strong> {version.created_at}</p>
                                    <p><strong>Updated At:</strong> {version.updated_at}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportRequests;
