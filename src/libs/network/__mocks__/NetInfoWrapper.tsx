import { useNetInfoContext as actualUseNetInfoContext } from '../NetInfoWrapper'

export const useNetInfoContext = jest.fn().mockReturnValue({
  isConnected: true,
}) as jest.MockedFunction<typeof actualUseNetInfoContext>
