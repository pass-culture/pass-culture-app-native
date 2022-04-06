const { decodeAccessToken, getUserIdFromAccesstoken } = jest.requireActual('libs/jwt')

export { decodeAccessToken, getUserIdFromAccesstoken }

export const getAccessTokenStatus = jest.fn(() => 'valid')
