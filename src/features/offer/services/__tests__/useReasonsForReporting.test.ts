import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { OfferReportReasons } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { offerResponseSnap } from 'features/offer/api/snaps/offerResponseSnap'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { useReasonsForReporting } from '../useReasonsForReporting'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

server.use(
  rest.get<OfferReportReasons>(
    env.API_BASE_URL + '/native/v1/offer/report/reasons',
    (req, res, ctx) => res(ctx.status(200), ctx.json(offerResponseSnap))
  )
)

describe('useReasonsForReporting hook', () => {
  afterEach(jest.resetAllMocks)

  it('should retrieve reasons for reporting data when logged in', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: true,
      setIsLoggedIn: jest.fn(),
    }))
    const { result, waitFor } = renderHook(useReasonsForReporting, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.isFetching).toEqual(true)
    await waitFor(() => result.current.isSuccess)

    expect(result.current.isSuccess).toEqual(true)
  })

  it('should return null when not logged in', async () => {
    mockUseAuthContext.mockImplementationOnce(() => ({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
    }))

    const { result } = renderHook(useReasonsForReporting, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.isFetching).toEqual(false)
  })
})
