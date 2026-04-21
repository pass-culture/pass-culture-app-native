import { createStore } from 'libs/store/createStore'

type Location = {
  lat?: string
}

const defaultState: Location = {
  lat: undefined,
}

const locationStore = createStore({
  name: 'location',
  defaultState,
  actions: (set) => ({
    setLat: (lat?) => set({ lat }),
    resetLat: () => set(defaultState),
  }),
  options: { persist: true },
})

export const locationActions = locationStore.actions
export const locationSelectors = locationStore.selectors
