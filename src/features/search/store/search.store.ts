import { navigationRef } from 'features/navigation/navigationRef'
import { SearchStackRouteName } from 'features/navigation/navigators/SearchStackNavigator/types'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import { createStore } from 'libs/store/createStore'

type State = {
  // duplicate of the search state in the context to use it outside of the context
  // TODO(PC-42708): remove this comment
  params: SearchState
}

const defaultState: State = { params: initialSearchState }

export const searchStore = createStore({
  name: 'search',
  defaultState,
  actions: (set) => ({
    setParams: (params: SearchState) => set({ params }),
    reset: () => set({ params: initialSearchState }),
  }),
  selectors: {
    selectParams: () => (state) => state.params,
  },
})

searchStore.store.subscribe(searchStore.selectors.selectParams, (params) => {
  if (!navigationRef.isReady()) return

  const currentScreenName = navigationRef.getCurrentRoute()?.name as
    | SearchStackRouteName
    | undefined
  if (currentScreenName === 'SearchResults') {
    navigationRef.setParams(params)
  }
})
