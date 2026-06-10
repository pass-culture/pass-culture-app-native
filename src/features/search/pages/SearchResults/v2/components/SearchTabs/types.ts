import { SearchFilter } from 'features/search/queries/useSearchOffersQuery/types'
import { FetchSearchResultsArgs } from 'features/search/types'

export type SearchTabProps = {
  isSelected: boolean
  onTabPress: (tab: SearchFilter) => void
  searchFilters: FetchSearchResultsArgs
}
