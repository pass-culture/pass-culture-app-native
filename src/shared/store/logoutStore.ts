import { createStore } from 'libs/store/createStore'

type State = {
  isLoggingOut: boolean
}

const defaultState: State = { isLoggingOut: false }

// Tracks intentional logouts outside of React. When the user logs out, the tokens are
// cleared on purpose: authenticated calls still in flight then fail to refresh their
// access token, and the API layer must not interpret this as a broken session by
// forcing a navigation to the login page.
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
