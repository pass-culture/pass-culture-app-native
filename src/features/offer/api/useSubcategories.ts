import {useQuery} from 'react-query'
import {api} from 'api/api'
import {SubcategoriesResponseModel} from 'api/gen'
import {QueryKeys} from 'libs/queryKeys'

const STALE_TIME_SUBCATEGORIES = 5 * 60 * 1000

export function useSubcategories() {
    return useQuery<SubcategoriesResponseModel>(QueryKeys.SUBCATEGORIES, () => api.getnativev1subcategories(), {
        staleTime: STALE_TIME_SUBCATEGORIES
    })
}
