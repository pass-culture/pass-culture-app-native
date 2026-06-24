export const decodeToken = jest.fn(jest.requireActual('libs/jwt/jwt').decodeToken)
export const getTokenStatus = jest.fn(() => 'valid')
export const computeTokenRemainingLifetimeInMs = jest.fn(
  jest.requireActual('libs/jwt/jwt').computeTokenRemainingLifetimeInMs
)
