import { SuggestedCity } from 'libs/place/types'
import { createStore } from 'libs/store/createStore'

type State = { city: SuggestedCity | null }

type Actions = {
  setCity: (payload: SuggestedCity) => void
  resetCity: () => void
}

const useCityStore = createStore<State, Actions>(
  'profile-city',
  { city: null },
  (set) => ({
    setCity: (payload) => set({ city: payload }),
    resetCity: () => set({ city: null }),
  }),
  { persist: true }
)

export const useCity = () => useCityStore((state) => state.city)
export const useCityActions = () => useCityStore((state) => state.actions)
