import { LocationMode } from 'libs/location/types'
import { createStore } from 'libs/store/createStore'

export type LocationState = {
  locationMode: LocationMode
  configuration: {
    [LocationMode.AROUND_ME]: { radius: number; coords: { lat: number; lng: number } }
    [LocationMode.AROUND_PLACE]: { radius: number; address: string }
    [LocationMode.EVERYWHERE]: Record<string, never>
  }
}

const defaultState: LocationState = {
  locationMode: LocationMode.EVERYWHERE,
  configuration: {
    [LocationMode.AROUND_ME]: { radius: 50, coords: { lat: 0, lng: 0 } },
    [LocationMode.AROUND_PLACE]: { radius: 50, address: '' },
    [LocationMode.EVERYWHERE]: {},
  },
}

const locationStore = createStore({
  name: 'location',
  defaultState,
  actions: (set) => ({
    setState: (state: Partial<LocationState>) => set(state),
    resetState: () => set(defaultState),
  }),
  selectors: {
    selectState: () => (state) => state,
  },
  options: { persist: true },
})

export const locationActions = locationStore.actions
export const locationSelectors = locationStore.selectors
export const { useStore: useLocationV2 } = locationStore.hooks
