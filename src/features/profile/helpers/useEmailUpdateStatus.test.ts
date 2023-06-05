import { rest } from 'msw'

import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { env } from 'libs/environment'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { useEmailUpdateStatus } from './useEmailUpdateStatus'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

const emailUpdateStatus: EmailUpdateStatus = {
  expired: false,
  newEmail: 'bene_18x@example.com',
  status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
}

server.use(
  rest.get<EmailUpdateStatus>(
    env.API_BASE_URL + '/native/v1/profile/email_update/status',
    (req, res, ctx) => res(ctx.status(200), ctx.json(emailUpdateStatus))
  )
)

describe('useEmailUpdateStatus hook', () => {
  afterEach(jest.resetAllMocks)

  it('should retrieve email update status when logged in and internet connection is ok', async () => {
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
