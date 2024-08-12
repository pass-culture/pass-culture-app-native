import jwtDecode from 'jwt-decode'

interface AccessToken {
  exp: number
  fresh: boolean
  iat: number
  sub: string
  jti: string
  nbf: number
  type: string
  user_claims?: {
    user_id?: number
  }
}

export const decodeToken = (token: string) => {
  try {
    return jwtDecode<AccessToken>(token)
  } catch {
    return null
  }
}

export const getUserIdFromAccessToken = (accessToken: string) => {
  const tokenContent = decodeToken(accessToken)

  return tokenContent?.user_claims?.user_id ?? null
}

type TokenStatus = 'valid' | 'expired' | 'unknown'

const TOKEN_EXPIRATION_BUFFER_MS = 2 * 60 * 1000 // 2 minutes buffer in milliseconds

export const getTokenStatus = (token: string | null): TokenStatus => {
  if (!token) return 'unknown'
  const tokenContent = decodeToken(token)
  if (!tokenContent?.exp) return 'unknown'
  const currentTimeWithBuffer = Date.now() + TOKEN_EXPIRATION_BUFFER_MS
  return tokenContent.exp * 1000 > currentTimeWithBuffer ? 'valid' : 'expired'
}

export const computeTokenRemainingLifetimeInMs = (encodedToken: string): number | undefined => {
  const token = decodeToken(encodedToken)

  if (token) {
    const tokenExpirationInMs = token.exp * 1000
    const currentDateInMs = Date.now()
    const lifetimeInMs = tokenExpirationInMs - currentDateInMs
    return lifetimeInMs
  }

  return undefined
}
