import { InseeCountry } from 'api/gen'
import { SuggestedCity } from 'libs/place/types'
import { createStore } from 'libs/store/createStore'

type State = {
  birthCity: SuggestedCity | null
  birthCountry: InseeCountry | null
}

const defaultState: State = {
  birthCity: null,
  birthCountry: null,
}

const disabilityBonificationStore = createStore({
  name: 'disability-bonification',
  defaultState,
  actions: (set) => ({
    setBirthCity: (birthCity: SuggestedCity | null) => set({ birthCity }),
    setBirthCountry: (birthCountry: InseeCountry) => set({ birthCountry }),
    resetDisabilityBonification: () => set(defaultState),
  }),
  selectors: {
    selectDisabilityBonification: () => (state) => state,
  },
  options: { persist: true },
})

export const disabilityBonificationActions = disabilityBonificationStore.actions
export const { useDisabilityBonification } = disabilityBonificationStore.hooks
