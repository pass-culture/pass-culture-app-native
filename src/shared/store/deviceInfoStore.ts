import { DeviceInfoV2 } from 'api/gen'
import { createStore } from 'libs/store/createStore'

type State = {
  deviceInfo: DeviceInfoV2 | null
}

const defaultState: State = { deviceInfo: null }

const deviceInfoStore = createStore({
  name: 'device-info',
  defaultState,
  actions: (set) => ({
    setDeviceInfo: (deviceInfo: DeviceInfoV2) => set({ deviceInfo }),
    resetDeviceInfo: () => set(defaultState),
  }),
  selectors: {
    selectDeviceInfo: () => (state) => state.deviceInfo,
  },
  options: { persist: true },
})

export const deviceInfoStoreActions = deviceInfoStore.actions
export const deviceInfoStoreSelectors = deviceInfoStore.selectors
