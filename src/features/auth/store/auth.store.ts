import { UserProfile } from 'features/share/types'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { eventMonitoring } from 'libs/monitoring/services'
import { createStore } from 'libs/store/createStore'

type AuthStore = {
  isLoggedIn: boolean
  user?: UserProfile
}

const defaultState: AuthStore = {
  isLoggedIn: false,
  user: undefined,
}

export const authStore = createStore({
  name: 'auth',
  defaultState,
  actions: (set) => {
    return {
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
      setUser: (user: UserProfile) => set({ user }),
    }
  },
  selectors: {
    selectState: () => (state) => state,
    selectIsLoggedIn: () => (state) => state.isLoggedIn,
    selectUser: () => (state) => state.user,
  },
})

// Every analytics when store state changes
authStore.store.subscribe(authStore.selectors.selectUser, (user) => {
  if (user) {
    void firebaseAnalytics.setUserId(user.id)
    eventMonitoring.setUser({ id: user.id.toString() })
  }
})

export const authActions = authStore.actions
export const authSelectors = authStore.selectors
export const { useStore: useAuthStore, useIsLoggedIn } = authStore.hooks
