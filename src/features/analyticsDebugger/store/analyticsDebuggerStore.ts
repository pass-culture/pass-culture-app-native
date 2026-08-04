import { v4 as uuidv4 } from 'uuid'

import { env } from 'libs/environment/env'
import { createStore } from 'libs/store/createStore'

export type DebuggedAnalyticsEvent = {
  id: string
  timestamp: number
  name: string
  params?: Record<string, unknown>
}

type State = {
  captureEnabled: boolean
  bubbleVisible: boolean
  overlayVisible: boolean
  events: DebuggedAnalyticsEvent[]
}

export const MAX_DEBUGGED_EVENTS = 100

const defaultState: State = {
  captureEnabled: false,
  bubbleVisible: false,
  overlayVisible: false,
  events: [],
}

const analyticsDebuggerStore = createStore({
  name: 'analytics-debugger',
  defaultState,
  actions: (set) => ({
    setCaptureEnabled: (captureEnabled: boolean) => set({ captureEnabled }),
    setBubbleVisible: (bubbleVisible: boolean) => set({ bubbleVisible }),
    toggleBubble: () => set((state) => ({ bubbleVisible: !state.bubbleVisible })),
    showOverlay: () => set({ overlayVisible: true }),
    hideOverlay: () => set({ overlayVisible: false }),
    toggleOverlay: () => set((state) => ({ overlayVisible: !state.overlayVisible })),
    clearEvents: () => set({ events: [] }),
    captureEvent: (name: string, params?: Record<string, unknown>) => {
      if (!env.ANALYTICS_DEBUGGER_ENABLED) return
      set((state) => {
        if (!state.captureEnabled) return state
        const event: DebuggedAnalyticsEvent = { id: uuidv4(), timestamp: Date.now(), name, params }
        return { events: [event, ...state.events].slice(0, MAX_DEBUGGED_EVENTS) }
      })
    },
  }),
  selectors: {
    selectCaptureEnabled: () => (state: State) => state.captureEnabled,
    selectBubbleVisible: () => (state: State) => state.bubbleVisible,
    selectOverlayVisible: () => (state: State) => state.overlayVisible,
    selectEvents: () => (state: State) => state.events,
  },
  options: { persist: true, persistKeys: ['captureEnabled', 'bubbleVisible'] },
})

export const analyticsDebuggerActions = analyticsDebuggerStore.actions
export const analyticsDebuggerSelectors = analyticsDebuggerStore.selectors
export const {
  useCaptureEnabled: useAnalyticsDebuggerCaptureEnabled,
  useBubbleVisible: useAnalyticsDebuggerBubbleVisible,
  useOverlayVisible: useAnalyticsDebuggerOverlayVisible,
  useEvents: useAnalyticsDebuggerEvents,
} = analyticsDebuggerStore.hooks
