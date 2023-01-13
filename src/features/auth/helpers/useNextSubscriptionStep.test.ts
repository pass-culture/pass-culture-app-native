import { rest } from 'msw'

import { IdentityCheckMethod, NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { env } from 'libs/environment'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { useNextSubscriptionStep } from './useNextSubscriptionStep'

const setError = jest.fn()
jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const allowedIdentityCheckMethods = [IdentityCheckMethod.ubble]

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

jest.unmock('react-query')
describe('useNextSubscriptionStep', () => {
  mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

  it.each(Object.values(SubscriptionStep))(
    'should return expected step',
    async (expectedSubscriptionStep) => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
      })
      mockNextStepRequest({
        allowedIdentityCheckMethods,
        nextSubscriptionStep: expectedSubscriptionStep,
        stepperIncludesPhoneValidation: false,
        hasIdentityCheckPending: false,
      })
      const { result } = renderNextSubscriptionStepHook()

      await waitFor(() => {
        expect(result.current.data?.nextSubscriptionStep).toBe(expectedSubscriptionStep)
        expect(setError).not.toBeCalled()
      })
    }
  )

  it('should not fetch query if user is not logged in', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['email-validation'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })
    const { result } = renderNextSubscriptionStepHook()

    await waitFor(() => {
      expect(setError).not.toBeCalled()
      expect(result.current.data).toBeUndefined()
    })
  })

  it('should not fetch query if user is logged in and not connected', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false, isInternetReachable: false })
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['email-validation'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })
    const { result } = renderNextSubscriptionStepHook()

    await waitFor(() => {
      expect(setError).not.toBeCalled()
      expect(result.current.data).toBeUndefined()
    })
  })

  it('should set error and return undefined if request fails', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
    mockNextStepRequestError()
    const { result } = renderNextSubscriptionStepHook()

    await waitFor(() => {
      expect(setError).toBeCalledTimes(1)
      expect(result.current.data).toBeUndefined()
    })
  })
})

function mockNextStepRequest(nextSubscription: NextSubscriptionStepResponse) {
  return server.use(
    rest.get<NextSubscriptionStepResponse>(
      env.API_BASE_URL + `/native/v1/subscription/next_step`,
      (_req, res, ctx) => res.once(ctx.status(200), ctx.json(nextSubscription))
    )
  )
}

function mockNextStepRequestError() {
  return server.use(
    rest.get<NextSubscriptionStepResponse>(
      env.API_BASE_URL + `/native/v1/subscription/next_step`,
      (_req, res, ctx) => res.once(ctx.status(400))
    )
  )
}

const renderNextSubscriptionStepHook = () =>
  renderHook(() => useNextSubscriptionStep(setError), {
    /* eslint-disable local-rules/no-react-query-provider-hoc */
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
