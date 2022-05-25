import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { IdentityCheckMethod, NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useNextSubscriptionStep } from 'features/auth/signup/useNextSubscriptionStep'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

const setError = jest.fn()
jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const allowedIdentityCheckMethods = [IdentityCheckMethod.ubble]

describe('useNextSubscriptionStep', () => {
  it.each(Object.values(SubscriptionStep))(
    'should return expected step',
    async (expectedSubscriptionStep) => {
      mockUseAuthContext.mockReturnValueOnce({
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
      })
      mockNextStepRequest({
        allowedIdentityCheckMethods,
        nextSubscriptionStep: expectedSubscriptionStep,
        stepperIncludesPhoneValidation: false,
        hasIdentityCheckPending: false,
      })
      const { result, waitFor } = renderNextSubscriptionStepHook()
      await waitFor(() => result.current.isLoading === false)

      expect(result.current.data?.nextSubscriptionStep).toBe(expectedSubscriptionStep)
      expect(setError).not.toBeCalled()
    }
  )

  it('should not fetch query if user is not logged in', async () => {
    mockNextStepRequest({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['email-validation'],
      stepperIncludesPhoneValidation: false,
      hasIdentityCheckPending: false,
    })
    const { result, waitFor } = renderNextSubscriptionStepHook()
    await waitFor(() => result.current.isLoading === false)

    expect(setError).not.toBeCalled()
    expect(result.current.data).toBeUndefined()
  })

  it('should set error and return undefined if request fails', async () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    })
    mockNextStepRequestError()
    const { result, waitFor } = renderNextSubscriptionStepHook()
    await waitFor(() => result.current.isLoading === false)

    expect(setError).toBeCalledTimes(1)
    expect(result.current.data).toBeUndefined()
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
