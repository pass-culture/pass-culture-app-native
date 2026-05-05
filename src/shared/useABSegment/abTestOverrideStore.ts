import { createStore } from 'libs/store/createStore'
type ABTestOverridesState = {
  overrides: Record<string, string>
}
const defaultState: ABTestOverridesState = {
  overrides: {},
}
const abTestOverridesStore = createStore({
  name: 'ab-test-overrides',
  defaultState,
  actions: (set) => ({
    setOverride: (testId: string, segment: string | null) =>
      set((state: ABTestOverridesState) => {
        const next = { ...state.overrides }
        if (segment === null) {
          delete next[testId]
        } else {
          next[testId] = segment
        }
        return { overrides: next }
      }),
    resetAll: () => set(defaultState),
  }),
  selectors: {
    selectOverride: (testId: string) => (state: ABTestOverridesState) => state.overrides[testId],
    selectForcedCount: () => (state: ABTestOverridesState) => Object.keys(state.overrides).length,
    selectOverrides: () => (state: ABTestOverridesState) => state.overrides,
  },
  options: { persist: true },
})
export const abTestOverridesActions = abTestOverridesStore.actions
export const { useOverride, useForcedCount, useOverrides } = abTestOverridesStore.hooks
