// import { Route } from ''
import { usePage } from './usePage'
import {Route} from "../../../routes/$lang/pages/$slug";


export function useDynamicPage() {
    const { slug } = Route.useParams()

    const {
        data: page,
        isLoading,
        error,
    } = usePage(slug)

    return {
        slug,
        page,
        isLoading,
        error,
    }
}