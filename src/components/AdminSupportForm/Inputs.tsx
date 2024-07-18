import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

interface Input {
    id: string;
    category_id: string;
    type: string;
    label: string;
    created_at: string;
    updated_at: string;
}

interface InputVersion {
    id: string;
    input_id: string;
    version: string;
    label: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    token: string;
}

const Inputs = ({ token }: Props) => {
    const [inputs, setInputs] = useState<Input[]>([]);
    const [inputVersions, setInputVersions] = useState<InputVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInputs = fetch('https://api.imperfectgamers.org/support/requests/inputs', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        }).then(response => response.json());

        const fetchInputVersions = fetch('https://api.imperfectgamers.org/support/requests/inputs/versions', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        }).then(response => response.json());

        Promise.all([fetchInputs, fetchInputVersions])
            .then(([inputsData, inputVersionsData]) => {
                if (inputsData.status === 'success' && inputVersionsData.status === 'success') {
                    setInputs(inputsData.data);
                    setInputVersions(inputVersionsData.data);
                } else {
                    setError('Failed to fetch inputs or input versions');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch inputs or input versions');
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
            <h1 className="text-3xl font-bold mb-5 text-center">Inputs</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Category ID</th>
                        <th className="py-2 px-4 border-b">Type</th>
                        <th className="py-2 px-4 border-b">Label</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {inputs.map(input => (
                        <tr key={input.id}>
                            <td className="py-2 px-4 border-b">{input.id}</td>
                            <td className="py-2 px-4 border-b">{input.category_id}</td>
                            <td className="py-2 px-4 border-b">{input.type}</td>
                            <td className="py-2 px-4 border-b">{input.label}</td>
                            <td className="py-2 px-4 border-b">{input.created_at}</td>
                            <td className="py-2 px-4 border-b">{input.updated_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h1 className="text-3xl font-bold mb-5 text-center mt-10">Input Versions</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Input ID</th>
                        <th className="py-2 px-4 border-b">Version</th>
                        <th className="py-2 px-4 border-b">Label</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {inputVersions.map(version => (
                        <tr key={version.id}>
                            <td className="py-2 px-4 border-b">{version.id}</td>
                            <td className="py-2 px-4 border-b">{version.input_id}</td>
                            <td className="py-2 px-4 border-b">{version.version}</td>
                            <td className="py-2 px-4 border-b">{version.label}</td>
                            <td className="py-2 px-4 border-b">{version.created_at}</td>
                            <td className="py-2 px-4 border-b">{version.updated_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Inputs;
