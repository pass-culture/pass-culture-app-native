import { IAuthContext } from '../AuthContext'

export const setIsLoggedIn = jest.fn()

export const useAuthContext = jest.fn(
  (): IAuthContext => ({
    setIsLoggedIn,
    isLoggedIn: false,
  })
)

export const signOut = jest.fn()

export const useSignOut = jest.fn(() => signOut)