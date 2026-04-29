import { DeviceInfoV2 } from 'api/gen'
import { createStore } from 'libs/store/createStore'

type State =
  | {
      deviceInfo: DeviceInfoV2
    }
  | undefined

const defaultState: State = undefined

const deviceInfoStore = createStore({
  name: 'device-info',
  defaultState,
  actions: (set: (state: State) => void) => ({
    setDeviceInfo: (deviceInfo: DeviceInfoV2) => set({ deviceInfo }),
    resetDeviceInfo: () => set(defaultState),
  }),
  selectors: {
    selectDeviceInfo: () => (state: State) => state?.deviceInfo,
  },
  options: { persist: true },
})

export const deviceInfoStoreActions = deviceInfoStore.actions
export const deviceInfoStoreSelectors = deviceInfoStore.selectors
