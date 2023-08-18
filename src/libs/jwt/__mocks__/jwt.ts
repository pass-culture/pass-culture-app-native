export const decodeAccessToken = jest.fn(jest.requireActual('libs/jwt').decodeAccessToken)
export const getTokenStatus = jest.fn(() => 'valid')
export const getUserIdFromAccesstoken = jest.fn(
  jest.requireActual('libs/jwt').getUserIdFromAccesstoken
)
