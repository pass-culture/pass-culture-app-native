import { createStore } from 'libs/store/createStore'

type PerformanceMonitoringStore = {
  initialScreenName: string | undefined
}

const defaultState: PerformanceMonitoringStore = {
  initialScreenName: undefined,
}

const performanceMonitoringStore = createStore({
  name: 'initialScreenName',
  defaultState,
  options: { persist: false },
  actions: (set) => ({
    setInitialScreenName: (initialScreenName: string) => set({ initialScreenName }),
  }),
  selectors: {
    selectInitialScreenName: () => (state) => state.initialScreenName,
  },
})

export const performanceMonitoringStoreActions = performanceMonitoringStore.actions
export const { useInitialScreenName } = performanceMonitoringStore.hooks
