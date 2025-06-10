import { createStore } from 'libs/store/createStore'

type PerformanceMonitoringStore = {
  initialScreenName: string | undefined
  wasPerformanceMarkedThisSession: boolean
}

const defaultState: PerformanceMonitoringStore = {
  initialScreenName: undefined,
  wasPerformanceMarkedThisSession: false,
}

const performanceMonitoringStore = createStore({
  name: 'initialScreenName',
  defaultState,
  options: { persist: false },
  actions: (set) => ({
    setInitialScreenName: (initialScreenName: string) => set({ initialScreenName }),
    setWasPerformanceMarkedThisSession: (wasPerformanceMarkedThisSession: boolean) =>
      set({ wasPerformanceMarkedThisSession }),
  }),
  selectors: {
    selectInitialScreenName: () => (state) => state.initialScreenName,
    selectWasPerformanceMarkedThisSession: () => (state) => state.wasPerformanceMarkedThisSession,
  },
})

export const performanceMonitoringStoreActions = performanceMonitoringStore.actions
export const { useInitialScreenName, useWasPerformanceMarkedThisSession } =
  performanceMonitoringStore.hooks
