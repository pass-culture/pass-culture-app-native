// eslint-disable-next-line no-restricted-imports
import { useNetInfo as actualUseNetInfo } from '@react-native-community/netinfo'

export const useNetInfo: typeof actualUseNetInfo = jest.fn().mockReturnValue({
  isConnected: true,
  type: 'cellular',
})

export enum NetInfoStateType {
  unknown = 'unknown',
}
