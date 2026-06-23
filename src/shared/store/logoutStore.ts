import { createStore } from 'libs/store/createStore'

type State = {
  isLoggingOut: boolean
}

const defaultState: State = { isLoggingOut: false }

// Tracks an intentional logout so the API layer doesn't redirect to login on the 401s
// triggered by clearing the tokens on purpose.
const logoutStore = createStore({
  name: 'logout',
  defaultState,
  actions: (set: (state: State) => void) => ({
    setIsLoggingOut: (isLoggingOut: boolean) => set({ isLoggingOut }),
  }),
  selectors: {
    selectIsLoggingOut: () => (state: State) => state.isLoggingOut,
  },
})

export const logoutStoreActions = logoutStore.actions
export const logoutStoreSelectors = logoutStore.selectors
