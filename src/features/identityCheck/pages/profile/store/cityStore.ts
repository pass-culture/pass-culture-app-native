import { SuggestedCity } from 'libs/place/types'
import { createStore } from 'libs/store/createStore'

type State = { city: SuggestedCity | null }

const defaultState: State = { city: null }

const setActions = (set: (payload: State) => void) => ({
  setCity: (payload: SuggestedCity) => set({ city: payload }),
  resetCity: () => set(defaultState),
})

const useCityStore = createStore<State, ReturnType<typeof setActions>>(
  'profile-city',
  defaultState,
  setActions,
  {
    persist: true,
  }
)

export const useCity = () => useCityStore((state) => state.city)
export const useCityActions = () => useCityStore((state) => state.actions)
