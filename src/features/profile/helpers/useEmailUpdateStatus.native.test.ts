import { rest } from 'msw'

import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { getEmailUpdateStatus, useEmailUpdateStatus } from './useEmailUpdateStatus'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

const emailUpdateStatus: EmailUpdateStatus = {
  expired: false,
  newEmail: 'bene_18x@example.com',
  status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
}

function simulateEmailUpdateStatus200() {
  server.use(
    rest.get<EmailUpdateStatus>(
      env.API_BASE_URL + '/native/v1/profile/email_update/status',
      (req, res, ctx) => res(ctx.status(200), ctx.json(emailUpdateStatus))
    )
  )
}

function simulateEmailUpdateStatusError(code: number) {
  server.use(
    rest.get<EmailUpdateStatus>(
      env.API_BASE_URL + '/native/v1/profile/email_update/status',
      (req, res, ctx) => res(ctx.status(code), ctx.json(emailUpdateStatus))
    )
  )
}

describe('useEmailUpdateStatus hook', () => {
  afterEach(jest.resetAllMocks)

  it('should retrieve email update status when logged in and internet connection is ok', async () => {
    simulateEmailUpdateStatus200()
    mockUseNetInfoContext.mockImplementationOnce(() => ({ isConnected: true }))
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    const { result } = renderHook(useEmailUpdateStatus, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(emailUpdateStatus)
    })
  })

  it('should return undefined when not logged in and internet connection is ok', async () => {
    simulateEmailUpdateStatus200()
    mockUseNetInfoContext.mockImplementationOnce(() => ({ isConnected: true }))
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    const { result } = renderHook(useEmailUpdateStatus, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.data).toEqual(undefined)
  })

  it('should return undefined when not logged in and internet connection is not ok', async () => {
    simulateEmailUpdateStatusError(500)
    mockUseNetInfoContext.mockImplementationOnce(() => ({ isConnected: false }))
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    }))

    const { result } = renderHook(useEmailUpdateStatus, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.data).toEqual(undefined)
  })
})

describe('getEmailUpdateStatus', () => {
  it('should capture a Sentry exception when error code is 422 and return undefined', async () => {
    simulateEmailUpdateStatusError(422)
    const emailUpdateStatus = await getEmailUpdateStatus()

    expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
    expect(emailUpdateStatus).toEqual(undefined)
  })

  it.each([
    401, // Unauthorized
    404, // Not Found
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should capture a Sentry exception when error code is %s and return undefined',
    async (statusCode) => {
      simulateEmailUpdateStatusError(statusCode)
      const emailUpdateStatus = await getEmailUpdateStatus()

      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
      expect(emailUpdateStatus).toEqual(undefined)
    }
  )

  it.each([
    401, // Unauthorized
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should capture a Sentry info when error code is %s and return undefined',
    async (statusCode) => {
      simulateEmailUpdateStatusError(statusCode)
      const emailUpdateStatus = await getEmailUpdateStatus()

      expect(eventMonitoring.captureMessage).toHaveBeenCalledTimes(1)
      expect(emailUpdateStatus).toEqual(undefined)
    }
  )
})
