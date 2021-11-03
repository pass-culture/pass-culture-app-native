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

export const decodeAccessToken = (token: string) => {
  try {
    return jwtDecode<AccessToken>(token)
  } catch {
    return null
  }
}

export const getUserIdFromAccesstoken = (accessToken: string) => {
  const tokenContent = decodeAccessToken(accessToken)

  return tokenContent?.user_claims?.user_id ?? null
}

type AccessTokenStatus = 'valid' | 'expired' | 'unknown'

export const getAccessTokenStatus = (accessToken: string | null): AccessTokenStatus => {
  if (!accessToken) return 'unknown'
  const tokenContent = decodeAccessToken(accessToken)
  if (!tokenContent?.exp) return 'unknown'
  return tokenContent.exp * 1000 > Date.now() ? 'valid' : 'expired'
}
