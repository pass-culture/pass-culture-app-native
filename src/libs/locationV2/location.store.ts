import { GeolocPermissionState } from 'libs/location/location'
import { GeoCoordinates, GeolocationError, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { createStore } from 'libs/store/createStore'

export type LocationState = {
  permissionState: GeolocPermissionState | null
  geolocationError: GeolocationError | null
  isPermissionModalVisible: boolean
  locationMode: LocationMode
  configuration: {
    [LocationMode.AROUND_ME]: {
      label: 'Ma position'
      info: ''
      type: 'locality'
      geolocation: GeoCoordinates | null
      radius: number
    }
    [LocationMode.AROUND_PLACE]: {
      label: string
      info: string
      type: 'locality' | 'municipality' | 'housenumber' | 'street'
      geolocation: GeoCoordinates | null
      radius: number
    }
    [LocationMode.EVERYWHERE]: {
      label: 'France entière'
      info: ''
      type: 'locality'
      geolocation: GeoCoordinates | null
      radius: 1000
    }
  }
}

export const defaultLocationState: LocationState = {
  locationMode: LocationMode.EVERYWHERE,
  permissionState: null,
  geolocationError: null,
  isPermissionModalVisible: false,
  configuration: {
    [LocationMode.AROUND_ME]: {
      label: 'Ma position',
      info: '',
      type: 'locality',
      geolocation: null,
      radius: 50,
    },
    [LocationMode.AROUND_PLACE]: {
      label: '',
      info: '',
      type: 'locality',
      geolocation: null,
      radius: 50,
    },
    [LocationMode.EVERYWHERE]: {
      label: 'France entière',
      info: '',
      type: 'locality',
      geolocation: null,
      radius: 1000,
    },
  },
}

const locationStore = createStore({
  name: 'location',
  defaultState: defaultLocationState,
  actions: (set) => {
    const setConfiguration = (
      mode: LocationMode,
      configuration: Partial<LocationState['configuration'][LocationMode]>
    ) =>
      set((state) => ({
        configuration: {
          ...state.configuration,
          [mode]: { ...state.configuration[mode], ...configuration },
        },
      }))

    return {
      setLocationMode: (locationMode: LocationMode) => set({ locationMode }),
      setConfiguration,
      setPlace: (place: SuggestedPlace | null) =>
        setConfiguration(
          LocationMode.AROUND_PLACE,
          place || defaultLocationState.configuration[LocationMode.AROUND_PLACE]
        ),
      setAroundPlaceRadius: (radius: number) =>
        setConfiguration(LocationMode.AROUND_PLACE, { radius }),
      setAroundMeRadius: (radius: number) => setConfiguration(LocationMode.AROUND_ME, { radius }),
      setGeolocPosition: (geolocation: GeoCoordinates | null) =>
        setConfiguration(LocationMode.AROUND_ME, { geolocation }),
      setGeolocationError: (error: GeolocationError | null) => set({ geolocationError: error }),
      setPermissionState: (permissionState: GeolocPermissionState | null) =>
        set({ permissionState }),
      showPermissionModal: () => set({ isPermissionModalVisible: true }),
      hidePermissionModal: () => set({ isPermissionModalVisible: false }),
    }
  },
  selectors: {
    selectState: () => (state) => state,
    selectLocationMode: () => (state) => state.locationMode,
    selectLocationConfiguration: (configurationKey: LocationMode) => (state) =>
      state.configuration[configurationKey],
    selectPlace: () => (state) => {
      const { radius: _, ...place } = state.configuration[LocationMode.AROUND_PLACE]
      return place.label ? place : null
    },
    selectUserLocation:
      () =>
      ({ configuration, locationMode }) =>
        configuration[locationMode].geolocation,
    selectIsGeolocated: () => (state) => !!state.configuration[LocationMode.AROUND_ME].geolocation,
  },
  options: { persist: false },
})

export const locationActions = locationStore.actions
export const locationSelectors = locationStore.selectors
export const {
  useStore: useLocationV2,
  useLocationConfiguration,
  useUserLocation,
  useIsGeolocated,
  usePlace,
} = locationStore.hooks
