// eslint-disable-next-line no-restricted-imports
import { useNetInfo as actualUseNetInfo } from '@react-native-community/netinfo'

export const useNetInfo: typeof actualUseNetInfo = jest.fn().mockReturnValue({
  isConnected: true,
  type: 'cellular',
})

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
