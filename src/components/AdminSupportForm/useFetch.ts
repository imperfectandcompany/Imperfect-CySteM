// useFetch.ts
import { useState, useEffect } from 'preact/hooks';

interface FetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export const useFetch = <T,>(url: string, token: string): FetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(response => response.json())
            .then(data => {
                setData(data.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to fetch data');
                setLoading(false);
            });
    }, [url, token]);

    return { data, loading, error };
};
