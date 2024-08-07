// eslint-disable-next-line no-restricted-imports
import { useNetInfo as actualUseNetInfo } from '@react-native-community/netinfo'

const STATUS = {
  isConnected: true,
  isInternetReachabme: true,
  type: 'cellular',
}

export const fetch = () => Promise.resolve(STATUS)

export const useNetInfo: typeof actualUseNetInfo = jest.fn().mockReturnValue(STATUS)

// We copy this type from the real NetInfoStateType
export enum NetInfoStateType {
  unknown = 'unknown',
  none = 'none',
  cellular = 'cellular',
  wifi = 'wifi',
  bluetooth = 'bluetooth',
  ethernet = 'ethernet',
  wimax = 'wimax',
  vpn = 'vpn',
  other = 'other',
}
