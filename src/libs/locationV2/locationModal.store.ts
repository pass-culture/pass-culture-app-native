import { LocationMode } from 'libs/location/types'
import {
  LocationState,
  defaultLocationState,
  locationActions,
  locationSelectors,
} from 'libs/locationV2/location.store'
import { SuggestedPlace } from 'libs/place/types'
import { createStore } from 'libs/store/createStore'

type LocationModalState = {
  visible: boolean
  addressInputValue: string
} & LocationState

const defaultState: LocationModalState = {
  visible: false,
  addressInputValue: '',
  ...defaultLocationState,
}

const locationModalStore = createStore({
  name: 'locationModal',
  defaultState,
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
      show: () => {
        const locationState = locationSelectors.selectState()
        set({
          addressInputValue: locationState.configuration[LocationMode.AROUND_PLACE].label,
          ...locationState,
          visible: true,
        })
      },
      hide: () => set({ visible: false }),
      submit: () => {
        set((state) => {
          const { locationMode, configuration } = state
          locationActions.setLocationMode(locationMode)
          locationActions.setConfiguration(locationMode, configuration[locationMode])
          return { visible: false }
        })
      },
      setPlace: (place: SuggestedPlace | null) =>
        setConfiguration(
          LocationMode.AROUND_PLACE,
          place || defaultLocationState.configuration[LocationMode.AROUND_PLACE]
        ),
      setAddressInputValue: (addressInputValue: string) => set({ addressInputValue }),
      setAroundMeRadius: (radius: number) => setConfiguration(LocationMode.AROUND_ME, { radius }),
      setAroundPlaceRadius: (radius: number) =>
        setConfiguration(LocationMode.AROUND_PLACE, { radius }),
      setLocationMode: (locationMode: LocationMode) => set({ locationMode }),
      updateConfig: (
        mode: LocationMode,
        data: Partial<LocationState['configuration'][LocationMode]>
      ) =>
        set((state) => ({
          configuration: {
            ...state.configuration,
            [mode]: { ...state.configuration[mode], ...data },
          },
        })),
    }
  },
  selectors: {
    selectLocationMode: () => (state) => state.locationMode,
    selectLocationModalConfiguration: (configurationKey: LocationMode) => (state) =>
      state.configuration[configurationKey],
    selectPlace: () => (state) => {
      const { radius: _, ...place } = state.configuration[LocationMode.AROUND_PLACE]
      return place.label ? place : null
    },
    selectIsVisible: () => (state) => state.visible,
    selectAddressInputValue: () => (state) => state.addressInputValue,
    selectCanSubmit: () => (state) => {
      if (state.locationMode === LocationMode.AROUND_PLACE) {
        return !!state.configuration[LocationMode.AROUND_PLACE].label
      }
      return true
    },
  },
})

export const locationModalActions = locationModalStore.actions
export const locationModalSelectors = locationModalStore.selectors

export const {
  useStore: useLocationModal,
  useLocationModalConfiguration,
  usePlace: useLocationModalPlace,
  useAddressInputValue: useLocationModalAddressInputValue,
  useCanSubmit: useCanSubmitLocationModal,
} = locationModalStore.hooks
