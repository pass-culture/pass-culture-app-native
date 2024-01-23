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

export const getTokenStatus = (token: string | null): TokenStatus => {
  if (!token) return 'unknown'
  const tokenContent = decodeToken(token)
  if (!tokenContent?.exp) return 'unknown'
  return tokenContent.exp * 1000 > Date.now() ? 'valid' : 'expired'
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
