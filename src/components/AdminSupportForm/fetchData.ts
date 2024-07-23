export const fetchData = (url: string, token: string) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
        },
    }).then(response => response.json());
};
