import { LocationMode } from 'libs/location/types'
import {
  LocationState,
  defaultLocationState,
  locationActions,
  locationSelectors,
} from 'libs/locationV2/location.store'
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
  actions: (set) => ({
    show: () => {
      const locationState = locationSelectors.selectState()
      set({ ...locationState, visible: true })
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
  }),
})

export const locationModalActions = locationModalStore.actions
export const locationModalSelectors = locationModalStore.selectors
