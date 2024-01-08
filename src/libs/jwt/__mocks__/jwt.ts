export const decodeAccessToken = jest.fn(jest.requireActual('libs/jwt').decodeAccessToken)
export const getTokenStatus = jest.fn(() => 'valid')
export const getUserIdFromAccessToken = jest.fn(
  jest.requireActual('libs/jwt').getUserIdFromAccessToken
)
