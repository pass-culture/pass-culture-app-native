import { JwtPayload } from 'jwt-decode'

export const FAKE_USER_ID = 1234

export default jest.fn(
  (): JwtPayload | null =>
    ({
      // a date in far future to still get a valid token for api calls
      exp: 3454545353,
      user_claims: { user_id: FAKE_USER_ID },
    } as JwtPayload)
)
