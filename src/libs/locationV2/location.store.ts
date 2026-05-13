import { GeoCoordinates, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { createStore } from 'libs/store/createStore'

export type LocationState = {
  locationMode: LocationMode
  configuration: {
    [LocationMode.AROUND_ME]: { radius: number; geolocation: GeoCoordinates }
    [LocationMode.AROUND_PLACE]: { radius: number; place: SuggestedPlace | null }
    [LocationMode.EVERYWHERE]: Record<string, never>
  }
}

const defaultState: LocationState = {
  locationMode: LocationMode.EVERYWHERE,
  configuration: {
    [LocationMode.AROUND_ME]: { radius: 50, geolocation: { latitude: 0, longitude: 0 } },
    [LocationMode.AROUND_PLACE]: { radius: 50, place: null },
    [LocationMode.EVERYWHERE]: {},
  },
}

const locationStore = createStore({
  name: 'location',
  defaultState,
  actions: (set) => ({
    setLocationMode: (locationMode: LocationMode) => set({ locationMode }),
    setConfiguration: <T extends LocationMode>(
      mode: T,
      configuration: LocationState['configuration'][T]
    ) => set((state) => ({ configuration: { ...state.configuration, [mode]: configuration } })),
    setAroundPlacePlace: (place: SuggestedPlace | null) =>
      set((state) => ({
        configuration: {
          ...state.configuration,
          [LocationMode.AROUND_PLACE]: { ...state.configuration[LocationMode.AROUND_PLACE], place },
        },
      })),
    setAroundPlaceRadius: (radius: number) =>
      set((state) => ({
        configuration: {
          ...state.configuration,
          [LocationMode.AROUND_PLACE]: {
            ...state.configuration[LocationMode.AROUND_PLACE],
            radius,
          },
        },
      })),
    setAroundMeRadius: (radius: number) =>
      set((state) => ({
        configuration: {
          ...state.configuration,
          [LocationMode.AROUND_ME]: { ...state.configuration[LocationMode.AROUND_ME], radius },
        },
      })),
  }),
  selectors: {
    selectState: () => (state) => state,
    selectLocationMode: () => (state) => state.locationMode,
    selectUserLocation:
      () =>
      ({ configuration, locationMode }) => {
        if (locationMode === LocationMode.AROUND_PLACE) {
          return configuration[LocationMode.AROUND_PLACE].place?.geolocation
        }
        if (locationMode === LocationMode.AROUND_ME) {
          return configuration[LocationMode.AROUND_ME].geolocation
        }
        return undefined
      },
  },
  options: { persist: true },
})

export const locationActions = locationStore.actions
export const locationSelectors = locationStore.selectors
export const { useStore: useLocationV2 } = locationStore.hooks
