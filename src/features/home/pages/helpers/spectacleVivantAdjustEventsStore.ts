import { createStore } from 'libs/store/createStore'

type SpectacleVivantAdjustEventsStore = {
  isFirstSessionAfterInstall: boolean
  wasSpectacleVivantEventSentThisSession: boolean
  wasNewSpectacleVivantEventSentThisSession: boolean
}

const defaultState: SpectacleVivantAdjustEventsStore = {
  isFirstSessionAfterInstall: false,
  wasSpectacleVivantEventSentThisSession: false,
  wasNewSpectacleVivantEventSentThisSession: false,
}

// not persisted: a session lasts as long as the app is not killed
const spectacleVivantAdjustEventsStore = createStore({
  name: 'spectacleVivantAdjustEvents',
  defaultState,
  options: { persist: false },
  actions: (set) => ({
    setIsFirstSessionAfterInstall: (isFirstSessionAfterInstall: boolean) =>
      set({ isFirstSessionAfterInstall }),
    setWasSpectacleVivantEventSentThisSession: (wasSpectacleVivantEventSentThisSession: boolean) =>
      set({ wasSpectacleVivantEventSentThisSession }),
    setWasNewSpectacleVivantEventSentThisSession: (
      wasNewSpectacleVivantEventSentThisSession: boolean
    ) => set({ wasNewSpectacleVivantEventSentThisSession }),
    resetForTests: () => set(defaultState),
  }),
  selectors: {
    selectIsFirstSessionAfterInstall: () => (state) => state.isFirstSessionAfterInstall,
    selectWasSpectacleVivantEventSentThisSession: () => (state) =>
      state.wasSpectacleVivantEventSentThisSession,
    selectWasNewSpectacleVivantEventSentThisSession: () => (state) =>
      state.wasNewSpectacleVivantEventSentThisSession,
  },
})

export const spectacleVivantAdjustEventsStoreActions = spectacleVivantAdjustEventsStore.actions
export const spectacleVivantAdjustEventsStoreSelectors = spectacleVivantAdjustEventsStore.selectors
