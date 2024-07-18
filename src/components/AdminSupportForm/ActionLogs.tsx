import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface Log {
    id: string;
    user_id: string;
    action: string;
    target_id: string;
    target_type: string;
    created_at: string;
    target_version: string;
}

interface Props {
    token: string;
}

const ActionLogs = ({ token }: Props) => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://api.imperfectgamers.org/support/requests/logs', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setLogs(data.data);
                } else {
                    setError('Failed to fetch logs');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch logs');
                setLoading(false);
            });
    }, [token]);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">User ID</th>
                        <th className="py-2 px-4 border-b">Action</th>
                        <th className="py-2 px-4 border-b">Target ID</th>
                        <th className="py-2 px-4 border-b">Target Type</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Target Version</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td className="py-2 px-4 border-b">{log.id}</td>
                            <td className="py-2 px-4 border-b">{log.user_id}</td>
                            <td className="py-2 px-4 border-b">{log.action}</td>
                            <td className="py-2 px-4 border-b">{log.target_id}</td>
                            <td className="py-2 px-4 border-b">{log.target_type}</td>
                            <td className="py-2 px-4 border-b">{log.created_at}</td>
                            <td className="py-2 px-4 border-b">{log.target_version}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActionLogs;
