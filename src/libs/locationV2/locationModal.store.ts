import { LocationMode } from 'libs/location/types'
import { LocationState, locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { createStore } from 'libs/store/createStore'

type LocationModalState = {
  visible: boolean
  addressInputValue: string
} & LocationState

const defaultState: LocationModalState = {
  visible: false,
  addressInputValue: '',
  locationMode: LocationMode.EVERYWHERE,
  configuration: {
    [LocationMode.AROUND_ME]: { radius: 50, coords: { lat: 0, lng: 0 } },
    [LocationMode.AROUND_PLACE]: { radius: 50, address: '' },
    [LocationMode.EVERYWHERE]: {},
  },
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
        locationActions.setState({
          locationMode,
          configuration,
        })
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
