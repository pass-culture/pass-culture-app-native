import { SearchStackParamList } from 'features/navigation/navigators/SearchStackNavigator/types'
import { Action, initialSearchState } from 'features/search/context/reducer'

export const syncSearchStateFromRouteParams = (
  params: SearchStackParamList['SearchResults'],
  dispatch: (action: Action) => void
) => {
  if (!params) return

  const { accessibilityFilter: _accessibilityFilter, ...searchParams } = params
  dispatch({
    type: 'SET_STATE',
    payload: { ...initialSearchState, ...searchParams },
  })
}
