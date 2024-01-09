import { decodeToken } from 'libs/jwt/jwt'

export const getTokenExpirationDate = (token: string) => {
  const tokenContent = decodeToken(token)
  if (!tokenContent?.exp) return null
  return new Date(tokenContent.exp * 1000).toISOString()
}
