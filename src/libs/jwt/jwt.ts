import jwtDecode from 'jwt-decode'

interface AccessToken {
  exp: number
  fresh: boolean
  iat: number
  sub: string
  jti: string
  nbf: number
  type: string
}

export const decodeToken = (token: string) => {
  try {
    return jwtDecode<AccessToken>(token)
  } catch {
    return null
  }
}

type TokenStatus = 'valid' | 'expired' | 'unknown'

const TOKEN_EXPIRATION_BUFFER_MS = 1 * 60 * 1000 // 1 minute buffer in milliseconds

export const getTokenStatus = (encodedToken: string | null): TokenStatus => {
  if (!encodedToken) return 'unknown'
  const token = decodeToken(encodedToken)
  if (!token?.exp) return 'unknown'
  const currentTimeWithBuffer = Date.now() + TOKEN_EXPIRATION_BUFFER_MS
  return token.exp * 1000 > currentTimeWithBuffer ? 'valid' : 'expired'
}

export const computeTokenRemainingLifetimeInMs = (encodedToken: string): number | undefined => {
  const token = decodeToken(encodedToken)
  if (!token) return undefined

  const tokenExpirationInMs = token.exp * 1000
  return tokenExpirationInMs - Date.now()
}
