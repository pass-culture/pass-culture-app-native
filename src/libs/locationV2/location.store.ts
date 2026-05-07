import { LocationMode, Position } from 'libs/location/types'
import { createStore } from 'libs/store/createStore'

type Location = {
  locationMode: LocationMode
  geolocPosition: Position
  aroundMeRadius: number
  aroundPlaceAddress: string
  aroundPlaceRadius: number
}

const defaultState: Location = {
  locationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
  aroundMeRadius: 50,
  aroundPlaceAddress: '',
  aroundPlaceRadius: 50,
}

const locationStore = createStore({
  name: 'location',
  defaultState,
  actions: (set) => ({
    setState: (state: Partial<Location>) => set(state),
    resetState: () => set(defaultState),
  }),
  selectors: {
    selectState: () => (state) => state,
  },
  options: { persist: true },
})

export const locationActions = locationStore.actions
export const locationSelectors = locationStore.selectors
