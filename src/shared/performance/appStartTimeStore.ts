/* eslint-disable no-restricted-imports */
import { create } from 'zustand'

interface AppStartTimeState {
  appStartTime: number
  setAppStartTime: (time: number) => void
}

export const useAppStartTimeStore = create<AppStartTimeState>((set) => ({
  appStartTime: Date.now(),
  setAppStartTime: (time) => set({ appStartTime: time }),
}))
