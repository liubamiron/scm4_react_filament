// src/api/client.ts
const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'API Error');
    }

    return response.json();
};