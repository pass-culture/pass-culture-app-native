import { useNetInfo } from '@react-native-community/netinfo'

export const useNetwork = () => {
  const networkInfo = useNetInfo()

  return {
    isConnected: networkInfo.isConnected ?? false,
  }
}
