import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SubscriptionStep,
  UserProfilingFraudRequest,
  UserProfilingSessionIdResponse,
} from 'api/gen'
import { UserProfiling } from 'features/auth/signup/UserProfiling'
import { env } from 'libs/environment'
import { UserProfilingError } from 'libs/monitoring/errors'
import { server } from 'tests/server'
import { render } from 'tests/utils/web'

jest.mock('react-query')
jest.mock('@pass-culture/react-native-profiling', () => ({
  profileDevice: jest.fn(),
}))

const resetErrorBoundary = jest.fn()
const defaultProps = {
  error: new UserProfilingError('UserProfilingError', UserProfiling),
  resetErrorBoundary,
}
const allowedIdentityCheckMethods = [IdentityCheckMethod.ubble]

describe('<UserProfiling />', () => {
  beforeEach(jest.clearAllMocks)
  afterAll(jest.clearAllMocks)

  it('should trigger profiling when SubscriptionStep is UserProfiling', () => {
    jest.useFakeTimers()
    mockBackend({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['user-profiling'],
      hasIdentityCheckPending: false,
    })

    render(<UserProfiling {...defaultProps} />)
    jest.advanceTimersByTime(10000)
    waitForExpect(() => {
      expect(resetErrorBoundary).toBeCalled()
    })
    jest.useRealTimers()
  })

  it('should not trigger profiling when SubscriptionStep is IdentityCheck', () => {
    jest.useFakeTimers()
    mockBackend({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep['identity-check'],
      hasIdentityCheckPending: false,
    })

    render(<UserProfiling {...defaultProps} />)
    jest.advanceTimersByTime(10000)
    waitForExpect(() => {
      expect(resetErrorBoundary).not.toBeCalled()
    })
    jest.useRealTimers()
  })
})

function mockBackend(nextSubscription: NextSubscriptionStepResponse) {
  return server.use(
    rest.get<UserProfilingSessionIdResponse>(
      env.API_BASE_URL + `/native/v1/user_profiling/session_id`,
      (_req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            sessionId: 'XYZSESSION',
          })
        )
    ),
    rest.post<UserProfilingFraudRequest>(
      env.API_BASE_URL + `/native/v1/user_profiling`,
      (_req, res, ctx) => res.once(ctx.status(201))
    ),
    rest.get<NextSubscriptionStepResponse>(
      env.API_BASE_URL + `/native/v1/subscription/next_step`,
      (_req, res, ctx) => res.once(ctx.status(200), ctx.json(nextSubscription))
    )
  )
}
