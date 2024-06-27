export const decodeToken = jest.fn(jest.requireActual('libs/jwt/jwt').decodeToken)
export const getTokenStatus = jest.fn(() => 'valid')
export const getUserIdFromAccessToken = jest.fn(
  jest.requireActual('libs/jwt/jwt').getUserIdFromAccessToken
)
export const computeTokenRemainingLifetimeInMs = jest.fn(
  jest.requireActual('libs/jwt/jwt').computeTokenRemainingLifetimeInMs
)
