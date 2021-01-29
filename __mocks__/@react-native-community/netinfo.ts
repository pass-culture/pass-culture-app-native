import { useNetInfo as actualUseNetInfo, NetInfoStateType as actualNetInfoStateType } from '@react-native-community/netinfo'

export const useNetInfo: typeof actualUseNetInfo = jest.fn().mockReturnValue({
    isConnected: true,
    type: 'cellular'
})
