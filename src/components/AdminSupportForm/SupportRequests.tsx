import { ComponentChild, FunctionalComponent, VNode } from "preact";
import { useState, useEffect } from "preact/hooks";

interface SupportRequestListProps {
    token: string;
    onViewRequest: (requestId: number) => void;
}

interface SupportRequest {
    request_id: number;
    email: string;
    status: string;
    created_at: string;
}

const SupportRequestList: FunctionalComponent<SupportRequestListProps> = ({ token, onViewRequest }) => {
    const [requests, setRequests] = useState<SupportRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSupportRequests();
    }, []);

    const fetchSupportRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api.imperfectgamers.org/support/requests', {
                headers: {
                    Authorization: token,
                },
            });
            const data = await response.json();
            if (data.status === 'success') {
                setRequests(data.data);
            } else {
                setError('Failed to fetch support requests: ' + data.message);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching support requests:', error);
            setError('Error fetching support requests');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Support Requests</h1>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <ul className="space-y-4">
                {requests.map((request: { request_id: number; email: string | number | bigint | boolean | object | ComponentChild[] | VNode<any> | null | undefined; status: string | number | bigint | boolean | object | ComponentChild[] | VNode<any> | null | undefined; created_at: string | number | Date; }) => (
                    <li
                        key={request.request_id}
                        className="bg-white p-4 rounded shadow-md hover:shadow-lg transition cursor-pointer"
                        onClick={() => onViewRequest(request.request_id)}
                    >
                        <p className="text-gray-700 font-semibold">{request.email}</p>
                        <p className="text-gray-500">{request.status}</p>
                        <p className="text-gray-400">{new Date(request.created_at).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SupportRequestList;
