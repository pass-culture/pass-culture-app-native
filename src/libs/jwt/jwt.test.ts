import * as jwtDecode from 'jwt-decode'
import mockdate from 'mockdate'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { computeTokenRemainingLifetimeInMs, getTokenStatus } from 'libs/jwt/jwt'

mockdate.set(CURRENT_DATE)

const mockJwtDecode = jest.spyOn(jwtDecode, 'default')

describe('getTokenStatus', () => {
  const fakeAccessToken = 'this is a fake access token, because we mock result of jwt-decode'

  it('unknown status given no access token', () => {
    const fakeAccessToken = null

    const accessTokenStatus = getTokenStatus(fakeAccessToken)

    expect(accessTokenStatus).toBe('unknown')
  })

  it("unknown status when access token can't be read", () => {
    mockJwtDecode.mockImplementationOnce(() => {
      throw new Error("this token can't be read")
    })

    const accessTokenStatus = getTokenStatus(fakeAccessToken)

    expect(accessTokenStatus).toBe('unknown')
  })

  it('expired status given access token that expires before current date', () => {
    mockJwtDecode.mockReturnValueOnce({
      exp: new Date().getTime() / 1000 - 1,
    } as jwtDecode.JwtPayload)

    const accessTokenStatus = getTokenStatus(fakeAccessToken)

    expect(accessTokenStatus).toBe('expired')
  })

  it('valid status given access token that expires in the future and expiration is more than 2 minutes away', () => {
    mockJwtDecode.mockReturnValueOnce({
      exp: new Date().getTime() / 1000 + 2 * 60 + 1,
    } as jwtDecode.JwtPayload)

    const accessTokenStatus = getTokenStatus(fakeAccessToken)

    expect(accessTokenStatus).toBe('valid')
  })

  it('expired status given access token that expires in the future and expiration is exactly 2 minutes', () => {
    mockJwtDecode.mockReturnValueOnce({
      exp: new Date().getTime() / 1000 + 2 * 60,
    } as jwtDecode.JwtPayload)

    const accessTokenStatus = getTokenStatus(fakeAccessToken)

    expect(accessTokenStatus).toBe('expired')
  })

  it('expired status given access token that expires in the future and expiration is less than 2 minutes away', () => {
    mockJwtDecode.mockReturnValueOnce({
      exp: new Date().getTime() / 1000 + 2 * 60 - 1,
    } as jwtDecode.JwtPayload)

    const accessTokenStatus = getTokenStatus(fakeAccessToken)

    expect(accessTokenStatus).toBe('expired')
  })
})

const tokenRemainingLifetimeInMs = 10 * 60 * 1000
const decodedAccessToken = {
  fresh: false,
  iat: 1689576398,
  jti: 'a90f96de-185d-4edb-a878-d714eea7ff74',
  type: 'access',
  sub: 'bene_18@example.com',
  nbf: 1689576398,
  exp: (CURRENT_DATE.getTime() + tokenRemainingLifetimeInMs) / 1000,
  user_claims: {
    user_id: 12713,
  },
}

describe('computeTokenRemainingLifetimeInMs', () => {
  it('should return undefined when token can not be decoded', () => {
    mockJwtDecode.mockReturnValueOnce(null)

    expect(computeTokenRemainingLifetimeInMs('abc')).toBeUndefined()
  })

  it('should return remaining lifetime in milliseconds', () => {
    mockJwtDecode.mockReturnValueOnce(decodedAccessToken)

    expect(computeTokenRemainingLifetimeInMs('abc')).toEqual(tokenRemainingLifetimeInMs)
  })
})
