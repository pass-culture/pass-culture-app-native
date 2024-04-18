import { getTokenInfo } from 'features/trustedDevice/helpers/getTokenInfo'
import { eventMonitoring } from 'libs/monitoring'

jest.unmock('jwt-decode')

const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJkYXRhIjp7ImRhdGVDcmVhdGVkIjoiMjAyMy0wNi0wOVQxMDowMDowMFoiLCJsb2NhdGlvbiI6IlBhcmlzIiwib3MiOiJpT1MiLCJzb3VyY2UiOiJpUGhvbmUgMTMifSwiZXhwIjoxNzAxOTM4MDE4fQ.quizgw61p4gX_B2Liz-WdoJlWadTx9kHMPKoEV_5tHI'
const INVALID_TOKEN = 'abc'

describe('getTokenInfo', () => {
  it('should contain login information when token is valid', () => {
    const tokenInfo = getTokenInfo(VALID_TOKEN)

    expect(tokenInfo).toEqual({
      exp: 1_701_938_018,
      user_id: 1,
      data: {
        location: 'Paris',
        dateCreated: '2023-06-09T10:00:00Z',
        os: 'iOS',
        source: 'iPhone 13',
      },
    })
  })

  it('should be undefined when token is invalid', () => {
    const tokenInfo = getTokenInfo(INVALID_TOKEN)

    expect(tokenInfo).toBeUndefined()
  })

  it('should be log to sentry when token is invalid', () => {
    getTokenInfo(INVALID_TOKEN)

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      "Failed to get token info from suspicious login email: InvalidTokenError: Invalid token specified: Cannot read properties of undefined (reading 'replace')",
      { extra: { token: INVALID_TOKEN } }
    )
  })
})
