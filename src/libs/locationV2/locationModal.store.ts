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

export const locationModalStore = createStore({
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
      sync: () => {
        const locationState = locationSelectors.selectState()
        const isAroundPlace = locationState.locationMode === LocationMode.AROUND_PLACE

        set({
          ...locationState,
          configuration: {
            ...locationState.configuration,
            [LocationMode.AROUND_PLACE]: isAroundPlace
              ? locationState.configuration[LocationMode.AROUND_PLACE]
              : defaultLocationState.configuration[LocationMode.AROUND_PLACE],
          },
          addressInputValue: isAroundPlace
            ? locationState.configuration[LocationMode.AROUND_PLACE].label
            : '',
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
      setLocationMode: (locationMode: LocationMode) => set({ locationMode }),
      resetPlace: () =>
        set({
          addressInputValue: '',
          configuration: {
            ...defaultLocationState.configuration,
            [LocationMode.AROUND_PLACE]:
              defaultLocationState.configuration[LocationMode.AROUND_PLACE],
          },
        }),
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
    selectConfiguration: (configurationKey: LocationMode) => (state) =>
      state.configuration[configurationKey],
    selectPlace: () => (state) => {
      const place = state.configuration[LocationMode.AROUND_PLACE]
      return place.label ? place : null
    },
    selectIsVisible: () => (state) => state.visible,
    selectAddressInputValue: () => (state) => state.addressInputValue,
    selectIsSubmitDisabled: () => (state) => {
      if (state.locationMode === LocationMode.AROUND_PLACE) {
        return !state.configuration[LocationMode.AROUND_PLACE].label
      }
      return false
    },
  },
})

export const locationModalActions = locationModalStore.actions
export const locationModalSelectors = locationModalStore.selectors
