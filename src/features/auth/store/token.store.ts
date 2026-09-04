import { getTokenExpirationDate } from 'libs/jwt/getTokenExpirationDate'
import { eventMonitoring } from 'libs/monitoring/services'
import { createStore } from 'libs/store/createStore'

type TokenStore = {
  access: string | null
  refresh: string | null
}

const defaultState: TokenStore = {
  access: null,
  refresh: null,
}

export const tokenStore = createStore({
  name: 'token',
  defaultState,
  actions: (set) => {
    return {
      setAccess: (access: string) => set({ access }),
      setRefresh: (refresh: string) => set({ refresh }),
      setTokens: (access: string) => set({ access }),
    }
  },
  selectors: {
    selectState: () => (state) => state,
    selectAccess: () => (state) => state.access,
    selectRefresh: () => (state) => state.refresh,
  },
  options: { persist: true, storageType: 'SECURE' },
})

// Every analytics when store state changes
tokenStore.store.subscribe(
  tokenStore.selectors.selectAccess,
  (access) =>
    access &&
    eventMonitoring.setExtras({
      refreshTokenExpirationDate: getTokenExpirationDate(access),
    })
)
tokenStore.store.subscribe(
  tokenStore.selectors.selectRefresh,
  (refresh) =>
    refresh &&
    eventMonitoring.setExtras({
      accessTokenExpirationDate: getTokenExpirationDate(refresh),
    })
)

export const tokenActions = tokenStore.actions
export const tokenSelectors = tokenStore.selectors
export const { useStore: useTokenStore, useAccess, useRefresh } = tokenStore.hooks
