/* eslint-disable no-restricted-imports */
import { create } from 'zustand'

interface AppStartTimeState {
  appStartTime: number
  setAppStartTime: (time: number) => void
}

// Fonction utilitaire pour fournir un timestamp
const defaultDateProvider = () => Date.now()

export const createAppStartTimeStore = (dateProvider = defaultDateProvider) =>
  create<AppStartTimeState>((set) => {
    const firstTime = new Date(dateProvider())
    return {
      appStartTime: firstTime.valueOf(),
      setAppStartTime: (time) => set({ appStartTime: time }),
    }
  })

// Utilisation par défaut avec Date.now()
export const useAppStartTimeStore = createAppStartTimeStore()
