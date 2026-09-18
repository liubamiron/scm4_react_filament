import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client.ts';
import type { ServicePage } from '../../../types';

export type MenuPage = Pick<
    ServicePage,
    'id' | 'type' | 'slug' | 'title_ro' | 'title_ru' | 'show_in_header' | 'show_in_footer'
>;

// Every CMS page as a menu entry (type, slug, titles — no body). The header and
// footer group these by `type` to build the site navigation.
export function useMenuPages() {
    return useQuery({
        queryKey: ['menu'],
        queryFn: () => apiClient<MenuPage[]>('/menu'),
        staleTime: 1000 * 60 * 5,
    });
}
