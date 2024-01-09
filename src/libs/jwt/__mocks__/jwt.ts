export const decodeToken = jest.fn(jest.requireActual('libs/jwt').decodeToken)
export const getTokenStatus = jest.fn(() => 'valid')
export const getUserIdFromAccessToken = jest.fn(
  jest.requireActual('libs/jwt').getUserIdFromAccessToken
)
