import { LocationType } from 'libs/analytics/types'
import { firebaseAnalytics } from 'libs/firebase/analytics/analytics'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
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
      setPermissionState: (permissionState: GeolocPermissionState | null) => {
        if (isRejected(permissionState)) {
          setConfiguration(LocationMode.AROUND_ME, { geolocation: null })
          set({ geolocationError: null, locationMode: LocationMode.EVERYWHERE })
        }
        set({ permissionState })
      },
      showPermissionModal: () => set({ isPermissionModalVisible: true }),
      hidePermissionModal: () => set({ isPermissionModalVisible: false }),
    }
  },
  selectors: {
    selectState: () => (state) => state,
    selectLocationMode: () => (state) => state.locationMode,
    selectPermissionState: () => (state) => state.permissionState,
    selectLocationConfiguration: (configurationKey: LocationMode) => (state) =>
      state.configuration[configurationKey],
    selectPlace: () => (state) => {
      const place = state.configuration[LocationMode.AROUND_PLACE]
      return place.label ? place : null
    },
    selectUserLocation:
      () =>
      ({ configuration, locationMode }) =>
        configuration[locationMode].geolocation,
    selectIsGeolocated: () => (state) => !!state.configuration[LocationMode.AROUND_ME].geolocation,
    selectLocationType: () => (state) => {
      const LocationModeToLocationTypeMap = {
        [LocationMode.AROUND_PLACE]: 'UserSpecificLocation',
        [LocationMode.AROUND_ME]: 'UserGeolocation',
        [LocationMode.EVERYWHERE]: 'undefined',
      } as const satisfies Record<LocationMode, LocationType>

      return LocationModeToLocationTypeMap[state.locationMode]
    },
  },
  options: { persist: true, persistKeys: ['locationMode', 'configuration'] },
})

locationStore.store.subscribe(locationStore.selectors.selectLocationType, (locationType) =>
  firebaseAnalytics.setDefaultEventParameters({ locationType })
)

const isRejected = (permission: GeolocPermissionState | null) => {
  return (
    !permission ||
    permission === GeolocPermissionState.DENIED ||
    permission === GeolocPermissionState.NEVER_ASK_AGAIN
  )
}

export const locationActions = locationStore.actions
export const locationSelectors = locationStore.selectors
export const {
  useStore: useLocationV2,
  useLocationConfiguration,
  useUserLocation,
  useIsGeolocated,
  usePlace,
} = locationStore.hooks
