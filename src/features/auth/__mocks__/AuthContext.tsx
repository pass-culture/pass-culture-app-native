import { IAuthContext } from '../AuthContext'

export const setIsLoggedIn = jest.fn()
export const signUp = jest.fn()
export const signOut = jest.fn()

export const useSignUp = jest.fn(() => signUp)
export const useSignOut = jest.fn(() => signOut)
export const useAuthContext = jest.fn(
  (): IAuthContext => ({
    setIsLoggedIn,
    signUp,
    signOut,
    isLoggedIn: false,
  })
)
