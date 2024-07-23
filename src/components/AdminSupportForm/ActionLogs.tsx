import { useState, useEffect } from 'preact/hooks';

interface Log {
    id: number;
    user_id: number;
    action: string;
    target_id: number;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage] = useState(10); // Number of logs per page
    const [sortConfig, setSortConfig] = useState<{ key: keyof Log, direction: 'asc' | 'desc' } | null>(null);

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

    const sortLogs = (logs: Log[], config: { key: keyof Log, direction: 'asc' | 'desc' }) => {
        return logs.sort((a, b) => {
            if (a[config.key] < b[config.key]) {
                return config.direction === 'asc' ? -1 : 1;
            }
            if (a[config.key] > b[config.key]) {
                return config.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedLogs = sortConfig ? sortLogs([...logs], sortConfig) : logs;

    // Calculate the logs to display on the current page
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);

    // Handle page change
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const requestSort = (key: keyof Log) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Log) => {
        if (!sortConfig || sortConfig.key !== key) {
            return '';
        }
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

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
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('id')}>
                            ID {getSortIndicator('id')}
                        </th>
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('user_id')}>
                            User ID {getSortIndicator('user_id')}
                        </th>
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('action')}>
                            Action {getSortIndicator('action')}
                        </th>
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('target_id')}>
                            Target ID {getSortIndicator('target_id')}
                        </th>
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('target_type')}>
                            Target Type {getSortIndicator('target_type')}
                        </th>
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('created_at')}>
                            Created At {getSortIndicator('created_at')}
                        </th>
                        <th className="py-2 px-4 border-b cursor-pointer" onClick={() => requestSort('target_version')}>
                            Target Version {getSortIndicator('target_version')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.map(log => (
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
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(logs.length / logsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 mx-1 rounded ${
                            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ActionLogs;
