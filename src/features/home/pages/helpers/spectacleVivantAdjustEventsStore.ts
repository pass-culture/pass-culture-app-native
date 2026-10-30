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

// not persisted: a session ends when the app is killed or, like an Adjust session, after 30 minutes in background
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
    // the first session after install is over too
    startNewSession: () => set(defaultState),
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
