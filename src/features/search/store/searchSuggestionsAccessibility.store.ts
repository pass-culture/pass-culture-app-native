import { SuggestionsAnnouncement } from 'features/search/helpers/useAnnounceSearchSuggestions'
import { createStore } from 'libs/store/createStore'

export type SuggestionsSnapshot = { query: string; itemKeys: string[] }
export type SuggestionsStatus = SuggestionsAnnouncement & { query: string; ready: boolean }

type SearchAccessibilityState = {
  inputFocused: boolean
  status: SuggestionsStatus | null
  optionIds: string[]
  activeOptionId: string | null
}
type State = { instances: Record<string, SearchAccessibilityState> }
const defaultState: State = { instances: {} }
const emptyInstance: SearchAccessibilityState = {
  inputFocused: false,
  status: null,
  optionIds: [],
  activeOptionId: null,
}

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
    registerOption: (id: string, optionId: string) =>
      set(({ instances }) => {
        const instance = instances[id] ?? emptyInstance
        if (instance.optionIds.includes(optionId)) return { instances }
        return {
          instances: {
            ...instances,
            [id]: { ...instance, optionIds: [...instance.optionIds, optionId] },
          },
        }
      }),
    unregisterOption: (id: string, optionId: string) =>
      set(({ instances }) => {
        const instance = instances[id]
        if (!instance) return { instances }
        return {
          instances: {
            ...instances,
            [id]: {
              ...instance,
              optionIds: instance.optionIds.filter((registeredId) => registeredId !== optionId),
              activeOptionId: instance.activeOptionId === optionId ? null : instance.activeOptionId,
            },
          },
        }
      }),
    setActiveOption: (id: string, activeOptionId: string | null) =>
      set(({ instances }) => {
        const instance = instances[id]
        if (!instance || instance.activeOptionId === activeOptionId) return { instances }
        return { instances: { ...instances, [id]: { ...instance, activeOptionId } } }
      }),
    remove: (id: string) =>
      set(({ instances }) => {
        const remaining = { ...instances }
        delete remaining[id]
        return { instances: remaining }
      }),
  }),
  selectors: {
    selectInstance: (id: string) => (state) => state.instances[id] ?? emptyInstance,
    selectHasOptions: (id: string) => (state) => (state.instances[id]?.optionIds.length ?? 0) > 0,
    selectActiveOptionId: (id: string) => (state) => state.instances[id]?.activeOptionId ?? null,
    selectIsActiveOption: (id: string, optionId: string) => (state) =>
      state.instances[id]?.activeOptionId === optionId,
  },
})

export const { useHasOptions, useActiveOptionId, useIsActiveOption } =
  searchSuggestionsAccessibilityStore.hooks
