import * as jwtDecode from 'jwt-decode'

import { getTokenStatus } from 'libs/jwt'

jest.unmock('libs/jwt')

describe('getTokenStatus', () => {
  const mockJwtDecode = jest.spyOn(jwtDecode, 'default')
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

  it('valid status given access token that expires in the future', () => {
    mockJwtDecode.mockReturnValueOnce({
      exp: new Date().getTime() / 1000 + 1,
    } as jwtDecode.JwtPayload)

    const accessTokenStatus = getTokenStatus(fakeAccessToken)

    expect(accessTokenStatus).toBe('valid')
  })
})
