import { useState, useEffect } from 'preact/hooks';

interface Input {
    id: number;
    category_id: number;
    type: string;
    label: string;
    created_at: string;
    updated_at: string;
}

interface InputVersion {
    id: number;
    input_id: number;
    version: number;
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

    const createInput = async (newInput: Omit<Input, 'id'>) => {
        try {
            const response = await fetch('https://api.imperfectgamers.org/support/requests/inputs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(newInput),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setInputs([...inputs, data.data]);
            } else {
                setError('Failed to create input');
            }
        } catch {
            setError('Failed to create input');
        }
    };

    const updateInput = async (id: number, updatedInput: Omit<Input, 'id'>) => {
        try {
            const response = await fetch(`https://api.imperfectgamers.org/support/requests/inputs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(updatedInput),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setInputs(inputs.map(input => (input.id === id ? data.data : input)));
            } else {
                setError('Failed to update input');
            }
        } catch {
            setError('Failed to update input');
        }
    };

    const deleteInput = async (id: number) => {
        try {
            const response = await fetch(`https://api.imperfectgamers.org/support/requests/inputs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });
            const data = await response.json();
            if (data.status === 'success') {
                setInputs(inputs.filter(input => input.id !== id));
            } else {
                setError('Failed to delete input');
            }
        } catch {
            setError('Failed to delete input');
        }
    };

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
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inputs.map(input => (
                        <tr key={input.id}>
                            <td className="py-2 px-4 border-b">{input.category_id}</td>
                            <td className="py-2 px-4 border-b">{input.type}</td>
                            <td className="py-2 px-4 border-b">{input.label}</td>
                            <td className="py-2 px-4 border-b">{input.created_at}</td>
                            <td className="py-2 px-4 border-b">{input.updated_at}</td>
                            <td className="py-2 px-4 border-b">
                                <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => updateInput(input.id, input)}>Edit</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded ml-2" onClick={() => deleteInput(input.id)}>Delete</button>
                            </td>
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
