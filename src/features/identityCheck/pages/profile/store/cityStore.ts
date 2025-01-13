import { SuggestedCity } from 'libs/place/types'
import { createActions } from 'libs/store/createActions'
import { createConfiguredStore } from 'libs/store/createConfiguredStore'

type State = { city: SuggestedCity | null }

const defaultState: State = { city: null }

const useCityStore = createConfiguredStore({
  name: 'profile-city',
  defaultState,
  options: {
    persist: true,
  },
})

export const useCity = () => useCityStore((state) => state.city)

export const cityActions = createActions(useCityStore, (set) => ({
  setCity: (city: SuggestedCity) => set({ city }),
  resetCity: () => set(defaultState),
}))
