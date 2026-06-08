import { useQuery } from '@tanstack/react-query';
import type {ServicePage} from "../../../types";

export function useFeaturedServices() {
    return useQuery<ServicePage[]>({
        queryKey: ['pages', 'featured'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pages`);
            if (!response.ok) throw new Error('Failed to fetch services');

            const data: ServicePage[] = await response.json();
            return data.filter((page: any) => Number(page.is_featured) === 1);
        },
    });
}