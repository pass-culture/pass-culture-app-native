import { SuggestedCity } from 'libs/place/types'
import { createStore } from 'libs/store/createStore'

type State = { city: SuggestedCity | null }

const defaultState: State = { city: null }

const cityStore = createStore({
  name: 'profile-city',
  defaultState,
  actions: (set) => ({
    setCity: (city: SuggestedCity) => set({ city }),
    resetCity: () => set(defaultState),
  }),
  options: {
    persist: true,
  },
})

const useCityStore = cityStore.useStore
export const cityActions = cityStore.actions

export const useCity = () => useCityStore((state) => state.city)
