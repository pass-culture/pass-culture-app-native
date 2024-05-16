import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { SuggestedCity } from 'libs/place/types'

type State = { city: SuggestedCity | null }

type Actions = {
  setCity: (payload: SuggestedCity) => void
  resetCity: () => void
}

type Store = State & { actions: Actions }

const useCityStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        city: null,
        actions: {
          setCity: (payload) => set({ city: payload }),
          resetCity: () => set({ city: null }),
        },
      }),
      {
        name: 'profile-city',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ city: state.city }),
      }
    ),
    { enabled: process.env.NODE_ENV === 'development', name: 'profile-city' }
  )
)

export const useCity = () => useCityStore((state) => state.city)
export const useCityActions = () => useCityStore((state) => state.actions)
