import { SuggestedCity } from 'libs/place/types'
import { createActions } from 'libs/store/createActions'
import { createStore } from 'libs/store/createStore'

type State = { city: SuggestedCity | null }

const defaultState: State = { city: null }

const useCityStore = createStore('profile-city', defaultState, {
  persist: true,
})

export const useCity = () => useCityStore((state) => state.city)

export const cityActions = createActions(useCityStore, (set) => ({
  setCity: (payload: SuggestedCity) => set({ city: payload }),
  resetCity: () => set(defaultState),
}))
