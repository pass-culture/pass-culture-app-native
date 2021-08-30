import { useNetInfo as actualUseNetInfo } from '@react-native-community/netinfo'

export const useNetInfo: typeof actualUseNetInfo = jest.fn().mockReturnValue({
  isConnected: true,
  type: 'cellular',
})
