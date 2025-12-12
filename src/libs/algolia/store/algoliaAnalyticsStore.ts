import { createStore } from 'libs/store/createStore'

type AlgoliaAnalytics = {
  currentQueryID?: string
}

const defaultState: AlgoliaAnalytics = {
  currentQueryID: undefined,
}

const algoliaAnalyticsStore = createStore({
  name: 'algolia-analytics',
  defaultState,
  actions: (set) => ({
    setCurrentQueryID: (currentQueryID?: string) => set({ currentQueryID }),
    resetCurrentQueryID: () => set(defaultState),
  }),
  selectors: {
    selectCurrentQueryID: () => (state) => state.currentQueryID,
  },
  options: { persist: true },
})

export const algoliaAnalyticsActions = algoliaAnalyticsStore.actions
export const algoliaAnalyticsSelectors = algoliaAnalyticsStore.selectors
