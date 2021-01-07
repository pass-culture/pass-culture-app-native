import { IAuthContext } from '../AuthContext'

export const setIsLoggedIn = jest.fn()
export const signOut = jest.fn()

export const useSignOut = jest.fn(() => signOut)
export const useAuthContext = jest.fn(
  (): IAuthContext => ({
    setIsLoggedIn,
    signOut,
    isLoggedIn: false,
  })
)
