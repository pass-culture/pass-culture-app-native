import { SuggestionsAnnouncement } from 'features/search/helpers/useAnnounceSearchSuggestions'
import { createStore } from 'libs/store/createStore'

export type SuggestionsSnapshot = { query: string; itemKeys: string[] }
export type SuggestionsStatus = SuggestionsAnnouncement & { query: string; ready: boolean }

type SearchAccessibilityState = { inputFocused: boolean; status: SuggestionsStatus | null }
type State = { instances: Record<string, SearchAccessibilityState> }
const defaultState: State = { instances: {} }
const emptyInstance: SearchAccessibilityState = { inputFocused: false, status: null }

export const searchSuggestionsAccessibilityStore = createStore({
  name: 'search-suggestions-accessibility',
  defaultState,
  actions: (set) => ({
    setInputFocused: (id: string, inputFocused: boolean) =>
      set(({ instances }) => ({
        instances: { ...instances, [id]: { ...(instances[id] ?? emptyInstance), inputFocused } },
      })),
    publish: (id: string, status: SuggestionsStatus | null) =>
      set(({ instances }) => ({
        instances: { ...instances, [id]: { ...(instances[id] ?? emptyInstance), status } },
      })),
    remove: (id: string) =>
      set(({ instances }) => {
        const remaining = { ...instances }
        delete remaining[id]
        return { instances: remaining }
      }),
  }),
  selectors: {
    selectInstance: (id: string) => (state) => state.instances[id] ?? emptyInstance,
  },
})
