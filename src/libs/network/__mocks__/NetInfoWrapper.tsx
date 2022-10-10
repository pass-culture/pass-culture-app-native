import { useNetInfoContext as actualUseNetInfoContext } from '../NetInfoWrapper'

export const useNetInfoContext = jest.fn().mockReturnValue({
  isConnected: true,
  isInternetReachable: true,
}) as jest.MockedFunction<typeof actualUseNetInfoContext>
