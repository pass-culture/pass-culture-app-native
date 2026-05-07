import { LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { createStore } from 'libs/store/createStore'

type LocationModal = {
  visible: boolean
  locationMode: LocationMode
  aroundMeRadius: number
  aroundPlaceAddress: string
  aroundPlaceRadius: number
}

const defaultState: LocationModal = {
  visible: false,
  locationMode: LocationMode.EVERYWHERE,
  aroundMeRadius: 0,
  aroundPlaceAddress: '',
  aroundPlaceRadius: 0,
}

const locationModalStore = createStore({
  name: 'locationModal',
  defaultState,
  actions: (set) => ({
    show: () => {
      const state = locationSelectors.selectState()
      set({ ...state, visible: true })
    },
    hide: () => set({ visible: false }),
    submit: () => {
      set((state) => {
        locationActions.setState({
          locationMode: state.locationMode,
          aroundMeRadius: state.aroundMeRadius,
          aroundPlaceAddress: state.aroundPlaceAddress,
          aroundPlaceRadius: state.aroundPlaceRadius,
        })
        return { visible: false }
      })
    },
    setAroundMe: () => set({ locationMode: LocationMode.AROUND_ME }),
    setAroundMeRadius: (radius: number) => set({ aroundMeRadius: radius }),
    setAroundPlace: () => set({ locationMode: LocationMode.AROUND_PLACE }),
    setAroundPlaceAddress: (address: string) => set({ aroundPlaceAddress: address }),
    setAroundPlaceRadius: (radius: number) => set({ aroundPlaceRadius: radius }),
    setEverywhere: () => set({ locationMode: LocationMode.EVERYWHERE }),
  }),
})

export const locationModalActions = locationModalStore.actions
export const locationModalSelectors = locationModalStore.selectors
