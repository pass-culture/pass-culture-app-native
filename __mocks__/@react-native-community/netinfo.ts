// eslint-disable-next-line no-restricted-imports
import { useNetInfo as actualUseNetInfo } from '@react-native-community/netinfo'

const STATUS = {
  isConnected: true,
  isInternetReachable: true,
  type: 'cellular',
}

export const fetch = jest.fn().mockResolvedValue(STATUS)

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
