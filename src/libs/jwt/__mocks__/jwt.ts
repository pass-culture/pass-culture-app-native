export const decodeAccessToken = jest.fn(jest.requireActual('libs/jwt').decodeAccessToken)
export const getAccessTokenStatus = jest.fn(() => 'valid')
export const getUserIdFromAccesstoken = jest.fn(
  jest.requireActual('libs/jwt').getUserIdFromAccesstoken
)
