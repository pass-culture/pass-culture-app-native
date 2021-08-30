import { LaunchNavigatorOptions } from 'react-native-launch-navigator'

export const getAvailableApps = jest.fn(() =>
  Promise.resolve({ google_maps: true, waze: true, citymapper: false })
)
export const navigate = jest.fn((_args: LaunchNavigatorOptions) => Promise.resolve())

export default {
  getAvailableApps,
  navigate,
}
