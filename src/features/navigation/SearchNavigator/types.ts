import { GenericRoute } from 'features/navigation/RootNavigator/types'
import { SearchState } from 'features/search/types'

export type SearchStackParamList = {
  Search: Partial<SearchState>
}

export type SearchScreenNames = keyof SearchStackParamList

export type SearchRoute = GenericRoute<SearchStackParamList>
