import { createStore } from 'libs/store/createStore'

type State = {
  hasClosedBonificationBanner: boolean
}

const defaultState: State = {
  hasClosedBonificationBanner: false,
}

const hasClosedBonificationBannerStore = createStore({
  name: 'has-closed-bonification-banner',
  defaultState,
  actions: (set) => ({
    setHasClosedBonificationBanner: (hasClosedBonificationBanner: boolean) =>
      set({ hasClosedBonificationBanner }),
  }),
  selectors: {
    selectHasClosedBonificationBanner: () => (state) => state,
  },
  options: { persist: true },
})

export const hasClosedBonificationBannerActions = hasClosedBonificationBannerStore.actions

export const { useHasClosedBonificationBanner } = hasClosedBonificationBannerStore.hooks
