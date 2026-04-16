const appleAuth = {
  performRequest: jest.fn().mockResolvedValue({
    authorizationCode: 'mockAppleAuthCode',
    identityToken: 'mockIdentityToken',
    email: 'mock@email.com',
    fullName: {
      givenName: 'Mock',
      familyName: 'User',
    },
    user: 'mockAppleUserId',
    nonce: 'mockNonce',
    state: null,
    realUserStatus: 1,
    authorizedScopes: [],
  }),
  Operation: {
    IMPLICIT: 0,
    LOGIN: 1,
    REFRESH: 2,
    LOGOUT: 3,
  },
  Scope: {
    EMAIL: 0,
    FULL_NAME: 1,
  },
  Error: {
    UNKNOWN: '1000',
    CANCELED: '1001',
    INVALID_RESPONSE: '1002',
    NOT_HANDLED: '1003',
    FAILED: '1004',
  },
  isSupported: true,
}

export default appleAuth
