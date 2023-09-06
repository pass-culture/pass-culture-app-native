export const tokenRemainingLifetimeInMs = 10 * 60 * 1000
export const defaultDecodedToken = {
  iat: 1691670780,
  jti: '7f82c8b0-6222-42be-b913-cdf53958f17d',
  sub: 'bene_18@example.com',
  nbf: 1691670780,
  user_claims: { user_id: 1234 },
}
export const decodedTokenWithRemainingLifetime = {
  ...defaultDecodedToken,
  exp: (Date.now() + tokenRemainingLifetimeInMs) / 1000,
}
